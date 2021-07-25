import React, { Component, memo } from "react";
import { connect } from "react-redux";
import "./ChangeAccount.css";
import ChangePassword from "../../../components/customer/changeAccountAction/ChangePassword";
import ChangeProfile from "./../../../components/customer/changeAccountAction/ChangeProfile";
import Loading from "../../../components/common/loading/Loading";
import {
  fetchProfileRequest,
  updateProfileRequest,
  changePasswordRequest,
  changePhoneRequest,
  fetchAddressesRequest,
  updateAddressRequest,
  addAddressRequest,
  deleteAddressRequest,
  updateAvatarRequest,
  clearInform,
} from "../../../actions/userActions";
import {
  fetchCitiesRequest,
  fetchDistrictsRequest,
  mapClearState,
  getGeocodeRequest,
  getLocationRequest,
} from "../../../actions/locationActions";
import ChangePhoneNumber from "../../../components/customer/changeAccountAction/ChangePhoneNumber";
import ChangeAddress from "../../../components/customer/changeAccountAction/ChangeAddress";

class ChangeAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfile: false,
      showChangepassword: false,
      showAddress: false,
      showChangePhone: false,
    };
  }

  onClick = (e) => {
    e.preventDefault();
    var target = e.target;
    var name = target.name;
    this.setState({
      showProfile: false,
      showChangepassword: false,
      showAddress: false,
      showChangePhone: false,
    });
    this.setState({
      [name]: true,
    });
    this.props.clearInform();
  };

  componentDidMount() {
    //this.props.fetchProfile();
    this.props.fetchCities();
    this.props.fetchAddresses();
  }

  render() {
    const { userProfileReducer } = this.props;
    let element = <Loading />;
    var feature =
      this.props.match.params.feature !== undefined
        ? this.props.match.params.feature
        : "profile";
    const { loading, message } = userProfileReducer;
    if (!loading && !message) {
      //kiem tra lay api co loi hay ko
      if (feature === "profile" || feature === "")
        element = (
          <ChangeProfile
            onUpdateAvatar={this.props.updateAvatar}
            userProfileReducer={userProfileReducer}
            userActionReducer={this.props.userActionReducer}
            onUpdateProfile={this.props.updateProfile}
          />
        );
      else if (feature === "addresses")
        element = (
          <ChangeAddress
            onAddAddress={this.props.addAddress}
            onUpdateAddress={this.props.updateAddress}
            onDeleteAddress={this.props.deleteAddress}
            userAddressReducer={this.props.userAddressReducer}
            citiesReducer={this.props.citiesReducer}
            districtsReducer={this.props.districtsReducer}
            fetchDistricts={this.props.fetchDistricts}
            mapReducer={this.props.mapReducer}
            mapClearState={this.props.mapClearState}
            getGeocodeRequest={this.props.getGeocodeRequest}
            getLocationRequest={this.props.getLocationRequest}
          />
        );
      else if (feature === "password")
        element = (
          <ChangePassword
            onChangePassword={this.props.changePassword}
            userActionReducer={this.props.userActionReducer}
          />
        );
      else if (feature === "phonenumber")
        element = (
          <ChangePhoneNumber
            onChangePhone={this.props.changePhone}
            userActionReducer={this.props.userActionReducer}
            phoneNumber={userProfileReducer.userProfile.phoneNumber}
          />
        );
    }

    return <>{element}</>;
  }
}

const mapStateToProps = (state) => {
  return {
    districtsReducer: state.districtsReducer,
    citiesReducer: state.citiesReducer,
    mapReducer: state.mapReducer,
    userInfoReducer: state.userInfoReducer,
    userProfileReducer: state.userProfileReducer,
    userActionReducer: state.userActionReducer,
    userAddressReducer: state.userAddressReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchProfile: () => {
      dispatch(fetchProfileRequest());
    },
    fetchAddresses: () => {
      dispatch(fetchAddressesRequest());
    },
    updateProfile: (profile) => {
      dispatch(updateProfileRequest(profile));
    },
    changePassword: (data) => {
      dispatch(changePasswordRequest(data));
    },
    changePhone: (data) => {
      dispatch(changePhoneRequest(data));
    },
    fetchCities: () => {
      dispatch(fetchCitiesRequest());
    },
    fetchDistricts: (id) => {
      dispatch(fetchDistrictsRequest(id));
    },
    mapClearState: () => {
      dispatch(mapClearState());
    },
    getGeocodeRequest: (data) => {
      dispatch(getGeocodeRequest(data));
    },
    getLocationRequest: (data) => {
      dispatch(getLocationRequest(data));
    },
    addAddress: (data) => {
      dispatch(addAddressRequest(data));
    },
    updateAddress: (data) => {
      dispatch(updateAddressRequest(data));
    },
    deleteAddress: (addressId) => {
      dispatch(deleteAddressRequest(addressId));
    },
    updateAvatar: (file) => {
      dispatch(updateAvatarRequest(file));
    },
    clearInform: () => {
      dispatch(clearInform());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(ChangeAccount));
