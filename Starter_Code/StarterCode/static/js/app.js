//set dataset into a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//create a promise
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

//fetch json data and log it in console
d3.json(url).then(function(data) {
    console.log(data);
});

//initialize 
function initialize() {

const dropdown = d3.select("#selDataset");

d3.json(url).then((data) => {
        
    //Set a variable for the sample names
    let names = data.names;

    //Add  samples to dropdown menu
    names.forEach((id) => {

        //Log the value of id for each iteration of the loop
        console.log(id);

        dropdown.append("option")
        .text(id)
        .property("value",id);
    });

    //Set the first sample from the list
    let first_sample = names[0];

    //Log the value of first sample
    console.log(first_sample);

    //call functions for the plots
    
    //initialize the bar char
    bar_chart(first_sample);
    
    //initialize the bubble chart
    bubble_chart(first_sample);
    
    //initialize the demographic metadata 
    demographic_info(first_sample);
   
    

 });
};

//create a function to plot the bar chart
function bar_chart(sample) {

    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sample_info = data.samples;

        // Filter based on the value of the sample
        let value = sample_info.filter(result => result.id == sample);

        // Get the first index from the array
        let bar_data = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = bar_data.otu_ids;
        let otu_labels = bar_data.otu_labels;
        let sample_values = bar_data.sample_values;

        //store data in the console
        console.log(otu_ids,otu_labels,sample_values);

        //display top 10 in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        //trace and setup bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        //add a title to the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        //plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

//create a function to plot the bubble chart
function bubble_chart(sample) {

    d3.json(url).then((data) => {
        
        
        let sample_info = data.samples;

        //filter by sample value
        let value = sample_info.filter(result => result.id == sample);

        //store first index
        let bubble_data = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = bubble_data.otu_ids;
        let otu_labels = bubble_data.otu_labels;
        let sample_values = bubble_data.sample_values;

        //store the data on the console
        console.log(otu_ids,otu_labels,sample_values);
        
        //trace bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        //create layout for bubble chart
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        //plot bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });

};

//create function to populate demographic metadata
function demographic_info(sample) {

    //retrieve data
    d3.json(url).then((data) => {
        
        //store metadata in variable
        let meta_data = data.metadata;

        //filter based on the id of the sample
        let sample_id = meta_data.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(sample_id)

        // Get the first index from the array
        let sample_data = sample_id[0];
 
        // Clear out metadata
        d3.select("#sample-metadata").html("");
 
         // Use Object.entries to add each key/value pair to the panel
        Object.entries(sample_data).forEach(([key,sample_id]) => {
 
            // Log the individual key/value pairs as they are being appended to the metadata panel
             console.log(key,sample_id);
 
            d3.select("#sample-metadata").append("h5").text(`${key}: ${sample_id}`);
        });

    });

};

//use function from index.html to change displays when sample is updated
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    bar_chart(value);
    bubble_chart(value);
    demographic_info(value);
};

initialize();
