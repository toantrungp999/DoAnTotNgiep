import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import "./MiddlePanel.css";

class MiddlePanel extends Component {
  render() {
    const { index } = this.props;
    let panels;
    if (index === 1) {
      panels = (
        <div className="middle-panel-section mobile">
          <div className="box">
            <Link className="panel-1" to="/black-color">
              <img
                alt="black-color"
                src="https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033994/Poster/MiddlePanel_1_spzsxt.webp"
              />
              <div className="panel-text-1">Everything black</div>
              <div className="panel-text-2">Thể hiện phong cách</div>
            </Link>
          </div>
        </div>
      );
    } else if (index === 2) {
      panels = (
        <div className="middle-panel-section mobile">
          <div className="box">
            <Link className="panel-2 mobile" to="sale-off">
              <img
                alt="sale-off"
                src="https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033994/Poster/MiddlePanel_2_p4i4ca.webp"
              />
              <div className="panel-text-1">Mùa hè sôi động</div>
              <div className="panel-text-2">Giảm đến 50%</div>
            </Link>
          </div>
        </div>
      );
    } else {
      panels = (
        <div className="middle-panel-section">
          <div className="box">
            <Link className="panel-1" to="/black-color">
              <img
                alt="black-color"
                src="https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033994/Poster/MiddlePanel_1_spzsxt.webp"
              />
              <div className="panel-text-1">Everything black</div>
              <div className="panel-text-2">Thể hiện phong cách</div>
            </Link>
            <Link className="panel-2" to="sale-off">
              <img
                alt="sale-off"
                src="https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033994/Poster/MiddlePanel_2_p4i4ca.webp"
              />
              <div className="panel-text-1">Mùa hè sôi động</div>
              <div className="panel-text-2">Giảm đến 50%</div>
            </Link>
          </div>
        </div>
      );
    }
    return <>{panels}</>;
  }
}

export default memo(MiddlePanel);
