import React, { Component, memo } from "react";
import Suggestions from "./Suggestions";
import { Collapse } from "@material-ui/core";
import "./search.css";
class Search extends Component {
  state = {
    search: "",
  };

  getInfo = (value, pageSize) => {
    this.props.searchProducts(value, pageSize);
  };

  componentDidUpdate(prevProps) {}

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.search !== nextProps.searchProducts.key) {
      if (nextProps.searchProducts.key)
        return { search: nextProps.searchProducts.key };
    }
    return null;
  }

  onChange = (e) => {
    const target = e.target;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
    if (name === "search") {
      this.props.searchProducts(value);
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter")
      if (this.state.search && this.state.search.length > 0) {
        this.props.history.push(`/search?key=${this.state.search}`);
        this.props.closeSearch();
      }
  };

  render() {
    const { searchProducts } = this.props.searchProductsReducer;
    const { show } = this.props;
    return (
      <div className="header-search-container">
        <Collapse in={show}>
          <div className="header-search">
            <input
              id="search-keyword"
              type="text"
              value={this.state.search}
              name="search"
              onChange={this.onChange}
              aria-label="Bạn tìm gì..."
              onKeyDown={this.handleKeyDown}
              placeholder="Bạn tìm gì..."
              autoComplete="off"
              maxLength="50"
            />
            <button
              type="button"
              aria-label="tìm kiếm"
              onClick={this.props.closeSearch}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <Suggestions
            results={searchProducts}
            closeSearch={this.props.closeSearch}
          />
        </Collapse>
      </div>
    );
  }
}
export default memo(Search);
