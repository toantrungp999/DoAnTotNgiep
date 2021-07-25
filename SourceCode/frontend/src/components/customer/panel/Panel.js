import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import "./Panel.css";

class Panel extends Component {
  render() {
    return (
      <div className="panel-section">
        <div className="box">
          <Link
            className="panel-1"
            to="/category-group?key=6031db48fa94700f38064e24"
          >
            <img
              alt="Áo thun"
              src="https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033838/Poster/Panel_1_cuxxft.jpg"
            />
            <div className="panel-name">Áo thun</div>
          </Link>
          <div className="panel-23">
            <Link
              className="panel-2"
              to="category-group?key=60727e10f39072137c3b085c"
            >
              <img
                alt="Phụ kiện"
                src="https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033838/Poster/Panel_2_t1jaem.jpg"
              />
              <div className="panel-name">Phụ kiện</div>
            </Link>
            <Link
              className="panel-3"
              to="/category-group?key=6031e5affa94700f38064e25"
            >
              <img
                alt="Giày"
                src="https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033838/Poster/Panel_3_pusrwc.jpg"
              />
              <div className="panel-name">Giày</div>
            </Link>
          </div>
          <Link
            className="panel-4"
            to="/category-group?key=6031db21fa94700f38064e23"
          >
            <img
              alt="Quần jeans"
              src="https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033838/Poster/Panel_4_ss50i0.jpg"
            />
            <div className="panel-name">Quần jeans</div>
          </Link>
        </div>
      </div>
    );
  }
}

export default memo(Panel);
