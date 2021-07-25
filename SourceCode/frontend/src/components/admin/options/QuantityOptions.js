import React, { Component, memo } from "react";
import QuantityOptionItem from "../optionItem/QuantityOptionItem";
import QuantityOptionAdd from "../optionItem/QuantityOptionAdd";
import { findIndexById } from "../../../extentions/ArrayEx";
import Loading from "../../common/loading/Loading";

class QuantityOptions extends Component {
  render() {
    const { quantityLoading } = this.props.productOptionsReducer;
    if (quantityLoading)
      return (
        <div>
          <Loading />
        </div>
      );
    else {
      const { colorOptions, sizeOptions, quantityOptions } =
        this.props.productOptionsReducer;

      const quantityOptionsByColor =
        quantityOptions && colorOptions
          ? colorOptions.map((color) => {
              let array = [];
              for (let i = quantityOptions.length - 1; i >= 0; i--) {
                if (quantityOptions[i].colorId === color._id)
                  array.push(quantityOptions[i]);
              }
              return {
                colorId: color._id,
                array,
              };
            })
          : [];

      const elementData = quantityOptionsByColor
        ? quantityOptionsByColor.map((options, index) => {
            index = colorOptions
              ? findIndexById(colorOptions, options.colorId)
              : -1;
            let color = colorOptions[index].color;
            return (
              <>
                <tr>
                  <th
                    className="align-middle"
                    rowSpan={
                      (options.array.length !== 0 ? options.array.length : 0) +
                      1
                    }
                  >
                    {color}
                  </th>
                </tr>
                {options.array
                  ? options.array.map((quantityOption, index) => {
                      return (
                        <QuantityOptionItem
                          key={quantityOption._id}
                          index={index}
                          colorOptions={colorOptions}
                          sizeOptions={sizeOptions}
                          onUpdateQuantityOption={
                            this.props.onUpdateQuantityOption
                          }
                          quantityOption={quantityOption}
                        />
                      );
                    })
                  : null}
                <tr className="empty-row">
                  <td colSpan="6"></td>
                </tr>
              </>
            );
          })
        : null;
      return (
        <div>
          <table className="table mt-20 table-product">
            <thead>
              <tr>
                <th>Kích thước</th>
                <th>Màu</th>
                <th>Số lượng</th>
                <th>Đang đặt</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <QuantityOptionAdd
                quantityOptions={quantityOptions}
                _id={this.props._id}
                colorOptions={this.props.productOptionsReducer.colorOptions}
                sizeOptions={this.props.productOptionsReducer.sizeOptions}
                onCreateQuantityOption={this.props.onCreateQuantityOption}
              />
              {elementData}
            </tbody>
          </table>
        </div>
      );
    }
  }
}
export default memo(QuantityOptions);
