import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

class Footer extends Component {
  render() {
    if (this.props.location.pathname.includes("cart")) return <div></div>;
    return (
      <footer className="page-footer">
        <div className="store-info">
          <div className="name">
            <img src="/webicon.ico" alt="logo" />
            <label>Blue Fashion</label>
          </div>
          <div className="address">
            <label>
              Địa chỉ: 1 Võ Văn Ngân, phường Linh Trung, quận Thủ Đức, tp. Hồ
              Chí Minh
            </label>
            <label>Số điện thoại: 0332317371</label>
          </div>
        </div>
        <div className="social">
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://www.facebook.com/phamtoantrung1999/",
                "_blank"
              );
            }}
          >
            <i className="fa fa-facebook-f mr-3"></i>
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.open("https://twitter.com/PhmTonTrung6", "_blank");
            }}
          >
            <i className="fa fa-twitter mr-3"></i>
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://www.youtube.com/channel/UCzHnHE3RdqirDj9MJuvC5bw?view_as=subscriber",
                "_blank"
              );
            }}
          >
            <i className="fa fa-youtube mr-3"></i>
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://www.instagram.com/phamtoantrung1999/",
                "_blank"
              );
            }}
          >
            <i className="fa fa-instagram mr-3"></i>
          </Link>
        </div>
        <div className="copy-right">
          <span>© 2020 Copyright:</span>
          <span className="link">
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  "https://www.facebook.com/phamtoantrung1999/",
                  "_blank"
                );
              }}
            >
              {" "}
              Phạm Toàn Trung
            </Link>{" "}
            -{" "}
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  "https://www.facebook.com/trongngon.lang/",
                  "_blank"
                );
              }}
            >
              Lăng Trọng Ngôn
            </Link>
          </span>
        </div>
      </footer>
    );
  }
}

export default Footer;
