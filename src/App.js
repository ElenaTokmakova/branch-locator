import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { PushSpinner } from "react-spinners-kit";
import BranchLocator from './components/branch-locator';
import AllBranches from './components/all-branches';
import BranchDetails from './components/branch-details';
import Header from './components/header';
import Filters from './components/shared/filters';
import Search from './components/search';
import { allProvinces, typeOfService, typeOfIndustry } from './components/shared/constants';
import axios from 'axios';
import './App.scss';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      locations: [],
      selectedLocations: [],
      allSelectedLocations: [],
      selectedBranchNames: [],
      filterAllBranches: false,
      filterBranchLocatos: false,
      openFilters: true
    };
    this.provinces = {};
    this.parsedProvinces = [];
    this.parsedLocations = [];
    this.parsedBranchNames = [];
    this.typeOfService = [];
    this.typeOfIndustry = [];
    this.selectedServices = [];
    this.selectedIndustries = [];
    this.selectedProvince = '';
    this.selectedBranch = '';
    this.lastClick = "";
  }

  componentDidMount() {
    axios.get("BRANCH_URL_HERE")
    .then(
      (result) => {

        this.data = result.data;
        this.provinces = allProvinces();
        this.typeOfService = typeOfService();
        this.typeOfIndustry = typeOfIndustry();

        const [parsedLocations, parsedBranchNames, parsedProvinces, allParsedLocations] = this.parseData();

        this.parsedProvinces = parsedProvinces;
        this.parsedLocations = parsedLocations;
        this.parsedBranchNames = parsedBranchNames;
        this.allParsedLocations = allParsedLocations;

        this.setState({
                isLoaded: true,
                locations: result.data,
                selectedLocations: this.parsedLocations,
                selectedBranchNames: this.parsedBranchNames,
                allSelectedLocations: this.allParsedLocations
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }

  onProvinceSelect = (selectedProvince) => {
    this.selectedProvince = selectedProvince;
    this.selectedBranch = '';
    this.lastClick = "province";
    this.getSelectedLocations();
  }

  onBranchSelect = (branch) => {
      this.selectedBranch = branch;
      this.lastClick = "branch";
      this.getSelectedLocations();
  }

  onTypeOfServiceSelect = (service) => {
    if (!this.selectedServices.includes(service)) {
      this.selectedServices.push(service);
    } else {
      const index = this.selectedServices.indexOf(service);
      this.selectedServices.splice(index, 1);
    }
    this.getSelectedLocations();
  }

  onTypeOfIndustrySelect = (industry) => {
    if (!this.selectedIndustries.includes(industry)) {
      this.selectedIndustries.push(industry);
    } else {
      const index = this.selectedIndustries.indexOf(industry);
      this.selectedIndustries.splice(index, 1);
    }
    this.getSelectedLocations();
  }

  onFiltersButtonClick = () => {
    this.setState({ openFilters: !this.state.openFilters })
  }

  onResetFiltersButtonClick = () => {
    this.selectedBranch = "";
    this.selectedProvince = "";
    this.selectedIndustries = [];
    this.selectedServices = [];
    this.setState({
      selectedLocations: this.parsedLocations,
      selectedBranchNames: this.parsedBranchNames
    })
    this.getSelectedLocations();
  }

  onLastClick = (lastClickValue) => {
    this.lastClick = lastClickValue;
    this.getSelectedLocations();
  }

  parseData() {
    const [parsedLocations, allParsedLocations] = this.getBranches(this.data, this.provinces);

    // get provinces and branches in alphabetical order for selects
    const parsedProvinces = parsedLocations.map(parsedLocation => parsedLocation[0])
          .sort( (a,b) => {
            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
          });
    const parsedBranchNames = parsedLocations.reduce((total, current) => total.concat(current[1]), [])
          .map( (branch) => ( { branchName: branch.branchName, branchProvince: this.provinces[branch.branchProvince]}))
          .sort( (a,b) => {
            if(a.branchName < b.branchName) { return -1; }
            if(a.branchName > b.branchName) { return 1; }
            return 0;
          });

    return [parsedLocations, parsedBranchNames, parsedProvinces, allParsedLocations];
  }

  // update selected locations based on 1) selected province 2) selected branch 3) selected services 4) selected industries
  getSelectedLocations() {

    const [parsedLocations, parsedBranchNames] = this.parseData();

    let selectedLocations = parsedLocations;
    let selectedBranchNames = parsedBranchNames;

    if (this.selectedProvince) {
        selectedLocations = parsedLocations.filter( parsedLocation => parsedLocation[0] === this.selectedProvince );
        selectedBranchNames = parsedBranchNames.filter( parsedBranchName => parsedBranchName.branchProvince === this.selectedProvince  );
    }

    if (this.selectedBranch) {
        let matchingBranch = this.state.locations.filter(location => location.BranchName === this.selectedBranch)[0];
        const province = this.provinces[matchingBranch.Branch_Address[0].Province];
        const selectedBranch = this.mapBranch(matchingBranch, province);
        selectedLocations = [[ province, [ selectedBranch ] ] ];
    }

    selectedLocations.forEach(location => {
      const temp = [];
      location[1].forEach( (branch, index) => {
        const serviceIntersection = branch.branchService.filter(service => this.selectedServices.includes(service));
        const industryIntersection = branch.branchIndustries.map(industry => industry.Branch_IndustryType.IndustryTypeName)
                                    .filter(industry => this.selectedIndustries.includes(industry));
        const matches = serviceIntersection.length === this.selectedServices.length &&
                        industryIntersection.length === this.selectedIndustries.length;
        if (matches) {
          temp.push(branch);
        }
      });
      location[1] = temp;
    })
    const locationsWithBranches = selectedLocations.filter(location => location[1].length > 0);
    const allSelectedLocations = locationsWithBranches.reduce( (accumulator, element) => {
      accumulator.push(element[1]);
      return accumulator;
    }, []).reduce((a, b) => a.concat(b), []);
    this.setState({ selectedLocations: locationsWithBranches, selectedBranchNames, allSelectedLocations  })
  }

  // create a mapping of provinces/branches for the all branches component
  getBranches(locations, provinces) {
    const branchLocationsByProvinces = {};
    const allParsedLocations = [];
    locations.forEach(location => {
      if (location.Branch_Address.length > 0) {
         const province = location.Branch_Address[0].Province;
         if (province) {
            const currentLocation = this.mapBranch(location, province);
            if (!branchLocationsByProvinces[provinces[province]]) {
              branchLocationsByProvinces[provinces[province]] = [];
            }
            branchLocationsByProvinces[provinces[province]].push(currentLocation);
            allParsedLocations.push(currentLocation);
         }
      }
    });
    for (let province in branchLocationsByProvinces) {
      branchLocationsByProvinces[province].sort( (a,b) => {
          if(a.branchName < b.branchName) { return -1; }
          if(a.branchName > b.branchName) { return 1; }
          return 0;
      });
    }
    const mappedLocations = Object.entries(branchLocationsByProvinces);
    return [mappedLocations, allParsedLocations];
  }

  // prepare the branch object
  mapBranch(location, province){
    //console.log(location)
    const street = location.Branch_Address[0] ? location.Branch_Address[0].Street : '';
    const city = location.Branch_Address[0] ? location.Branch_Address[0].City : '';
    const postalCode = location.Branch_Address[0] ? location.Branch_Address[0].PostalCode : '';
    const branchPicture = `BRANCH_IMAGE_URL_HERE/${location.BranchNo}.jpg`;
    const branchImageAlt = `Branch in ${location.BranchName}, ${province}`;
    const branchService = location.Branch_Service.map(service => service.ServiceTypeName);
    const branchServiceTime = location.Branch_Service.reduce( (accumulator, element) => {
        accumulator.push(element.Branch_ServiceTime);
        return accumulator;
      }, []);
    return {
        branchNumber: location.BranchNo,
        branchName: location.BranchName,
        branchLocation: location.BranchNo,
        branchAddresses: location.Branch_Address,
        branchContactInfo: location.Branch_Contact_Info,
        branchManagers: location.Branch_Manager,
        branchService,
        branchServiceTime,
        branchIndustries: location.Branch_Industry,
        branchStreet: street,
        branchCity: city,
        branchPostalCode: postalCode,
        branchProvince: province,
        branchPicture,
        branchImageAlt,
        branchMapLink: location.GeoLink,
        branchLatitude: location.Latitude,
        branchLongitude: location.Longitude
    };
  }

  render(){
    const { error, isLoaded, locations, openFilters, selectedLocations, selectedBranchNames, allSelectedLocations } = this.state;
    const filterProps = {
      filters : openFilters,
      typeOfService : this.typeOfService,
      typeOfIndustry : this.typeOfIndustry,
      provinces : this.parsedProvinces,
      locations : selectedLocations,
      branchNames : selectedBranchNames,
      selectedProvince : this.selectedProvince,
      selectedBranch : this.selectedBranch,
      onProvinceSelect : this.onProvinceSelect,
      onBranchSelect : this.onBranchSelect,
      onFiltersButtonClick : this.onFiltersButtonClick,
      onResetFiltersButtonClick : this.onResetFiltersButtonClick,
      onTypeOfIndustrySelect : this.onTypeOfIndustrySelect,
      onTypeOfServiceSelect : this.onTypeOfServiceSelect
    }
    const branchLocatorProps = {
      locations : allSelectedLocations,
      reset : this.onResetFiltersButtonClick,
      selectedProvince : this.selectedProvince,
      selectedBranch : this.selectedBranch,
      lastClick : this.lastClick,
      onLastclick : this.onLastClick
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <PushSpinner size={100} color="#ffcd11" loading={!this.state.loaded} className="branch-locator-spinner"/>;
    } else {
      return (
        <div className="branch-locator-app-container container">
          <Router>
            <Header />
            <Switch>
              <Route path="/branch-locator">
                <div role="tabpanel" className="tab-pane" id="branch-locator">
                  <Search locations={locations}/>
                  <Filters {... filterProps}/>
                  <BranchLocator {...branchLocatorProps}/>
                </div>
              </Route>
              <Route path="/all-branches">
                <div role="tabpanel" className="tab-pane" id="all-branches">
                  <Filters {...filterProps}/>
                  <AllBranches locations={selectedLocations} reset={this.onResetFiltersButtonClick}/>
                </div>
              </Route>
              <Route path="/branch-details/:id">
                <div role="tabpanel" className="tab-pane" id="branch-details">
                    <BranchDetails />
                </div>
              </Route>
              <Redirect from='/branch-details/' to='/all-branches' exact />
              <Route path="/">
                <div role="tabpanel" className="tab-pane" id="all-branches">
                   <Search locations={locations}/>
                   <Filters {...filterProps}/>
                   <BranchLocator {...branchLocatorProps}/>
                 </div>
              </Route>
            </Switch>
          </Router>
        </div>
      );
    }
  }

}