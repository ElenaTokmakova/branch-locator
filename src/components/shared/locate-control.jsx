import { Component } from "react";
import { withLeaflet } from "react-leaflet";
import Locate from "leaflet.locatecontrol";

class LocateControl extends Component {

  onLocationFound = (e) => {
    const radius = e.accuracy;
    this.props.onGeolocation(radius)
  }

  onLocationError = (e) => {
    alert(e.message);
    this.props.onGeolocation(false)
  }

  componentDidMount() {
    const { options, startDirectly } = this.props;
    const { map } = this.props.leaflet;

    const lc = new Locate(options);

    lc.addTo(map);

    if (startDirectly) {
      // request location update and set location
      lc.start();
    }

    map.on('locationfound', this.onLocationFound);
    map.on('locationerror', this.onLocationError);

  }

  render() {
    return null;
  }
}

export default withLeaflet(LocateControl);
