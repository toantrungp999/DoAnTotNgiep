import React, { Component, memo } from "react";
import "./OrderProgress.css";
import { formatDate } from "../../extentions/ArrayEx";
import "./receipt-solid.svg";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import * as OrderActions from "../../constants/OrderActions";

class OrderProgress extends Component {
  render() {
    let logs = this.props.logs;
    const { orderType, paymentType, receiveType, shipBrand } = this.props;
    let orderProgress = logs.map((log, index) => {
      var date = formatDate(log.date);
      var description = log.description !== undefined ? log.description : "";
      var icon;
      var lineBefore = "green-line";
      var lineAfer = index + 1 === logs.length ? "white-line" : "green-line";
      if (log.action === OrderActions.CREATE) {
        icon = <i className="fas fa-receipt"></i>;
        lineBefore = "white-line";
      } else if (log.action === OrderActions.CANCEL) {
        icon = <i className="fas fa-times"></i>;
      } else if (log.action === OrderActions.PAY) {
        icon = <i className="fas fa-money-bill-wave-alt"></i>;
      } else if (log.action === OrderActions.APPROVE) {
        icon = <i className="fas fa-clipboard-check"></i>;
      } else if (log.action === OrderActions.PASS) {
        icon = <i className="fas fa-check"></i>;
      } else if (log.action === OrderActions.FAIL) {
        icon = <i className="fas fa-exclamation"></i>;
      }
      return (
        <div key={index} className="progress-item">
          <div className="progress-icon">
            <div className={lineBefore + " line"}></div>
            {icon}
            <div className={lineAfer + " line"}></div>
          </div>
          <div className="progress-info">
            <span className="action">{log.action}</span>
            <span className="date">{date}</span>
            <span className="description">{description}</span>
            {index === 0 ? (
              <>
                <span className="order-description">{orderType}</span>
                <span className="order-description">{paymentType}</span>
                <span className="order-description">
                  {shipBrand !== "" ? shipBrand : receiveType}
                </span>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      );
    });
    return (
      <div className="order-progress-component">
        <div className="progress-bar-container">{orderProgress}</div>
        <div className="progress-dropdown-container">
          <Accordion>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="title">Thông tin đặt hàng</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{orderProgress}</Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    );
  }
}

export default memo(OrderProgress);
