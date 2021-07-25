import React, { Component } from "react";
class DialogConfirmReason extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: "",
      isError: false,
    };
  }

  onConfirm = () => {
    const { reason } = this.state;
    if (reason && reason.trim().length > 0) this.props.onConfirm(reason);
    else this.setState({ isError: true });
  };

  onChange = (e) => {
    const target = e.target;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const className = this.state.isError
      ? "form-control input-focus"
      : "form-control";
    return (
      <div className="modal display-block confirm">
        <div className="dialog-main">
          <div className="card border-primary">
            <div className="card-body">
              <h3 className="card-title text-danger">Cảnh báo</h3>
              <p className="card-text mt-3">{this.props.message}</p>
              <div className="mt-3">
                <input
                  type="text"
                  name="reason"
                  className={className}
                  onChange={this.onChange}
                  placeholder={this.props.reason}
                />
              </div>
              <div className="form-group mt-3">
                <input
                  type="button"
                  className="btn-dialog btn btn-danger"
                  onClick={this.onConfirm}
                  value="XÁC NHẬN"
                />
                <input
                  type="button"
                  className="btn-dialog btn btn-success ml-5"
                  onClick={this.props.onClose}
                  value="THOÁT"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DialogConfirmReason;
