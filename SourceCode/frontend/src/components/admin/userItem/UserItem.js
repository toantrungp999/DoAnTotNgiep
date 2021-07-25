import React, { Component } from "react";
import { Link } from "react-router-dom";
class UserItem extends Component {
  render() {
    var { name, phoneNumber, email, male, status } = this.props.user;
    var maleElement = male ? "Nam" : "Nữ";
    if (male === undefined) maleElement = "------";
    var statusElement = status ? (
      <input type="checkbox" readOnly checked />
    ) : (
      ""
    );
    return (
      <tr>
        <td>{name}</td>
        <td>{phoneNumber}</td>
        <td>{email}</td>
        <td>{maleElement}</td>
        <td>{statusElement}</td>
        <td>
          <Link to={`/admin/users/detail/${this.props.user._id}`}>
            <i className="fa fa-edit"></i>
          </Link>
        </td>
      </tr>
    );
  }
}
export default UserItem;
