import React, { Component, memo } from "react";

class SearchUsers extends Component {
  state = {
    search: "",
    isGotoUrl: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ search: "", isGotoUrl: true });
    }
  }

  onChange = (e) => {
    const target = e.target;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
    if (name === "search") {
      if (this.state.isGotoUrl) this.setState({ isGotoUrl: false });
      else {
        if (value && value.length > 0) {
          this.props.searchUsers(value, 1, 8, false);
        }
      }
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter")
      if (this.state.search && this.state.search.length > 0) {
        this.props.history.push(`/admin/users/search=${this.state.search}`);
        this.setState({ search: "" });
      }
  };

  render() {
    return (
      <div id="search-admin-site">
        <i className="fa fa-search"></i>
        <input
          className="topinput-admin"
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
        {/* {searchResult && this.state.search && searchResult.length > 0 ? <SuggestUsers results={searchResult} /> : ''} */}
      </div>
    );
  }
}
export default memo(SearchUsers);
