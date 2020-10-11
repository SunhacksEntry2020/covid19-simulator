
let config = {
    // Reducers
    MASK_1PARTY: 0.65, // Reduction by 65% if 1 person in an interaction wears a mask (just a guess)
    MASK_2PARTY: 0.95, // Reduction by 95% if both ppl in an interaction wear a mask
    SOCIAL_DISTANCING: 0.90,
    QUARANTINE_PRACTICAL: 0.60,
    QUARANTINE_IDEAL: 0.99999,
    // TODO: If sanitizer_usage and handwashing both in effect, give 0.15 instead of the straight sum.
    SANITIZER: 0.07,
    HANDWASHING: 0.10,
    SANITIZER_AND_HANDWASHING: 0.15,
    HEALTHCARE_ACCESSIBILITY: 0.02,

    // Inflaters
    BARS_OPEN: 0.05,
    SCHOOLS: 0.25,
    TRAVEL_PRESPREAD: 0.20,
    TRAVEL_POSTSPREAD: 0.03,
    PARTIES: 0.10,
    LOCAL_TRAVEL: 0.10,

    //https://www.acsh.org/news/2020/06/23/coronavirus-covid-deaths-us-age-race-14863
    //https://osf.io/wdbpe/
    // Population
    CHILD_DEATH: 0.000016,
    TEEN_DEATH: 0.0000032,
    ADULT_DEATH_20_49: 0.000092,
    ADULT_DEATH_50_64: 0.0014,
    ADULT_DEATH_65UP: 0.056,
};

let deathTotal = [];
let deathsChild = [];
let deathsTeen = [];
let deaths20_49 = [];
let deaths50_64 = [];
let deaths65up = [];


async function generateData() {

}