import React, { Component, memo } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox";
import './DialogActionsAddress.css';

class GoogleMapComponent extends Component {
    render() {
        const { address, location } = this.props.mapReducer;
        let mapAddress = '';
        let mapLat = -1.2884;
        let mapLng = 36.8233;
        if (location !== undefined && address !== undefined) {
            mapAddress = address;
            mapLat = location.lat;
            mapLng = location.lng;
        }
        const MyMapComponent = withScriptjs(withGoogleMap((props) =>
            <GoogleMap
                defaultZoom={17}
                defaultCenter={{ lat: -34.397, lng: 150.644 }}
                center={{ lat: mapLat, lng: mapLng }}
            >
                {mapAddress !== '' && <Marker position={{ lat: mapLat, lng: mapLng }} >
                    <InfoBox options={{ closeBoxURL: ``, enableEventPropagation: false }}
                    ><div>{mapAddress}</div></InfoBox>
                </Marker>}
            </GoogleMap>
        ))

        return (
            <MyMapComponent
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC7IIEfq28ddUChl_t7amyzGsgmr2pCgGU&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />} />
        )

    }
}
export default memo(GoogleMapComponent);