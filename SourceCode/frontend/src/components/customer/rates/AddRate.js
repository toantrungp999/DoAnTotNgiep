import React, { Component, memo } from "react";
class AddRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      rate: 5,
      firstSubmit: false,
    };
  }

  onChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = () => {
    let { content, rate } = this.state;
    content = content.trim();
    if (content && rate !== -1) {
      this.props.onCreateRate(
        { content, rate },
        { name: this.props.userInfo.name, image: this.props.userInfo.image }
      );
      this.setState({
        content: "",
        rate: 5,
        firstSubmit: false,
      });
    } else {
      this.setState({ firstSubmit: true });
    }
  };

  chooseRate = (index) => {
    if (this.state.rate !== index) this.setState({ rate: index });
  };

  render() {
    let elementRates = [];
    for (let i = 1; i <= 5; i++) {
      elementRates.push(
        <i
          key={i}
          onMouseEnter={() => this.chooseRate(i)}
          className={
            "fas fa-star rate-star " +
            (i > this.state.rate ? "rate-not-check" : "rate-check")
          }
          onClick={() => this.chooseRate(i)}
        ></i>
      );
    }

    return (
      <div className="rate-item">
        <img
          className="avatar"
          alt={this.props.userInfo.name}
          src={this.props.userInfo.image}
        />
        <div className="rate-body">
          <div style={{ marginBottom: "3px" }}>{elementRates}</div>
          <div className="form">
            <textarea
              type="text"
              className="form-control"
              name="content"
              onChange={this.onChange}
              value={this.state.content}
              placeholder="Nội dung đánh giá"
            />
            <div className="btn-section">
              <button
                className="btn btn-save"
                onClick={this.onSubmit}
                type="button"
              >
                Gửi
              </button>
            </div>
            <div
              className="text-left invalid-message"
              style={{ marginTop: "-10px" }}
            >
              {this.state.firstSubmit && this.state.content.trim().length === 0
                ? "Chưa nhập nội dung"
                : ""}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default memo(AddRate);
