import React, { Component, memo } from "react";
import { Link } from "react-router-dom";
import "./Poster.css";

class Poster extends Component {
  state = {
    nodes: [
      {
        id: 1,
        src: "https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033353/Poster/Poster_1_iolupj.jpg",
        path: "/category-group?key=6031db48fa94700f38064e24",
        title: "Áo thun thời trang",
        description: "Nổi bật - Năng động - Thời trang",
      },
      {
        id: 2,
        src: "https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033611/Poster/Poster_2_l9dqi6.jpg",
        path: "/sale-off",
        title: "Siêu Sale chào hè",
        description: "Giảm giá cực sâu - Vui hè cực ngầu",
      },
      {
        id: 3,
        src: "https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033612/Poster/Poster_3_xlemzr.jpg",
        path: "/category-group?key=60727e10f39072137c3b085c",
        title: "Phụ kiện đẳng cấp",
        description: "Nâng tầm thời trang",
      },
      {
        id: 4,
        src: "https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033612/Poster/Poster_4_ybaoyd.webp",
        path: "/detail/60727d1df39072137c3b0857",
        title: "Xu thế thời trang",
        description: "Mới nhất - Đẹp nhất - Rẻ nhất",
      },
    ],
    currentNode: 1,
  };

  componentDidMount() {
    this.interval = setInterval(() => this.autoChangePoster(), 5000);
  }

  autoChangePoster = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const currentNode = this.state.currentNode;
    if (currentNode === this.state.nodes.length) {
      this.setState({ currentNode: 1 });
    } else {
      this.setState({ currentNode: currentNode + 1 });
    }
    this.interval = setInterval(() => this.autoChangePoster(), 5000);
  };

  onChangePoster = (e) => {
    var target = e.target;
    var { id } = target;
    this.setState({ currentNode: Number(id) });
  };

  render() {
    var nodes = [];
    var images = [];
    this.state.nodes.forEach((item, index) => {
      if (item.id.toString() === this.state.currentNode.toString()) {
        nodes.push(
          <div
            className="active"
            onClick={this.onChangePoster}
            key={item.id}
            id={item.id}
          ></div>
        );
        images.push(
          <Link key={item.id} to={item.path} className="active">
            <img alt={index} className="active" src={item.src} />
            <div className={item.id % 2 === 0 ? "right" : "left"}>
              <span className="title">{item.title}</span>
              <span className="description">{item.description}</span>
            </div>
          </Link>
        );
      } else {
        nodes.push(
          <div
            className=""
            onClick={this.onChangePoster}
            key={item.id}
            id={item.id}
          ></div>
        );
        images.push(
          <Link key={item.id} to={item.path}>
            <img alt={index} className="" src={item.src} />
            <div className={item.id % 2 === 0 ? "right" : "left"}>
              <span className="title">{item.title}</span>
              <span className="description">{item.description}</span>
            </div>
          </Link>
        );
      }
    });
    return (
      <div className="poster-container">
        {images}
        <div className="nodes">{nodes}</div>
      </div>
    );
  }
}

export default memo(Poster);
