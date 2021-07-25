import React, { Component, memo } from "react";
import AddRate from "./AddRate";
import "./Style.css";
import RateItem from "./RateItem";
import { Link } from "react-router-dom";
import Loading from "../../common/loading/Loading";
import "./Rate.css";

class Rates extends Component {
  render() {
    var {
      loading,
      rates,
      createLoading,
      updateLoading,
      deleteLoading,
      createReplyLoading,
      updateReplyLoading,
      deleteReplyLoading,
      message,
    } = this.props.ratesReducer;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    else {
      let exist;
      var listRates = rates
        ? rates.map((rate, index) => {
            if (
              !this.props.userInfo ||
              rate.user._id === this.props.userInfo._id
            )
              exist = true;
            return (
              <RateItem
                key={rate._id}
                index={index}
                updateLoading={updateLoading}
                updateReplyLoading={updateReplyLoading}
                rate={rate}
                deleteLoading={deleteLoading}
                deleteReplyLoading={deleteReplyLoading}
                createReplyLoading={createReplyLoading}
                userInfo={this.props.userInfo}
                onCreateRateReply={this.props.onCreateRateReply}
                onUpdateRate={this.props.onUpdateRate}
                onUpdateRateReply={this.props.onUpdateRateReply}
                onDeleteRate={this.props.onDeleteRate}
                onDeleteRateReply={this.props.onDeleteRateReply}
              />
            );
          })
        : "";
      var textError = message ? (
        <span className="text-danger mt-10">{message}</span>
      ) : (
        ""
      );
      return (
        <div className="rate-component">
          <h4 className="">Đánh giá</h4>
          <div className="">
            <div className="">
              {this.props.userInfo && !createLoading && !exist ? (
                <AddRate
                  onCreateRate={this.props.onCreateRate}
                  userInfo={this.props.userInfo}
                />
              ) : (
                ""
              )}
              {listRates}
              {textError}
            </div>
          </div>
          {this.props.totalRate > this.props.lengthRate ? (
            <Link
              to="#"
              style={{ fontSize: "14px" }}
              onClick={(e) => {
                e.preventDefault();
                this.props.viewMoreRates();
              }}
            >
              Xem thêm đánh giá
            </Link>
          ) : (
            ""
          )}
        </div>
      );
    }
  }
}

export default memo(Rates);
