import React from "react";
import { Link } from "react-router-dom";

const SuggestUsers = (props) => {
  const options = props.results.map((r) => (
    <li key={r._id}>
      <Link to={`/admin/users/detail/${r._id}`}>
        <img src={r.image} alt={r.name}></img>
        <h6>{r.name}</h6>
        <span>Email: {r.email}</span>
        {r.phoneNumber ? (
          <>
            <br />
            <span>Số điện thoại: {r.phoneNumber}</span>
          </>
        ) : (
          ""
        )}
      </Link>
    </li>
  ));
  return <ul className="wrap-suggestion">{options}</ul>;
};

export default SuggestUsers;
