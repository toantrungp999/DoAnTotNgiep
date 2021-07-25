import React, { memo } from "react";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import "./Loading.css";

class Loading extends React.Component {
  render() {
    return (
      <div className="loading-page">
        <Loading3QuartersOutlined className="loading1" />

        <Loading3QuartersOutlined className="loading2" />

        <Loading3QuartersOutlined className="loading3" />
        <span className="loading-text">Đang tải...</span>
      </div>
    );
  }
}

export default memo(Loading);
