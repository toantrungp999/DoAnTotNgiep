import React, { Component } from "react";
import { connect } from "react-redux";
import Loading from "../../../components/common/loading/Loading";
import { fetchPayRequest } from "../../../actions/orderActions";
import "./PayPage.css";

class PayPage extends Component {
  componentDidMount() {
    console.log(this.props);
    this.props.fetchPayRequest(this.props.match.params._id, "");
  }

  render() {
    let { loading, vnpUrl } = this.props.payReducer;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );

    return <div className="pay-page">{vnpUrl}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    payReducer: state.payReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchPayRequest: (_id) => {
    dispatch(fetchPayRequest(_id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PayPage);
