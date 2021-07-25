import React, { Component } from "react";
import SizeOptionItem from "../optionItem/SizeOptionItem";
import SizeOptionAdd from "../optionItem/SizeOptionAdd";
import ROLES from "../../../constants/Roles";
import Loading from "../../common/loading/Loading";

class SizeOptions extends Component {
  render() {
    const { sizeOptions, actionSizeLoading, sizeLoading } =
      this.props.productOptionsReducer;
    if (sizeLoading)
      return (
        <div>
          <Loading />
        </div>
      );
    else {
      const role = this.props.role;
      const elementData = sizeOptions
        ? sizeOptions.map((sizeOption, index) => {
            return (
              <SizeOptionItem
                role={role}
                key={sizeOption._id}
                index={index}
                sizeOption={sizeOption}
                onUpdateSizeOption={this.props.onUpdateSizeOption}
              />
            );
          })
        : null;
      return (
        <div>
          <table className="table mt-2 table-product">
            <thead>
              <tr>
                <th>Kích cỡ</th>
                {role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN ? (
                  <th></th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {(role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) &&
              !actionSizeLoading ? (
                <SizeOptionAdd
                  _id={this.props._id}
                  onCreateSizeOption={this.props.onCreateSizeOption}
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
export default SizeOptions;
