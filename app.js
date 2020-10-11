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
        MASK_1PARTY: 0,
        MASK_2PARTY: 0,
        SOCIAL_DISTANCING: 0,
        QUARANTINE_PRACTICAL: 0,
        QUARANTINE_IDEAL: 0,
        
        SANITIZER: 0,
        HANDWASHING: 0,
        SANITIZER_AND_HANDWASHING: 0,

        HEALTHCARE_ACCESSIBILITY: 0,
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
    // Include tracker of total cases as well
    casesTotal = [];

    generateData(days) {
        
        let cases = 10;
        let base = 1;
        let expFactor = base; // Start with base and multiply by all reducers and increasers
        
        Object.keys(this.reducers).forEach((factor) => {
            expFactor = expFactor * (1 - (this.reducers[factor] * this.selectorReducers[factor]));
        });

        Object.keys(this.increasers).forEach((factor) => {
            expFactor = expFactor * (1 + (this.increasers[factor] * this.selectorIncreasers[factor]));
        });

        expFactor = ((expFactor - 1) * 0.1) + 1;

        console.log(expFactor);

        // Use expFactor to simulate the spread of disease (which usually follows an exponential function) for a number of days
        for(let i = 0; i < days; i++) {
            // Increase number of cases accordingly
            cases = Math.ceil(cases * expFactor);
            this.casesTotal[i] = cases;
            
            // Increase number of deaths according to the number of cases, not exactly accurate to reality since there is a 2 week delay *****MIGHT FIX LATER
            this.deathsChild[i] = {day: i, deaths: Math.floor(this.deathRates["CHILD"] * cases)};
            this.deathsTeen[i] = {day: i, deaths: Math.floor(this.deathRates["TEEN"] * cases)};
            this.deaths20_49[i] = {day: i, deaths: Math.floor(this.deathRates["ADULT_20_49"] * cases)};
            this.deaths50_64[i] = {day: i, deaths: Math.floor(this.deathRates["ADULT_50_64"] * cases)};
            this.deaths65up[i] = {day: i, deaths: Math.floor(this.deathRates["ADULT_65UP"] * cases)};
            this.deathsTotal[i] = this.deathsChild[i].deaths + this.deathsTeen[i].deaths + this.deaths20_49[i].deaths + this.deaths50_64[i].deaths + this.deaths65up[i].deaths;
        }

    }

}

let dataset = new COVID19Dataset();
dataset.generateData(180);

function graphSetup() {
    // Credit to https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e for the basic code of this D3 graph
    // Estblish the dimensions of the chart
    let margin = {top: 30, right: 30, bottom: 30, left: 100};
    let width = 1100 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

}

function renderLine() {
    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    let valueline = d3.line()
        .x(function(d) { return x(d.day); })
        .y(function(d) { return y(d.deaths); });

    let svg = d3.select("#graph_field")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(dataset.deathsTotal, function(d) { return d.day; }));
    y.domain([0, d3.max(dataset.deathsTotal, function(d) { return d.deaths; })]);

    console.log(dataset.deathsTotal);

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

    svg.append("path")
        .data([dataset.deathsTotal])
        .attr("class", "line")
        .attr("d", valueline);
}

generateGraph();