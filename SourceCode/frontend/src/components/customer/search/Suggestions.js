import React, { memo } from "react";
import { Link } from "react-router-dom";
import { convertNumberToVND } from "../../../extentions/ArrayEx";

const Suggestions = (props) => {
  const options = props.results
    ? props.results.map((r) => (
        <Link
          className="search-suggest"
          to={`/detail/${r._id}`}
          onClick={props.closeSearch}
        >
          <img src={r.images[0]} alt={r.name}></img>
          <span>
            <span className="name">{r.name}</span>
            <span>
              {r.saleOff !== 0 ? (
                <del className="orgin-price">
                  {convertNumberToVND(r.price)}₫
                </del>
              ) : (
                ""
              )}
              <span className="price">
                {convertNumberToVND(r.price - r.saleOff)}₫
              </span>
            </span>
          </span>
        </Link>
      ))
    : "";
  return <div className="search-suggest-container">{options}</div>;
};

export default memo(Suggestions);
