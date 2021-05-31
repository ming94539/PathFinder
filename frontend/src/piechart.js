import React from 'react';
import SharedContext from './SharedContext';
import './style.css';
import * as d3 from 'd3';

/**
 * @return {object} JSX
 */

export default function PieChart(props) {
  const {data, setData, 
  //   chartDrawn, setChartDrawn, 
  //   numCards, setNumCards,
    // currID, setCurrID,
  } = React.useContext(SharedContext);

  /**
   * Referenced:
   * https://codepen.io/thecraftcoderpdx/pen/jZyzKo
   */
  const drawChart = () => {
    // console.log('[drawChart2] Data:', props.data);

    let svg = d3.select('svg');
    // let width = svg.attr('width');
    // let height = svg.attr('height');
    let width=350;
    let height=350;
    let margin = 10;

    // a circle chart needs a radius
    var radius = Math.min(width, height) / 2 - margin;

    // legend dimensions
    // var legendRectSize = 25; // defines the size of the colored squares in legend
    // var legendSpacing = 6; // defines spacing between squares

    // define color scale
    var color = d3.scaleOrdinal(d3.schemeSet3);
    // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
    const pieID = `#pie${props.id}`;
    console.log('[drawChart] Drawing chart at pie:', `${pieID}`);

    let dataEntry = data.find(e => e.id == props.id);
    if (!dataEntry) {
      console.log('[drawChart] Data entry not found at id:', props.id);
      return;
    }
    let pieData = dataEntry.data;
    console.log('[drawChart] Drawing chart with data:', pieData);
    
    svg = d3.select(pieID) // select element in the DOM with id 'chart'
      .append('svg') // append an svg element to the element we've selected
      .attr('width', width) // set the width of the svg element we just added
      .attr('height', height) // set the height of the svg element we just added
      .append('g') // append 'g' element to the svg element
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

    // console.log('svg:', svg);  

    var arc = d3.arc()
      .innerRadius(0) // none for pie chart
      .outerRadius(radius); // size of overall chart

    var pie = d3.pie() // start and end angles of the segments
      .value(function(d) { 
        return d.count; 
      }) // how to extract the numerical data from each entry in our data
      .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null
    
    // svg.append('div')
    //   .attr('class', 'legend');

    // define tooltip
    var tooltip = d3.select(pieID) // select element in the DOM with id 'chart'
      .append('div') // append a div element to the element we've selected                                    
      .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

    tooltip.append('div') // add divs to the tooltip defined above                            
      .attr('class', 'label'); // add class 'label' on the selection                         

    tooltip.append('div') // add divs to the tooltip defined above                     
      .attr('class', 'count'); // add class 'count' on the selection                  

    tooltip.append('div') // add divs to the tooltip defined above  
      .attr('class', 'percent'); // add class 'percent' on the selection

    // creating the chart
    var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
      .data(pie(pieData)) //associate data wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
      .enter() //creates placeholder nodes for each of the values
      .append('path') // replace placeholders with path elements
      .attr('d', arc) // define d attribute with arc function above
      .attr('fill', function(d) { return color(d.data.value); }) // use color scale to define fill of each label in data
      .each(function(d) { this._current - d; }); // creates a smooth animation for each track

    // mouse event handlers are attached to path so they need to come after its definition
    path.on('mouseover', function(d) {  // when mouse enters div      
      // tooltip.style('display', 'show')
      var total = d3.sum(pieData.map(function(d) { // calculate the total number of tickets in the data         
        return d.count;
        // return (d.enabled) ? d.count : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase                                      
      }));               
      d = d.path[0].__data__;                                       
      // console.log('d in mouseover:', d);
      var percent = Math.round(1000 * d.data.count / total) / 10; // calculate percent
      tooltip.select('.label').html(d.data.value); // set current label           
      // tooltip.select('.count').html('$' + d.data.count); // set current count            
      tooltip.select('.percent').html(percent + '%'); // set percent calculated above          
      tooltip.style('display', 'block');
      // Variable box length based on longest word in term
      const box_width = Math.max(...(d.data.value.split(' ').map(word => word.length)))
      tooltip.style('width', box_width*9 + 40 + 'px')
    });                                                           

    path.on('mouseout', function() { // when mouse leaves div                        
      tooltip.style('display', 'none'); // hide tooltip for that element
      // console.log('hid the element');
    });

    path.on('mousemove', function(d) { // when mouse moves  
      // console.log('d on mousemove:', d);               
      tooltip.style('top', (d.layerY + 10) + 'px') // always 10px below the cursor
        .style('left', (d.layerX + 10) + 'px'); // always 10px to the right of the mouse
    });

    document.addEventListener('chartUpdate', function(event) {
      // if (!event.detail) return;
      let newData;
      for (let chart of data) {
        if (chart.id == props.id) {
          newData = chart.data;
          break;
        }
      }
      if (!newData) return;
      console.log('[PieChart event] Updating with data:', newData);
      // const newData = event.detail;
      path = path.data(pie(newData)); // update pie with new data
      // console.log('path after update:', path, data);

      path.transition() // transition of redrawn pie
        .duration(750) // 
        .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
          var interpolate = d3.interpolate(this._current, d); // this = current path element
          this._current = interpolate(0); // interpolate between current value and the new value of 'd'
          return function(t) {
            return arc(interpolate(t));
          };
        });
    });

  }

  drawChart();

  // console.log('drawn:', props.chartDrawn);
  // if (data.length != 0) {
    // console.log('data:', data);
    // for (let chart of data) {
    //   if (chart.id == currID) {
        // console.log('drawing a chart of id:', chart.id);
        // console.log('data:', data);
        // drawChart2(chart.data)
        // break;
      // }
        // console.log('chart:', chart);
      // console.log('chart id:', chart.id);
      // console.log('currID:', currID);
    // }
    // data[0].id
    // drawChart2();
  // }

  return (
    <div></div>
  )
}
