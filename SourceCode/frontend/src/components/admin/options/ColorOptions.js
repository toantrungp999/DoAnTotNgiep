import React, { Component } from "react";
import ColorOptionItem from "../optionItem/ColorOptionItem";
import ColorOptionAdd from "../optionItem/ColorOptionAdd";
import ROLES from "../../../constants/Roles";
import Loading from "../../common/loading/Loading";

class ColorOptions extends Component {
  render() {
    const { colorOptions, actionColorLoading, colorLoading } =
      this.props.productOptionsReducer;
    if (colorLoading)
      return (
        <div>
          <Loading />
        </div>
      );
    else {
      const role = this.props.role;
      const elementData = colorOptions
        ? colorOptions.map((colorOption, index) => {
            return (
              <ColorOptionItem
                role={role}
                key={colorOption._id}
                index={index}
                colorOption={colorOption}
                onUpdateColorOption={this.props.onUpdateColorOption}
              />
            );
          })
        : null;
      return (
        <div>
          <table className="table mt-2 table-product">
            <thead>
              <tr>
                <th>Màu</th>
                <th>Hình</th>
                {role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN ? (
                  <th></th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) &&
              !actionColorLoading ? (
                <ColorOptionAdd
                  _id={this.props._id}
                  onCreateColorOption={this.props.onCreateColorOption}
                />
              ) : null}
              {elementData}
            </tbody>
          </table>
        </div>
      );
    }
  }
}
export default ColorOptions;
