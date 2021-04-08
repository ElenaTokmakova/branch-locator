import React, { Component, createRef } from "react";
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import { withLeaflet } from "react-leaflet";

class Search extends Component {
  mapRef = createRef();
  plugin = createRef();
  branchLocator = false;

  componentDidMount() {
    const {map} = this.props.leaflet;
    // https://developers.google.com/maps/documentation/javascript/reference/map#MapRestriction.latLngBounds
    const searchBounds = L.latLngBounds([40.000000, - 140.000000],[80.000000, -55.000000]);
    const agolProvider = ELG.arcgisOnlineProvider({
        maxResults: 10,
        countries: ["CA"]
    });
    const searchControl = new ELG.Geosearch({ searchBounds, providers: [agolProvider] }).addTo(map);
    const results = new L.LayerGroup().addTo(map);

    searchControl.on("results", function(data) {
      console.log("Search results", data);
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
      }
    });

    if (this.branchLocator) {
      const searchContainer = searchControl.onAdd(map);
      this.plugin.current.appendChild(searchContainer);
    }
  }

  render() {
    const {pathname} = this.props.location;
    // do not show search on branch details
    if (pathname === '/branch-locator' || pathname === "/") {
      this.branchLocator = true;
      return ReactDOM.createPortal(
        <div className="geocontrol-wrapper" ref={this.plugin} />,
        document.querySelector('.branch-loction-search-form')
      );
    } else return null;
  }
}

export default withRouter(withLeaflet(Search));