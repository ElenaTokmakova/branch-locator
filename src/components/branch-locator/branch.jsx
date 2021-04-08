import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './branch.scss';

const Branch = ({ branch, index, currentRef, onBranchInfoClick }) => {
    const branchIDLink = `#${branch.branchName}`;
    const coords = [  branch.branchLatitude, branch.branchLongitude ]
    return (
        <div className="branch-information-container" ref={currentRef}>
            <div className="branch-details" href={branchIDLink} onClick={ () => onBranchInfoClick(coords)}>
                <table>
                    <tbody>
                        <tr>
                            <td valign="top" className="yellow-marker-small">
                                <img alt={branch.branchName} src="ICON_HERE.png" />
                                <div className="number">{index}</div>
                            </td>
                            <td className="branch-details-basic">
                                <h4 className="branch-name">{branch.branchName}</h4>
                                {
                                    (branch.branchAddresses && branch.branchAddresses.length > 0) &&
                                    branch.branchAddresses.map((address, index) => {
                                        return (
                                            <div key={address.Street} className="locationAddress">
                                                <p>{address.Street}</p>
                                                <p>{address.City}, {address.Province}, {address.PostalCode}}</p>
                                            </div>
                                        );
                                    })
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {
                (branch.branchContactInfo && branch.branchContactInfo.length > 0) &&
                branch.branchContactInfo.map(contact => {
                    if (contact.ContactTypeName === "Phone") {
                        const telephone = 'tel:' + contact.ContactDesc;
                        return (
                            <div key={contact.ContactDesc + branch.branchNumber} className="branch-contact">
                                <p><strong>{contact.ContactTypeName}: </strong><a href={telephone}>{contact.ContactDesc}</a></p>
                            </div>
                        );
                    } else {
                        return (
                            <div key={contact.ContactDesc + branch.branchLNumber} className="branch-contact">
                                <p><strong>{contact.ContactTypeName}: </strong>{contact.ContactDesc}</p>
                            </div>
                        );
                    }
                })
            }
            <ul className="branch-service-list">
                {
                    (branch.branchService && branch.branchService.length > 0) &&
                    branch.branchService.map(service => {
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
            <a href={branchIDLink} rel="noopener noreferrer" id="seemap" className="map-link">See on map</a>
            <a target="_blank" rel="noopener noreferrer" className="getdirections" href={branch.branchMapLink}> Directions&nbsp;»</a><br/>
            <Link to={{
                pathname: `/branch-details/${branch.branchNumber}`,
                state: { branch }
            }}>Branch&nbsp;Details&nbsp;»</Link>
        </div>
    );
}

export default withRouter(Branch);

