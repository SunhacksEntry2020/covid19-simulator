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
        MASK_1PARTY: 0.05, // Reduction by 65% if 1 person in an interaction wears a mask (an educated guess)
        MASK_2PARTY: 0.12, // Reduction by 95% if both ppl in an interaction wear a mask
        SOCIAL_DISTANCING: 0.20,
        QUARANTINE_PRACTICAL: 0.35,
        QUARANTINE_IDEAL: 0.99999,
        //If sanitizer_usage and handwashing both in effect, give 0.15 instead of the straight sum.
        SANITIZER: 0.01,
        HANDWASHING: 0.02,
        SANITIZER_AND_HANDWASHING: 0.04,
        HEALTHCARE_ACCESSIBILITY: 0.02,
    };

    increasers = {
        // Increasers (variables that may increaase covid cases/deaths)
        BARS_OPEN: 0.02,
        SCHOOLS: 0.04,
        TRAVEL_PRESPREAD: 0.08,
        TRAVEL_POSTSPREAD: 0.001,
        PARTIES: 0.02,
        LOCAL_TRAVEL: 0.01,
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

        expFactor = (expFactor * 0.13) + 1;

        console.log(expFactor);

        // Use expFactor to simulate the spread of disease (which usually follows an exponential function) for a number of days
        for(let i = 0; i < days; i++) {
            // Increase number of cases accordingly
            cases = Math.ceil(cases * expFactor);
            this.casesTotal[i] = {day: i, cases: cases};
            
            console.log(cases);

            // Increase number of deaths according to the number of cases, not exactly accurate to reality since there is a 2 week delay *****MIGHT FIX LATER
            this.deathsChild[i] = {day: i, deaths: Math.floor(this.deathRates["CHILD"] * cases)};
            this.deathsTeen[i] = {day: i, deaths: Math.floor(this.deathRates["TEEN"] * cases)};
            this.deaths20_49[i] = {day: i, deaths: Math.floor(this.deathRates["ADULT_20_49"] * cases)};
            this.deaths50_64[i] = {day: i, deaths: Math.floor(this.deathRates["ADULT_50_64"] * cases)};
            this.deaths65up[i] = {day: i, deaths: Math.floor(this.deathRates["ADULT_65UP"] * cases)};
            this.deathsTotal[i] = {day: i, deaths: (this.deathsChild[i].deaths + this.deathsTeen[i].deaths + this.deaths20_49[i].deaths + this.deaths50_64[i].deaths + this.deaths65up[i].deaths)};
        }

    }

}

class Graph {
    days;
    deathcap;
    margin;
    width;
    height;
    x;
    y;
    valueline;
    svg;

    constructor (days, deathcap) {
        this.days = days;
        this.deathcap = deathcap;

        // Credit to https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e for the basic code of this D3 graph

        // Estblish the dimensions of the chart
        this.margin = {top: 30, right: 30, bottom: 50, left: 100};
        this.width = 1100 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;

        this.x = d3.scaleLinear().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);

        this.valueline = d3.line()
            .x((d) => { return this.x(d.day); })
            .y((d) => { return this.y(d.deaths); });

        this.svg = d3.select("#graph_field")
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.x.domain([0, days]);
        this.y.domain([0, deathcap]);

        this.svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x))
            // .selectAll("text")
            // .remove();

        this.svg.append("text")
            .attr("x", this.width/2)
            .attr("y", this.height + 35)
            .attr("text-anchor", "middle")
            .text("Time");
    
        this.svg.append("g")
            .call(d3.axisLeft(this.y))
            // .selectAll("text")
            // .remove();
    
        this.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left)
            .attr("x",0 - (this.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Deaths");     
    }

    

    renderLine(dataset, color) {
        this.svg.append("path")
            .data([dataset.deathsChild])
            .attr("class", "line" + color)
            .attr("d", this.valueline);
    }
}

let dataset = new COVID19Dataset();
dataset.generateData(180);

let dataset2 = new COVID19Dataset();
dataset2.selectorReducers.MASK_1PARTY = 1;
dataset2.selectorReducers.QUARANTINE_PRACTICAL = 1;
dataset2.generateData(180);

let dataset3 = new COVID19Dataset();
dataset3.selectorReducers.MASK_1PARTY = 1;
dataset3.selectorReducers.MASK_2PARTY = 1;
dataset3.selectorReducers.SOCIAL_DISTANCING = 1;
dataset3.selectorReducers.QUARANTINE_PRACTICAL = 1;

dataset3.generateData(180);

let graph = new Graph(180, 1000);
graph.renderLine(dataset, "Red");
graph.renderLine(dataset2, "Blue");
graph.renderLine(dataset3, "Green");