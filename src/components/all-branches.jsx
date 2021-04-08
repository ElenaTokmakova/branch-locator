import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './all-branches.scss';

class AllBranches extends Component {
    componentDidMount() {
      this.props.reset();
    }
    render () {
      const { locations } = this.props;
      return (
          <div className="branch-locator-content">
            <div className="province-list-container">
              <ul className="province-list">
                {locations.sort().map(location => (
                  <li key={location[0]} className="province">
                    <h2 className="province-name">{location[0]}</h2>
                    <ul className="location-list row">
                    { location[1].map(location => {
                      return (
                        <li key={location.branchName} className="location col-sm-6">
                          <div className="row">
                            <div className="col-sm-6 col-xs-12">
                                <Link to={{
                                    pathname: `/branch-details/${location.branchNumber}`,
                                    state: { location }
                                  }}>
                                    <img className="img-responsive" src={location.branchPicture} alt={location.branchImageAlt} />
                                </Link>
                            </div>
                            <div className="col-sm-6 col-xs-12">
                                <Link to={{
                                    pathname: `/branch-details/${location.branchNumber}`,
                                    state: { location }
                                  }}>
                                    <h4 className="location-name">{location.branchName}</h4>
                                </Link>
                              <p>{location.branchStreet}</p>
                              <p>{location.branchCity} {location.branchPostalCode}</p>
                              <ul className="branch-service-list">
                                {location.branchService.map(service => {
                                  return (
                                    <li key={service} className="service">
                                      { service === "Parts" && <span className="glyphicon glyphicon-service glyphicon-cog"></span> }
                                      { service === "Rental" && <span className="glyphicon glyphicon-service glyphicon-globe"></span> }
                                      { service === "Service" && <span className="glyphicon glyphicon-service glyphicon-wrench"></span> }
                                      { service === "Sales" && <span className="glyphicon glyphicon-service glyphicon-usd"></span> }
                                      <span>{service}</span>
                                    </li>
                                  )
                                })}
                              </ul>
                              <Link to={{
                                    pathname: `/branch-details/${location.branchNumber}`,
                                    state: { location }
                                  }}><button className="btn btn-secondary view-branch-details">View Branch Details</button></Link>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
        </div>
      );
    }
}

export default withRouter(AllBranches);