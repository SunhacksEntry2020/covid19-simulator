let deathRates = {
    //https://www.acsh.org/news/2020/06/23/coronavirus-covid-deaths-us-age-race-14863
    //https://osf.io/wdbpe/
    // Population
    CHILD: 0.000016,
    TEEN: 0.0000032,
    ADULT_20_49: 0.000092,
    ADULT_50_64: 0.0014,
    ADULT_65UP: 0.056,
};

let reducers = {
    // Reducers
    MASK_1PARTY: 0.65, // Reduction by 65% if 1 person in an interaction wears a mask (an educated guess)
    MASK_2PARTY: 0.95, // Reduction by 95% if both ppl in an interaction wear a mask
    SOCIAL_DISTANCING: 0.90,
    QUARANTINE_PRACTICAL: 0.60,
    QUARANTINE_IDEAL: 0.99999,
    // TODO: If sanitizer_usage and handwashing both in effect, give 0.15 instead of the straight sum.
    SANITIZER: 0.07,
    HANDWASHING: 0.10,
    SANITIZER_AND_HANDWASHING: 0.15,

    HEALTHCARE_ACCESSIBILITY: 0.02,
};

let increasers = {
    // Increasers
    BARS_OPEN: 0.05,
    SCHOOLS: 0.25,
    TRAVEL_PRESPREAD: 0.20,
    TRAVEL_POSTSPREAD: 0.03,
    PARTIES: 0.10,
    LOCAL_TRAVEL: 0.10,
};

let selectorReducers = {
    // Reducers
    MASK_1PARTY: 1,
    MASK_2PARTY: 0,
    SOCIAL_DISTANCING: 1,
    QUARANTINE_PRACTICAL: 1,
    QUARANTINE_IDEAL: 0,
    
    SANITIZER: 1,
    HANDWASHING: 1,
    SANITIZER_AND_HANDWASHING: 1,

    HEALTHCARE_ACCESSIBILITY: 1,
};

let selectorIncreasers = {
    // Inflaters
    BARS_OPEN: 1,
    SCHOOLS: 1,
    TRAVEL_PRESPREAD: 1,
    TRAVEL_POSTSPREAD: 1,
    PARTIES: 1,
    LOCAL_TRAVEL: 1
}

let deathsTotal = [];
let deathsChild = [];
let deathsTeen = [];
let deaths20_49 = [];
let deaths50_64 = [];
let deaths65up = [];

function generateData(days) {
    let cases = 10;
    let base = 1.1;

    let expFactor = base; // Start with base and multiply by all reducers and increasers

    Object.keys(reducers).forEach(function(factor) {
        expFactor = expFactor * (1 - (reducers[factor] * selectorReducers[factor]));
    });

    Object.keys(increasers).forEach(function(factor) {
        expFactor = expFactor * (1 + (increasers[factor] * selectorIncreasers[factor]));
    });

    // Use expFactor to simulate the spread of disease (which usually follows an exponential function) for a number of days
    for(let i = 0; i < days; i++) {
        // Increase number of cases accordingly
        cases = Math.ceil(cases * expFactor);
        // Increase number of deaths according to the number of cases, not exactly accurate to reality since there is a 2 week delay *****MIGHT FIX LATER
        deathsChild[i] = Math.floor(deathRates[CHILD] * cases);
        deathsTeen[i] = Math.floor(deathRates[TEEN] * cases);
        deaths20_49[i] = Math.floor(deathRates[ADULT_20_49] * cases);
        deaths50_64[i] = Math.floor(deathRates[ADULT_50_64] * cases);
        deaths65up[i] = Math.floor(deathRates[ADULT_65UP] * cases);
        deathsTotal[i] = deathsChild[i] + deathsTeen[i] + deaths20_49[i] + deaths50_64[i] + deaths65up[i];
    }

}

