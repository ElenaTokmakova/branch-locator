import React, { Component } from 'react';
import './branch-locator.scss';
import Map from './shared/map';
import Branch from './branch-locator/branch';
import { coordinates } from './shared/constants';

class BranchLocator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            position: []
        }
        this.refs = {};
    }

    componentDidMount() {
        this.props.reset();
    }

    onMarkerClick = (index) => {
        this.refs[index].current.scrollIntoView({
            behaviour: 'smooth',
            block: 'start'
        })
    }

    onBranchInfoClick = (coordinates) => {
        this.lastClick = "branch-info";
        this.props.onLastclick("branch-info");
        this.setState({ position : coordinates })
    }

    render() {

        const { selectedProvince, selectedBranch } = this.props;
        let coords = [];
        if ( selectedProvince ) {
            coords = coordinates()[selectedProvince];
        }
        const { locations } = this.props;
        const refs = locations.reduce((acc, value, index) => {
            acc[index] = React.createRef();
            return acc;
        }, {});
        this.refs = refs;
        if (locations && locations.length > 0) {
            const branchesWrapperRef = React.createRef();
            const locationData = locations.map(location => {
                return {
                    lat : location.branchLatitude,
                    lng : location.branchLongitude,
                    addresses : location.branchAddresses,
                    branchNumber : location.branchNumber,
                    branchPicture: location.branchPicture,
                    branchImageAlt: location.branchImageAlt
                }
            })
            return (
                <div className="branch-locator-content branch-locator-find-branch-content">
                    <div className="row branches-map-wrapper">
                        <div ref={branchesWrapperRef} className="col-sm-4 branches-wrapper">
                            <h4>List of branches: {locations.length}</h4>
                            {
                                locations.map((location, index) => {
                                    return (
                                        <Branch currentRef={refs[index]} key={location.branchNumber} branch={location} index={index + 1} onBranchInfoClick={this.onBranchInfoClick} />
                                    );
                                })
                            }
                        </div>
                        <div className="col-sm-8 map-wrapper">
                            <Map branches={locationData}
                                onMarkerClick={this.onMarkerClick}
                                selectedBranch={selectedBranch}
                                coords={coords.length > 0 ? coords : this.state.position}
                                position={this.state.position} lastClick={this.props.lastClick}/>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>Error! There are no locations...</div>
            );
        }
    }
}

export default BranchLocator;