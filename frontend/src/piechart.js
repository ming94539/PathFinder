import React, {useEffect} from 'react';
import SharedContext from './SharedContext';
import './style.css';
import * as d3 from 'd3';

export default function piechart(id, data) {
  let svg = d3.select('svg');
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
    let currColor = 1;
    // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
    const pieID = `#pie${id}`;
    console.log('[drawChart] Drawing chart at pie:', `${pieID}`);

    let dataEntry = data.find(e => e.id == id);
    if (!dataEntry) {
      console.log('[drawChart] Data entry not found at id:', id);
      return;
    }
    let pieData = dataEntry.data;
    console.log('[drawChart] Drawing chart with data:', pieData);

    pieData = pieData.slice(0, 20);
    
    svg = d3.select(pieID) // select element in the DOM with id 'chart'
      .append('svg') // append an svg element to the element we've selected
      .attr('width', width) // set the width of the svg element we just added
      .attr('height', height) // set the height of the svg element we just added
      .append('g') // append 'g' element to the svg element
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')') // our reference is now to the 'g' element. centerting the 'g' element to the svg element
      .attr('stroke', 'black')
      .style("stroke-width", "1px")
      .style('stroke-opacity', 0.5)

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
      let total = path.data().map(e => parseInt(e.data.count)).reduce((acc, cur) => acc+cur);

      d = d.path[0].__data__;                                       
      
      var percent = Math.round(1000 * d.data.count / total) / 10; // calculate percent
      // console.log('pieData:', pieData);
      tooltip.select('.label').html(d.data.value); // set current label           
      // tooltip.select('.count').html('$' + d.data.count); // set current count            
      tooltip.select('.percent').html(percent + '%'); // set percent calculated above          
      tooltip.style('display', 'block');
      // Variable box length
      const box_width = d.data.value.split(' ').map(word => word.length).reduce((acc, curr) => acc+curr);
      tooltip.style('width', box_width*8 + 50 + 'px')
    });                                                           

    path.on('mouseout', function() { // when mouse leaves div                        
      tooltip.style('display', 'none'); // hide tooltip for that element
    });

    path.on('mousemove', function(d) { // when mouse moves  
      // console.log('d on mousemove:', d);               
      tooltip.style('top', (d.offsetY + 100) + 'px')
            .style('left', (d.offsetX + 200) + 'px');
    });

    document.addEventListener(`chartUpdate`, function(event) {
      console.log('[chartUpdate] data:', event.detail);
      let newData;
      for (let chart of event.detail) {
        if (chart.id == id) {
          newData = chart.data;
          break;
        }
      }
      if (!newData) return;
      newData = newData.slice(0, 20);
      while (newData.length < 20) {
        newData.push({value: '', count: 0});
      }
      console.log('newData:', newData);

      // console.log('color before:', color);
      if (currColor > 0) {
        console.log('setting to scheme2');
        color = d3.scaleOrdinal(d3.schemeSet2);
      } else {
        console.log('setting to scheme3');
        color = d3.scaleOrdinal(d3.schemeSet3);
      }
      currColor *= -1;
      // console.log('color after:', color);
      path = path.data(pie(newData)); // update pie with new data

      // path.attr('d', null)

      path.transition() // transition of redrawn pie
        .duration(500) // 
        .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
          // var interpolate = d3.interpolate(this._current, d); // this = current path element
          // console.log('d:', d);
          // let curr = this._current;
          if (this.current) {
            this.current.startAngle = 0;
            this.current.endAngle = 0;
          }
          
          // console.log('this:', this.current);
          var interpolate = d3.interpolate(this.current, d); // this = current path element
          this.current = interpolate(0) ;
          // let _this = this;
          return function(t) {
            return arc(interpolate(t));
            // _this._current = interpolate(t)
            // return arc(_this._current);
          };
        });

      // d3.selectAll("path").style("fill", function(d){
      //   return color(d.data.value);
      // })
    });
}
