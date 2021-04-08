//Format Hours
export function formatTime(time) {
    time = time.split(/:/);
    var hours = time[0];
    var minutes = time[1];
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//Format hours French
export function formatTimeFrench(time) {
    time = time.split(/:/);
    var hours = time[0];
    var minutes = time[1];
    var strTime = hours + ':' + minutes;
    return strTime;
}

export function getIndustryTypeInFrench(industry) {
    var industry_french = industry;
    switch (industry) {
        case "On-Highway Truck Engines":
            industry_french = "Moteurs de camions rigides";
            break;
        case "Mining":
            industry_french = "Mines";
            break;
        case "Crushing":
            industry_french = "Concassage";
            break;
        case "Paving":
            industry_french = "Pavage";
            break;
        case "Vocational Trucks":
            industry_french = "Camions professionnels";
            break;
        case "Electrical Power":
            industry_french = "Puissance électrique";
            break;
        case "Industrial And Rail Engines":
            industry_french = "Moteurs industriels & de rail";
            break;
        case "Oil & Gas":
            industry_french = "Huile & gaz";
            break;
        case "Marine Engines":
            industry_french = "Moteurs marins";
            break;
        case "Lift":
            industry_french = "Chariot élévateurs";
            break;
        case "Forestry":
            industry_french = "Machines forestières";
            break;
        default:
        // code block
    }
    return industry_french;
}

export function getServiceTypeInFrench(service) {
    var service_french = service;
    switch (service) {
        case "Parts":
            service_french = "Pièces";
            break;
        case "Rental":
            service_french = "Location";
            break;
        case "Sales":
            service_french = "Ventes";
            break;
        default:
        // code block
    }
    return service_french;
}

export function getDayOfTheWeekInFrench(day) {
    var day_french = day;
    switch (day) {
        case "Monday":
            day_french = "Lundi";
            break;
        case "Tuesday":
            day_french = "Mardi";
            break;
        case "Wednesday":
            day_french = "Mercredi";
            break;
        case "Thursday":
            day_french = "Jeudi";
            break;
        case "Friday":
            day_french = "Vendredi";
            break;
        case "Saturday":
            day_french = "Samedi";
            break;
        default:
        // code block
    }
    return day_french;
}