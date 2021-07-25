import React, { Component } from "react";
class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      firstSubmit: false,
    };
  }

  onChange = (e) => {
    var target = e.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = () => {
    const content = this.state.content.trim();
    if (content) {
      this.props.onCreateComment(this.state.content, {
        name: this.props.userInfo.name,
        image: this.props.userInfo.image,
        role: this.props.userInfo.role,
      });
      this.setState({
        content: "",
        firstSubmit: false,
      });
    } else {
      this.setState({ firstSubmit: true });
    }
  };

  render() {
    return (
      <div className="comment-item">
        <img
          className="avatar"
          alt={this.props.userInfo.name}
          src={this.props.userInfo.image}
        />
        <div className="comment-body">
          <div className="form">
            <textarea
              type="text"
              className="form-control"
              name="content"
              value={this.state.content}
              onChange={this.onChange}
              placeholder="Thêm bình luận"
            />
            <div className="btn-section">
              <button
                className="btn btn-save"
                onClick={this.onSubmit}
                type="button"
              >
                Thêm
              </button>
            </div>
          </div>
          <div className="text-left invalid-message">
            {this.state.firstSubmit && this.state.content.trim().length === 0
              ? "Chưa nhập nội dung"
              : ""}
          </div>
        </div>
      </div>
    );
  }
}

export default AddComment;
