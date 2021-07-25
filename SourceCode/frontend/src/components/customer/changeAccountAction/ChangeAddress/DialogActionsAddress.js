import React, { Component } from "react";
import GoogleMapComponent from "./GoogleMapComponent";
import AddressPicker from "./AddressPicker";
import "./DialogActionsAddress.css";

class DialogActionsAddress extends Component {
  render() {
    console.log("render");
    return (
      <div className="dialog-address-container">
        <div className="dialog-address">
          <AddressPicker
            address={this.props.address}
            onAddAddress={this.props.onAddAddress}
            onUpdateAddress={this.props.onUpdateAddress}
            onClose={this.props.onClose}
            fetchDistricts={this.props.fetchDistricts}
            userAddressReducer={this.props.userAddressReducer}
            districtsReducer={this.props.districtsReducer}
            citiesReducer={this.props.citiesReducer}
            getLocationRequest={this.props.getLocationRequest}
            getGeocodeRequest={this.props.getGeocodeRequest}
            mapReducer={this.props.mapReducer}
          />
          <div className="map-section">
            <div className="map">
              <GoogleMapComponent mapReducer={this.props.mapReducer} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DialogActionsAddress;
