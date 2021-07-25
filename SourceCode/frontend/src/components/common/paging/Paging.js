import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Paging.css";
class Paging extends Component {
  onClickPage = (page) => {
    const { pagingInfo } = this.props;
    if (pagingInfo && pagingInfo.totalPage >= page) {
      this.props.onFetchData(page);
    }
  };

  onPrev = () => {
    const { pagingInfo } = this.props;
    if (pagingInfo && pagingInfo.currentPage > 1) {
      this.props.onFetchData(pagingInfo.currentPage - 1);
    }
  };

  onNext = () => {
    const { pagingInfo } = this.props;
    if (pagingInfo && pagingInfo.totalPage > pagingInfo.currentPage) {
      this.props.onFetchData(pagingInfo.currentPage + 1);
    }
  };

  render() {
    const { pagingInfo, loading } = this.props;
    console.log(pagingInfo);
    let paging = [];
    if (pagingInfo) {
      for (let i = 1; i <= pagingInfo.totalPage; i++) {
        if (i === pagingInfo.currentPage)
          paging.push(
            <li key={i} className="page active">
              <Link
                className=""
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                {i}
                <span className="sr-only">(current)</span>
              </Link>
            </li>
          );
        else {
          if (
            i === 1 ||
            i === pagingInfo.totalPage ||
            Math.abs(Math.abs(i - pagingInfo.currentPage) < 3)
          ) {
            paging.push(
              <li key={i} className="page">
                <Link
                  className=""
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    this.onClickPage(i);
                  }}
                >
                  {i}
                </Link>
              </li>
            );
          } else if (Math.abs(i - pagingInfo.currentPage) === 3) {
            paging.push(
              <li key={i} className="page three-dots">
                ...
              </li>
            );
          }
        }
      }
    }
    const pagingElement = loading ? (
      <div></div>
    ) : (
      <nav className="paging-component">
        <ul className="">
          {pagingInfo && pagingInfo.currentPage !== 1 ? (
            <li className="page">
              <Link
                className=""
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.onPrev();
                }}
                aria-label="Previous"
              >
                {"<"}
              </Link>
            </li>
          ) : null}
          {paging}
          {pagingInfo &&
          (pagingInfo.currentPage === pagingInfo.totalPage ||
            pagingInfo.totalPage === 0) ? null : (
            <li className="page">
              <Link
                className=""
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.onNext();
                }}
                aria-label="Next"
              >
                {">"}
              </Link>
            </li>
          )}
        </ul>
      </nav>
    );
    return <>{pagingElement}</>;
  }
}

export default Paging;
