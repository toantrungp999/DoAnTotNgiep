import React, { Component, memo } from "react";
import { connect } from "react-redux";
import Select from "../../../components/common/formField/Select";
import Input from "../../../components/common/formField/Input";
import { getStringDate, convertNumberToVND } from "../../../extentions/ArrayEx";
import {
  fetchStatisticsRequest,
  clearStateStatistics,
} from "../../../actions/statisticsActions";
import { Line } from "react-chartjs-2";
import * as OrderTypes from "../../../constants/OrderTypes";
import "./StatisticsPage.css";

class StatisticsPage extends Component {
  state = {
    statisticsType: "revenue",
    orderType: "all",
    start: "",
    end: "",
    firstSubmit: false,
  };

  onChange = (e) => {
    var target = e.target;
    var { name, value } = target;

    this.setState({
      [name]: value,
    });
  };

  componentDidMount() {
    this.props.clearStateStatistics();
  }

  onSubmit = () => {
    const { statisticsType, orderType, start, end } = this.state;
    if (
      statisticsType &&
      orderType &&
      start &&
      end &&
      start !== end &&
      Date.parse(start) < Date.parse(end)
    ) {
      const startDate = `${start}T00:00:00--07:00`;
      const endDate = `${end}T00:00:00--07:00`;
      this.props.fetchStatistics(statisticsType, orderType, startDate, endDate);
    }
    this.setState({ firstSubmit: true });
  };

  render() {
    const { statisticsType, orderType, start, end, firstSubmit } = this.state;
    const { revenue, sales } = this.props.statisticsReducer;
    let labelsRevenue = [];
    let dataRevenue = [];
    let totalRevenue = 0;
    const revenueTable =
      revenue &&
      revenue.map((node) => {
        labelsRevenue.push(getStringDate(node.date));
        dataRevenue.push(node.sum);
        totalRevenue += node.sum;
        return (
          <tr>
            <td>{getStringDate(node.date)} </td>
            <td>{convertNumberToVND(node.sum)}₫</td>
          </tr>
        );
      });
    let labelsSales = [];
    let data1Sales = [];
    let data2Sales = [];
    let salesTable = [];
    if (sales)
      for (const name in sales) {
        labelsSales.push(name);
        data1Sales.push(sales[name].quantity);
        data2Sales.push(sales[name].total);
        salesTable.push(
          <tr>
            <td>{name} </td>
            <td>{sales[name].quantity}</td>
            <td>
              {sales[name].total ? convertNumberToVND(sales[name].total) : 0}₫
            </td>
          </tr>
        );
      }
    const statisticsTypes = [
      { label: "Doanh thu", value: "revenue" },
      { label: "Doanh số", value: "sales" },
    ];
    const orderTypes = [
      { label: "Tất cả", value: "all" },
      { label: "Đơn hàng online", value: OrderTypes.ONLINE_ORDER.ORDER_TYPE },
      {
        label: "Đơn hàng offline",
        value: OrderTypes.IN_STORE_ORDER.ORDER_TYPE,
      },
    ];
    return (
      <div className="statistics-page">
        <h3>Thống kê</h3>
        <div className="form">
          <div className="type">
            <Select
              name="statisticsType"
              value={statisticsType}
              firstSubmit={firstSubmit}
              label="Thống kê"
              labelWidth="200px"
              setValidate={this.setValidate}
              onChange={this.onChange}
              rules={[{ require: true, message: "Chưa chọn loại thống kê" }]}
              options={statisticsTypes}
            />
            <Select
              name="orderType"
              value={orderType}
              firstSubmit={firstSubmit}
              label="Hình thức"
              labelWidth="200px"
              setValidate={this.setValidate}
              onChange={this.onChange}
              rules={[{ require: true, message: "Chưa chọn hình thức" }]}
              options={orderTypes}
            />
          </div>
          <div className="date">
            <Input
              label="Từ"
              name="start"
              value={start}
              firstSubmit={firstSubmit}
              rules={[{ require: true, message: "Chưa chọn ngày" }]}
              labelWidth="100px"
              onChange={this.onChange}
              type="date"
            />
            <Input
              label="Đến"
              name="end"
              value={end}
              firstSubmit={firstSubmit}
              rules={[
                { require: true, message: "Chưa chọn ngày" },
                {
                  biggerDate: start,
                  message: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
                },
              ]}
              labelWidth="100px"
              onChange={this.onChange}
              type="date"
            />
          </div>

          <button className="btn btn-submit" onClick={() => this.onSubmit()}>
            Thống kê
          </button>
        </div>
        <div className="chart">
          {revenue && (
            <Line
              data={{
                labels: labelsRevenue,
                datasets: [
                  {
                    data: dataRevenue,
                    label: "Doanh thu",
                    borderColor: "#3e95cd",
                    backgroundColor: "rgba(162, 208, 242, 0.2)",
                    fill: true,
                    pointRadius: 4,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: `Biểu đồ doanh thu từ ${getStringDate(
                      start
                    )} đến ${getStringDate(end)}`,
                  },
                },
              }}
            />
          )}

          {sales && (
            <Line
              data={{
                labels: labelsSales,
                datasets: [
                  {
                    data: data1Sales,
                    label: "Doanh số",
                    borderColor: "#3e95cd",
                    backgroundColor: "rgba(162, 208, 242, 0.2)",
                    fill: true,
                    yAxisID: "a",
                    pointRadius: 4,
                  },
                  {
                    data: data2Sales,
                    label: "Doanh thu",
                    borderColor: "#e04e14",
                    fill: false,
                    yAxisID: "b",
                    pointRadius: 4,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: `Biểu đồ doanh số từ ${getStringDate(
                      start
                    )} đến ${getStringDate(end)}`,
                  },
                },
                scales: {
                  a: {
                    type: "linear",
                    position: "left",
                    beginAtZero: true,
                  },
                  b: {
                    type: "linear",
                    position: "right",
                    label: "aaaaaaaaa",
                    grid: {
                      drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                  },
                },
              }}
            />
          )}
        </div>
        <div className="table">
          {revenue && (
            <table className="table table-striped table-bordered ">
              <tr className="table-name">
                <th colSpan="2">{`Bảng thống kê doanh thu từ ${getStringDate(
                  start
                )} đến ${getStringDate(end)}`}</th>
              </tr>
              <tr className="table-title">
                <th>Ngày</th>
                <th>Doanh thu</th>
              </tr>
              <tbody>
                {revenueTable}
                <tr>
                  <td>Tổng doanh thu</td>
                  <td> {convertNumberToVND(totalRevenue)}₫</td>
                </tr>
              </tbody>
            </table>
          )}
          {sales && (
            <table className="table table-striped table-bordered ">
              <tr className="table-name">
                <th colSpan="3">{`Bảng thống kê doanh số từ ${getStringDate(
                  start
                )} đến ${getStringDate(end)}`}</th>
              </tr>
              <tr className="table-title">
                <th>Tên sản phẩm</th>
                <th>Số bán</th>
                <th>Doanh thu</th>
              </tr>
              {salesTable}
            </table>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    statisticsReducer: state.statisticsReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStatistics: (statisticsType, orderType, start, end) => {
      dispatch(fetchStatisticsRequest(statisticsType, orderType, start, end));
    },
    clearStateStatistics: () => {
      dispatch(clearStateStatistics());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(StatisticsPage));
