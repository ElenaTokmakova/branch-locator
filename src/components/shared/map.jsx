import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { Icon } from "leaflet";
import Search from "./leaflet-search";
import LocateControl from './locate-control';
import './map.scss';

class LeafletMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gotGeolocationPermissions: false,
      zoom: 5
    }
  }

  render () {

    const defaults = {
      lat: 43.7929,
      lng: -79.5256,
      picture: "LOCATION_IMAGE_URL_HERE.jpg",
      alt: "Location image",
      street: "STREET ADDRESS HERE",
      address: "ADDRESS HERE",
      icon: new Icon({
        iconUrl: "ICON_URL_HERE",
        shadowUrl: "MARKER IMAGE URL HERE",
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        popupAnchor: [0, -27]
      })};

      const locateOptions = {
        position: 'topright',
        maxZoom: 13,
        enableHighAccuracy: true,
        setView: true,
         // callback before engine starts retrieving locations
        onActivate: () => { }
      };

      const onGeolocation = (result) => {
        if (result) {
          this.setState({gotGeolocationPermissions: true, zoom: 13});
        }
      }

      const { coords, position, branches, selectedBranch, onMarkerClick } = this.props;
      let center;
      let zoom;

      if ((coords && coords.length > 0) && (selectedBranch === "undefined" || selectedBranch === "")) {
        center = coords;
      } else {
        center = branches.length === 1 ? [branches[0]['lat'], branches[0]['lng']] : [defaults.lat, defaults.lng];
      }

      zoom = !(selectedBranch === "undefined" || selectedBranch === "") ? 13 : coords.length > 0 ? 5 : this.state.zoom;

      if (this.props.lastClick === "branch-info") {
          center = position;
          zoom = 13;
      }

      return (
        <Map center={center} zoom={zoom}>
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocateControl flyTo={true} options={locateOptions} startDirectly onGeolocation={onGeolocation}/>
            {
              this.props.branches.map((location, index) => {
                const {lat, lng, addresses, branchPicture, branchImageAlt} = location;
                const position = [lat ? lat : defaults.lat, lng ? lng : defaults.lng];
                const street = (addresses && addresses.length > 0) ? addresses[0]['Street'] : "";
                const address = (addresses && addresses.length > 0) ? addresses[0]['City'] + ", " +
                      addresses[0]['Province'] + ", " + addresses[0]['PostalCode'] : "";

                const iconMarkup = renderToStaticMarkup(<i className="location-icon"><img alt={"Branch location icon"} src="MARKER_IMAGE_HERE"/><span className="location-number">{ index + 1 }</span></i>)
                const customMarkerIcon = divIcon({
                  html: iconMarkup,
                });

                const icon = branches.length === 1 ? defaults.icon : customMarkerIcon;

                return (
                  <Marker key={location.branchNumber} position={position} icon={icon} onClick={typeof onMarkerClick === "function" ? onMarkerClick.bind(this, index) : void(0)}>
                    <Popup>
                      <div className="popup-cont">
                        <img src={branchPicture ? branchPicture: defaults.picture}
                        alt={branchImageAlt ? branchImageAlt : defaults.alt} height="50" width="50" />
                        <div className="popup-info">{street}<br/>{address}</div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })
            }
            <Search />
        </Map>
    )

  }


}

export default LeafletMap;