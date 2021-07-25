import React, { memo } from "react";
import { Link } from "react-router-dom";
import { HomeFilled } from "@ant-design/icons";
import { SPECIAL_SEARCH, OPTION } from "../../../constants/ProductSearchType";
import Select from "../../common/formField/Select";
import queryString from "query-string";
import { RightOutlined } from "@ant-design/icons";
import { convertNumberToVND } from "../../../extentions/ArrayEx";
import { Slider } from "antd";
import "./PageTitle.css";

class PageTitle extends React.Component {
  state = { range: [0, 2000000] };
  onRangeChange = (value) => {
    if ([value[0] !== value[1]]) this.setState({ range: value });
  };
  componentDidMount() {
    let { min, max } = queryString.parse(this.props.location.search);
    if (min === undefined || min === null) min = 0;
    if (!max) max = 2000000;
    this.setState({ range: [Number(min), Number(max)] });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      let { min, max } = queryString.parse(this.props.location.search);
      if (min === undefined || min === null) min = 0;
      if (!max) max = 2000000;
      this.setState({ range: [Number(min), Number(max)] });
    }
  }
  render() {
    const { searchInfo, product } = this.props;
    const path = this.props.location.pathname.replace("/", "");
    let { key, option } = queryString.parse(this.props.location.search);
    let sortOptions = "";
    const pageTitles = [{ name: "Trang chủ", path: "/" }];
    if (
      path === "hot-product" ||
      path === "new-product" ||
      path === "best-seller"
    ) {
      for (var i = 0; i < SPECIAL_SEARCH.length; i++) {
        if (SPECIAL_SEARCH[i].path === path) {
          pageTitles.push({
            name: SPECIAL_SEARCH[i].name,
            path: `/${SPECIAL_SEARCH[i].path}`,
          });
          break;
        }
      }
    } else {
      if (path === "all-product") {
        pageTitles.push({ name: "Tất cả sản phẩm", path: `/all-product` });
      } else if (path === "search") {
        pageTitles.push({ name: key, path: `/search?key=${key}` });
      } else if (path === "category" && searchInfo && searchInfo.categoryName) {
        pageTitles.push({
          name: searchInfo.categoryName.categoryGroupId.name,
          path: `/category-group?key=${searchInfo.categoryName.categoryGroupId._id}`,
        });
        pageTitles.push({
          name: searchInfo.categoryName.name,
          path: `/category?key=${key}`,
        });
      } else if (
        path === "category-group" &&
        searchInfo &&
        searchInfo.categoryGroupName
      ) {
        pageTitles.push({
          name: searchInfo.categoryGroupName.name,
          path: `/category?key=${key}`,
        });
      } else if (path === "sale-off") {
        pageTitles.push({
          name: "Mùa hè sôi động - Sale upto 50%",
          path: `/sale-off`,
        });
      } else if (path === "black-color") {
        pageTitles.push({ name: "Everything Black", path: `/black-color` });
      } else if (product) {
        //this is product detail page
        pageTitles.push({
          name: product.categoryId.categoryGroupId.name,
          path: `/category?key=${product.categoryId.categoryGroupId._id}`,
        });
        pageTitles.push({
          name: product.categoryId.name,
          path: `/category?key=${product.categoryId._id}`,
        });
        pageTitles.push({ name: product.name, path: `/detail/${product._id}` });
      }

      const options = OPTION.map((opt) => {
        return { label: opt.name, value: opt.key };
      });
      sortOptions = (
        <Select
          name="sort"
          value={option ? option : 1}
          firstSubmit={true}
          label=""
          placeHolder="Chọn giới tính"
          labelWidth="0px"
          rules={[]}
          setValidate={this.setValidate}
          onChange={this.props.onChangeSortOption}
          options={options}
        />
      );
    }

    const pageTitleComponent = pageTitles.map((node, index) => {
      const span =
        index !== 0 ? (
          <span>
            <RightOutlined key={index} />
          </span>
        ) : (
          ""
        );
      const icon = index === 0 ? <HomeFilled className="home-icon" /> : "";
      const className = index === pageTitles.length - 1 ? "active" : "";
      return (
        <div key={index}>
          {span}
          <Link className={className} to={`${node.path}`}>
            {icon}
            {node.name}
          </Link>
        </div>
      );
    });

    return (
      <div className="page-title-component">
        <div className="title-section">{pageTitleComponent}</div>

        {!product ? (
          <div className="filter-section">
            <div className="price-range">
              <span className="label">Giá:</span>
              <span className="min-span">
                {convertNumberToVND(this.state.range[0])}₫
              </span>
              <span className="middle">-</span>
              <span className="max-span">
                {convertNumberToVND(this.state.range[1])}₫
              </span>
              <Slider
                className="slider"
                min={0}
                max={2000000}
                range
                step={50000}
                value={this.state.range}
                onChange={this.onRangeChange}
                onAfterChange={this.props.onChangePriceRange}
              />
            </div>
            <div className="sort-option">{sortOptions}</div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default memo(PageTitle);
