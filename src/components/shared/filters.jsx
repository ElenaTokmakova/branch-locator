import React from 'react';
import './filters.scss';

const Filters = ({ provinces, branchNames, selectedProvince, selectedBranch, onProvinceSelect, onBranchSelect, onFiltersButtonClick, onResetFiltersButtonClick, filters, typeOfService, typeOfIndustry, onTypeOfServiceSelect, onTypeOfIndustrySelect, resetCheckboxes }) => {
    const filtersIcon = filters ? 'plus' : 'minus';

    const serviceTypeRefs = typeOfService.reduce((acc, value, index) => {
        acc[index] = React.createRef();
        return acc;
    }, []);

    const industryTypeRefs = typeOfIndustry.reduce((acc, value, index) => {
        acc[index] = React.createRef();
        return acc;
    }, []);

    const uncheckCheckboxes = () => {
        serviceTypeRefs.forEach(ref => ref.current.checked = false);
        industryTypeRefs.forEach(ref => ref.current.checked = false);
    }

    const resetFiltersAndCheckboxes = () => {
        onResetFiltersButtonClick();
        uncheckCheckboxes();
    }

    return (
        <div className="action-buttons-container">

          <div className="filters-dropdown-buttons-wrapper">
            <div className="action-button dropdown province-dropdown">
              <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {selectedProvince === "" ? 'Select a Province' : selectedProvince }
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                  { provinces.map( province => {
                    return (
                        <li key={province} onClick={ (event) => onProvinceSelect(province, event)} ><span>{province}</span></li>
                    );
                  } ) }
              </ul>
            </div>

            <div className="action-button dropdown branch-dropdown">
              <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {selectedBranch === "" ? 'Select a Branch' : selectedBranch}
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu dropdown-menu-branch" aria-labelledby="dropdownMenu2">
                  {branchNames.map( locationName => {
                      return (
                          <li key={locationName.branchName} onClick={ (event) => onBranchSelect(locationName.branchName, event)} ><span>{locationName.branchName} </span></li>
                      );
                  })}
              </ul>
            </div>
          </div>

          <div className="filters-control-buttons-wrapper">
            <button onClick={ () => onFiltersButtonClick()} className="btn btn-primary action-button filters-control-button">
              <span className={"glyphicon glyphicon-" + filtersIcon} aria-hidden="true"></span>&nbsp; Advanced Filters
            </button>

            <button onClick={ () => resetFiltersAndCheckboxes()} className="btn btn-primary filters-reset-button action-button">
              <span className={"glyphicon glyphicon-refresh"}></span>&nbsp; Reset Filters
            </button>
          </div>

          <div className={"all-branches-filters " + (filters ? 'hidden' : '')}>
            <div className="all-branches-type-of-service-filters">
              <p className="filters-heading">Type of service</p>
              { typeOfService.map( (service, index) => {
                return (
                    <div key={service} className="checkbox">
                      <label htmlFor={service}>
                        <input type="checkbox" name={service} id={service} ref={serviceTypeRefs[index]} onClick={ () => onTypeOfServiceSelect(service)}></input>
                        <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                        <span>{service}</span>
                      </label>
                    </div>
                  );
                })
              }
            </div>

            <div className="all-branches-type-of-service-filters">
              <p className="filters-heading">Type of industry</p>
              { typeOfIndustry.map( (industry, index) => {
                return (
                  <div key={industry} className="checkbox">
                    <label htmlFor={industry}>
                      <input type="checkbox" name={industry} id={industry} ref={industryTypeRefs[index]} onClick={ () => onTypeOfIndustrySelect(industry)}></input>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      <span>{industry}</span>
                    </label>
                  </div>
                );
              }) }
            </div>
          </div>
        </div>

    );
}

export default Filters;