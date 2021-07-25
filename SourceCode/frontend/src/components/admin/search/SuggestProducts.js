import React from "react";
import { Link } from "react-router-dom";

const SuggestProducts = (props) => {
  const options = props.results.map((r) => (
    <li key={r._id}>
      <Link to={`/admin/product/detail/${r._id}`}>
        <img src={r.images ? r.images[0] : ""} alt={r.name}></img>
        <h6>{r.name}</h6>
        <span>Hãng: {r.brandId.name}</span>
      </Link>
    </li>
  ));
  return <ul className="wrap-suggestion">{options}</ul>;
};

export default SuggestProducts;
