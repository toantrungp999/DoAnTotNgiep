import React, { Component } from "react";
import { Link } from "react-router-dom";
class ProductItem extends Component {
  render() {
    const { _id, name, brandId, categoryId, price, orgin, status } =
      this.props.product;
    const statusElement =
      status === true ? (
        <input type="checkbox" readOnly checked />
      ) : (
        <input type="checkbox" readOnly />
      );
    return (
      <tr>
        <td>{name}</td>
        <td>{brandId.name}</td>
        <td>{categoryId.name}</td>
        <td>{orgin}</td>
        <td>{price}</td>
        <td>{statusElement}</td>
        <td>
          <Link to={`/admin/productoptions/${_id}`}>
            <i className="fa fa-edit"></i>
          </Link>
        </td>
        <td>
          <Link to={`/admin/products/detail/${_id}`}>
            <i className="fa fa-edit"></i>
          </Link>
        </td>
      </tr>
    );
  }
}
export default ProductItem;
