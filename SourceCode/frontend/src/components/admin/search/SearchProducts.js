import React, { Component, memo } from "react";

class SearchProducts extends Component {
  state = {
    search: "",
    isGotoUrl: false,
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter")
      if (this.state.search && this.state.search.length > 0) {
        this.props.history.push(`/admin/products/search=${this.state.search}`);
        this.setState({ search: "" });
      }
  };

  render() {
    return (
      <div className="search-product">
        <i className="fa fa-search"></i>
        <input
          className="topinput-admin"
          id="search-keyword"
          type="text"
          value={this.props.search}
          name="search"
          onChange={this.props.onChange}
          placeholder="Bạn tìm gì..."
          autoComplete="off"
          maxLength="50"
        />
      </div>
    );
  }
}
export default memo(SearchProducts);
