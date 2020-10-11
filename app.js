class COVID19Dataset {

    constructor() {
        
    }

    deathRates = {
        //https://www.acsh.org/news/2020/06/23/coronavirus-covid-deaths-us-age-race-14863
        //https://osf.io/wdbpe/
        // Death rates of different age groups
        CHILD: 0.000016,
        TEEN: 0.0000032,
        ADULT_20_49: 0.000092,
        ADULT_50_64: 0.0014,
        ADULT_65UP: 0.056,
    };

    reducers = {
        // Reducers (variables that may reduce covid cases/deaths)
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

    increasers = {
        // Increasers (variables that may increaase covid cases/deaths)
        BARS_OPEN: 0.05,
        SCHOOLS: 0.25,
        TRAVEL_PRESPREAD: 0.20,
        TRAVEL_POSTSPREAD: 0.03,
        PARTIES: 0.10,
        LOCAL_TRAVEL: 0.10,
    };

    selectorReducers = {
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

    selectorIncreasers = {
        // Increasers
        BARS_OPEN: 1,
        SCHOOLS: 1,
        TRAVEL_PRESPREAD: 1,
        TRAVEL_POSTSPREAD: 1,
        PARTIES: 1,
        LOCAL_TRAVEL: 1
    }

    // Arrays for each age group that include deaths per day per index
    deathsTotal = [];
    deathsChild = [];
    deathsTeen = [];
    deaths20_49 = [];
    deaths50_64 = [];
    deaths65up = [];

    generateData(days) {
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

}

let dataset = new COVID19Dataset();
dataset.generateData();

// Credit to https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e for the basic code of this D3 graph
// Estblish the dimensions of the chart
let margin = {top: 30, right: 30, bottom: 30, left: 30};
let width = 1100 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

let x = d3.scaleTime().range([0, width]);
let y = d3.scaleLinear().range([height, 0]);

let valueline = d3.line()
    .x(function(day) { return x(day); })
    .y(function(cases) { return y(cases); });


let svg = d3.select("#graph_field")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let dummyArray = [];
for (let i = 0; i < dataset.deathsTotal.length; i++) {
    dummyArray[i] = i;
}

x.domain(d3.extent(dummyArray, function(d) { return d; }));
y.domain([0, d3.max(dataset.deathsTotal, function(d) { return d; })]);

svg.append("path")
    .data([dataset.deathsTotal])
    .attr("class", "line")
    .attr("d", valueline);

svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Number of Days");

svg.append("g")
      .call(d3.axisLeft(y));

svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Cases");      