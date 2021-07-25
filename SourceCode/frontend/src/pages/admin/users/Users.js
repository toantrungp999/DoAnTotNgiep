import React, { Component, memo } from "react";
import { connect } from "react-redux";
import {
  fectchUsersRequest,
  searchUsersRequest,
} from "../../../actions/managerUsersActions";
import SearchUsers from "../../../components/admin/search/SearchUsers";
import UserItem from "../../../components/admin/userItem/UserItem";
import Paging from "../../../components/common/paging/Paging";
import Loading from "../../../components/common/loading/Loading";
class Users extends Component {
  componentDidMount() {
    this.onFetchDataFromUrl();
  }

  componentDidUpdate(prevProps) {
    const { loading } = this.props.usersReducer;
    if (!loading && this.props.location !== prevProps.location)
      this.onFetchDataFromUrl();
  }

  onFetchData = (paging) => {
    let search = this.props.match.params.search;
    let url = "/admin/users";
    if (search) url += `/search=${search}`;
    if (paging) url += `/paging=${paging}`;
    this.props.history.push(url);
  };

  onFetchDataFromUrl = () => {
    let paging = this.props.match.params.paging;
    let search = this.props.match.params.search;
    paging = paging ? paging : 1;
    if (search) this.props.searchUsers(search, paging, 12, true);
    else this.props.fectchUsers(paging);
  };

  render() {
    const { loading, message, users, pagingInfo } = this.props.usersReducer;
    let loadingComponent;
    let elementData;
    if (loading)
      loadingComponent = (
        <div>
          <Loading />
        </div>
      );
    else if (message) return message;
    else {
      elementData =
        users && users.length > 0 ? (
          users.map((user, index) => {
            return <UserItem key={user._id} index={index} user={user} />;
          })
        ) : (
          <tr>
            <td
              className="no-data pt-2 pb-2"
              style={{ fontSize: "18px", fontWeight: "500" }}
              colSpan={6}
            >
              Không tìm thấy người dùng
            </td>
          </tr>
        );
    }
    return (
      <div>
        <h3>Danh sách người dùng</h3>
        <div className="row">
          <SearchUsers
            history={this.props.history}
            searchUsers={this.props.searchUsers}
            usersReducer={this.props.usersReducer}
          />
        </div>
        {loading ? (
          loadingComponent
        ) : (
          <table className="table table-product mt-2">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Giới tính</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{elementData}</tbody>
          </table>
        )}
        <Paging
          onFetchData={this.onFetchData}
          pagingInfo={pagingInfo}
          loading={loading}
          location={this.props.location}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    usersReducer: state.usersReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fectchUsers: (paging) => {
      dispatch(fectchUsersRequest(paging));
    },
    searchUsers: (keyword, page, pageSize, isSearch) => {
      dispatch(searchUsersRequest(keyword, page, pageSize, isSearch));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(Users));
