import React, { Component, memo } from "react";
import { connect } from "react-redux";
import {
  fectchCategoriesRequest,
  createCategoryRequest,
  updateCategoryRequest,
} from "../../../actions/categoryActions";
import { fectchCategoryGroupsRequest } from "../../../actions/categoryGroupActions";
import CategoryItem from "../../../components/admin/categoryItem/CategoryItem";
import CreateCategory from "../../../components/admin/categoryItem/CreateCategory";
import Loading from "../../../components/common/loading/Loading";
import { Link } from "react-router-dom";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      showAlert: false,
    };
  }

  componentDidMount() {
    this.props.fectchCategoryGroups();
    this.props.fectchCategories();
  }

  onCreateCategory = (data) => {
    this.props.createCategory(data);
    this.setState({ showAlert: true });
  };

  onUpdateCategory = (data) => {
    this.props.updateCategory(data);
    this.setState({ showAlert: true });
  };

  onOpenAddForm = () => {
    this.setState({
      isAdding: !this.state.isAdding,
    });
  };

  onCloseAddForm = () => {
    this.setState({
      isAdding: false,
    });
  };

  onHideAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const { loading, createLoading, updateLoading, categories } =
      this.props.categoriesReducer;
    const { categoryGroups } = this.props.categoryGroupsReducer;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    else {
      let typeItems = categories
        ? categories.map((category, index) => {
            return (
              <CategoryItem
                categoryGroups={categoryGroups}
                onUpdateCategory={this.onUpdateCategory}
                updateLoading={updateLoading}
                key={category._id}
                index={index}
                category={category}
              />
            );
          })
        : "";

      return (
        <div>
          <h3>Danh sách loại quần áo</h3>
          <div className="row flex">
            <div className="flex-fill"></div>
            <div className="flex-fill"></div>
            <div className="add-item-admin pr-5">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.onOpenAddForm();
                }}
              >
                <i className="fas fa-plus"></i>Thêm loại mới
              </Link>
            </div>
          </div>

          <div className="mr-5 ml-5">
            <table className="table table-product mt-2">
              <thead>
                <tr>
                  <th>Tên loại</th>
                  <th>Nhóm loại</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!createLoading && this.state.isAdding ? (
                  <CreateCategory
                    categoryGroups={categoryGroups}
                    onCloseAddForm={this.onCloseAddForm}
                    onCreateCategory={this.onCreateCategory}
                  />
                ) : null}
                {typeItems}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    categoriesReducer: state.categoriesReducer,
    categoryGroupsReducer: state.categoryGroupsReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fectchCategories: () => {
      dispatch(fectchCategoriesRequest());
    },
    fectchCategoryGroups: () => {
      dispatch(fectchCategoryGroupsRequest());
    },
    createCategory: (data) => {
      dispatch(createCategoryRequest(data));
    },
    updateCategory: (data) => {
      dispatch(updateCategoryRequest(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(Categories));
