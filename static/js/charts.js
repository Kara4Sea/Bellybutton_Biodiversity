function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples = data.samples
    console.log(allSamples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // buildCharts
    filterObject = allSamples.filter(chosen => chosen.id == sample)
    console.log(filterObject)
    //  5. Create a variable that holds the first sample in the array.
    // I was actually mistaken, 
    // so your init function will populate the page with the first data that has been selected, 
    // but in this case they just want you to take you it r filtered array and 
    // saveas a variable that will allow you to use the dictionary inside of it
    // Since the filterObject now contains an array that only has one dictionary, 
    // you just need to pick that dictionaryfrom the array. 
    // Since arrays always start at index 0, you just have to use 0 when picking the dictionary
    // var firstVariable = filterObject.slice(0);
    // console.log(firstVariable)
    
    let firstObject = filterObject[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otuIds = firstObject.otu_ids
    console.log(otuIds)

    otuLabels = firstObject.otu_labels
    console.log(otuLabels)

    sampleValues= firstObject.sample_values
    console.log(sampleValues)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
// top ten sampleValues in descending order -  use sort.
// reflect corresponding OTU
// use .map()?
    var yticks = otuIds.slice(0, 10).map(x => `OTU ${x}`).reverse();


    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    var barData = [barTrace];


      
    // ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      xaxis: {title: "Sample Values" },
      yaxis: {title: "OTU ID's"},
      title: "Top 10 Bacterial Cultures Found"
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };
    
    var bubbleData = [bubbleTrace];


    // 2. Create the layout for the bubble chart.

    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID" },
      showlegend: false,

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

// 
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var frequency = result.wfreq
 // 4. Create the trace for the gauge chart.
 var gaugeData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: frequency,
    title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week"  },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [null, 10] },
      bar: { color: "black" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "yellowgreen" },
        { range: [8, 10], color: "green" },
      ],

    }
  }
];

// 5. Create the layout for the gauge chart.
var gaugeLayout = { 
 
};

// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
