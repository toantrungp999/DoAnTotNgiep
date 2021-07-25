import React, { Component, memo } from "react";
import { connect } from "react-redux";
import {
  fectchCategoryGroupsRequest,
  createCategoryGroupRequest,
  updateCategoryGroupRequest,
} from "../../../actions/categoryGroupActions";
import CategoryGroupItem from "../../../components/admin/categoryGroupItem/CategoryGroupItem";
import CreateCategoryGroup from "../../../components/admin/categoryGroupItem/CreateCategoryGroup";
import Loading from "../../../components/common/loading/Loading";
import { Link } from "react-router-dom";

class CategoryGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      showAlert: false,
    };
  }

  componentDidMount() {
    this.props.fectchTypes();
  }

  onCreateCategoryGroup = (data) => {
    this.props.createCategoryGroup(data);
    this.setState({ showAlert: true });
  };

  onUpdateCategoryGroup = (data) => {
    this.props.updateCategoryGroup(data);
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
    let { loading, createLoading, updateLoading, categoryGroups } =
      this.props.categoryGroupsReducer;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    else {
      let typeItems = categoryGroups
        ? categoryGroups.map((categoryGroup, index) => {
            return (
              <CategoryGroupItem
                onUpdateCategoryGroup={this.onUpdateCategoryGroup}
                updateLoading={updateLoading}
                key={categoryGroup._id}
                index={index}
                categoryGroup={categoryGroup}
              />
            );
          })
        : "";

      return (
        <div>
          <h3>Danh sách nhóm loại quần áo</h3>
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
                <i className="fas fa-plus"></i>Thêm nhóm loại mới
              </Link>
            </div>
          </div>

          <div className="mr-5 ml-5">
            <table className="table table-product mt-2">
              <thead>
                <tr>
                  <th>Tên nhóm</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!createLoading && this.state.isAdding ? (
                  <CreateCategoryGroup
                    onCloseAddForm={this.onCloseAddForm}
                    onCreateCategoryGroup={this.onCreateCategoryGroup}
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
    categoryGroupsReducer: state.categoryGroupsReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fectchTypes: () => {
      dispatch(fectchCategoryGroupsRequest());
    },
    createCategoryGroup: (data) => {
      dispatch(createCategoryGroupRequest(data));
    },
    updateCategoryGroup: (data) => {
      dispatch(updateCategoryGroupRequest(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(CategoryGroups));
