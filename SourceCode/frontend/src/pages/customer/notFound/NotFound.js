import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import "./Style.css";

class NotFound extends Component {
  render() {
    return (
      <div className="bg-purple">
        <div className="stars">
          <div className="central-body">
            <img
              className="image-404"
              alt="none"
              src="http://salehriaz.com/404Page/img/404.svg"
              style={{ width: "300px" }}
            />
            <Link to={this.props.link || ""} className="btn-go-home">
              GO BACK HOME
            </Link>
          </div>
          <div className="objects">
            <img
              className="object_rocket"
              alt="none"
              src="http://salehriaz.com/404Page/img/rocket.svg"
              style={{ width: "40px" }}
            />
            <div className="earth-moon">
              <img
                className="object_earth"
                alt="none"
                src="http://salehriaz.com/404Page/img/earth.svg"
                style={{ width: "100px" }}
              />
              <img
                className="object_moon"
                alt="none"
                src="http://salehriaz.com/404Page/img/moon.svg"
                style={{ width: "80px" }}
              />
            </div>
            <div className="box_astronaut">
              <img
                className="object_astronaut"
                alt="none"
                src="http://salehriaz.com/404Page/img/astronaut.svg"
                style={{ width: "140px" }}
              />
            </div>
          </div>
          <div className="glowing_stars">
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default memo(NotFound);
