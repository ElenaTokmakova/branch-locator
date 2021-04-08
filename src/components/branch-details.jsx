import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Map from './shared/map';
import HoursTable from './branch-details/hours-table';
import './branch-details.scss';
//import { formatTime, formatTimeFrench, getIndustryTypeInFrench, getServiceTypeInFrench, getDayOfTheWeekInFrench } from "./functions";

class BranchDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            location: {}
        };
    }

    componentDidMount () {
       const loc = this.props.location.state.location;
       this.setState({
           location: loc
       });
    }

    render () {
        const location = this.state.location;
        if (Object.keys(location).length > 0) {
            const locationData = [ { lat : location.branchLatitude, lng : location.branchLongitude, addresses : location.branchAddresses, branchNumber : location.branchNumber } ];
            return (
                <div className="branch-locator-content branch-locator-all-branches-content">
                    <h1 className="location-name">{location.branchCity}, {location.branchProvince}</h1>
                    <div className="row location-info-grid-row">
                        <div className="col-sm-5 location-info-column">
                            <img className="img-responsive location-image" src={location.branchPicture} alt={location.branchImageAlt} />
                            <h4 className="location-info-title">Address</h4>
                            {
                               (location.branchAddresses && location.branchAddresses.length > 0) &&
                                location.branchAddresses.map((address, index) => {
                                    return (
                                        <div key={address.Street} className="locationAddress">
                                            <p>{address.Street}</p>
                                            <p>{address.City}, {address.Province}, {address.PostalCode}}</p>
                                        </div>
                                   );
                                })
                            }
                            <h4 className="location-info-title">Phone</h4>
                            {
                               (location.branchContactInfo && location.branchContactInfo.length > 0) &&
                                location.branchContactInfo.map(contact => {
                                    if (contact.ContactTypeName === "Phone") {
                                        const telephone = 'tel:' + contact.ContactDesc;
                                        return (
                                            <div key={contact.ContactDesc} className="location-contact">
                                                <p><strong>{contact.ContactTypeName}: </strong><a href={telephone}>{contact.ContactDesc}</a></p>
                                            </div>
                                       );
                                    } else {
                                        return (
                                            <div key={contact.ContactDesc} className="location-contact">
                                                <p><strong>{contact.ContactTypeName}: </strong>{contact.ContactDesc}</p>
                                            </div>
                                       );
                                    }
                                })
                            }
                            <h4 className="location-info-title">Available Services</h4>
                            <ul className="branch-service-list">
                            {
                               (location.branchService && location.branchService.length > 0) &&
                                location.branchService.map(service => {
                                    return (
                                        <li key={service} className="service">
                                        { service === "Parts" && <span className="glyphicon glyphicon-service glyphicon-cog"></span> }
                                        { service === "Rental" && <span className="glyphicon glyphicon-service glyphicon-globe"></span> }
                                        { service === "Service" && <span className="glyphicon glyphicon-service glyphicon-wrench"></span> }
                                        { service === "Sales" && <span className="glyphicon glyphicon-service glyphicon-usd"></span> }
                                        <span>{service}</span>
                                      </li>
                                   );
                                })
                            }
                            </ul>
                            <h4 className="location-info-title">Contacts</h4>
                            {
                               (location.branchManagers && location.branchManagers.length > 0) &&
                                location.branchManagers.map(manager => {
                                    return (
                                        <div key={manager.Profile.Email} className="manager-contact">
                                            <p><strong>{manager.DisplayTitle}: </strong>
                                                <a href={`mailto:${manager.Profile.Email}`}>
                                                    {manager.Profile.FirstName} {manager.Profile.LastName}
                                                </a>
                                            </p>
                                        </div>
                                   );
                                })
                            }
                            <h4 className="location-info-title">Industries</h4>
                            <ul className="available-industries">
                            {
                               (location.branchIndustries && location.branchIndustries.length > 0) &&
                                location.branchIndustries.map(industry => {
                                    return (
                                        <li key={industry.BranchIndustryId} className="industry">{industry.Branch_IndustryType.IndustryTypeName}</li>
                                    );
                                })
                            }
                            </ul>
                        </div>
                        <div className="col-sm-7 location-info-column">
                            <Map branches={locationData} onMarkerClick={false}/>
                            <a target="_blank" rel='noreferrer noopener' href={location.branchMapLink} className="btn btn-primary btn-block get-directions-button">Get Directions</a>
                            <h4 className="location-info-title">Hours</h4>
                            <div className="row">
                                {
                                    (location.branchService && location.branchService.length > 0) &&
                                        location.branchService.map( (service, index) => {
                                            return (
                                                <div key={service} className="col-sm-6">
                                                    <div className="serviceHoursTable">
                                                        <h5>{service}</h5>
                                                        <HoursTable days={location.branchServiceTime[index]} />
                                                    </div>
                                                </div>
                                            );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>We are loding branches, please wait a second!</div>
            );
        }
    }

}

export default withRouter(BranchDetails);