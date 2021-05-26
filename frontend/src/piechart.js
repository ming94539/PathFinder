import React, {Component} from 'react';
import SharedContext from './SharedContext';
import * as d3 from 'd3';
/**
 * @return {object} JSX
 */

export default function PieChart() {
  const {data, setData} =
  React.useContext(SharedContext);

  const drawChart = () => {
    console.log('drawing chart with data:', data);

    var keys = [];
    var counts = [];
    
    /*
      Up to the first 10 entries of data
     */
    let data_len = Object.keys(data).length;
    let cnt = data_len < 10 ? data_len : 10;

    for (let i=0; i < cnt; ++i) {
      keys.push(data[i].value);
      counts.push(data[i].count);
    }


    // const DATA_LIMIT = 10;
    // let data_len = Object.keys(data).length;
    // if (data_len == 0) return;
    // let trunc_data = data;

    // if (data_len > DATA_LIMIT) {
    //   for (let i=0; i < DATA_LIMIT; ++i) {
    //     trunc_data.push(data[i]);
    //   }
    // }


		var svg = d3.select("svg"),
			width = svg.attr("width"),
			height = svg.attr("height"),
      margin = 5,
			radius = Math.min(width, height) / 2 - margin,
			g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal()
      .domain(counts)
      .range(d3.schemeSet3);

		// Generate the pie
		var pie = d3.pie();

		// Generate the arcs
		var arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

		//Generate groups
		var arcs = g.selectAll("arc")
					.data(pie(counts))
					.enter()
					.append("g")
					.attr("class", "arc")

		//Draw arc paths
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc)
      .attr("stroke", "black")
      .attr("stroke-width", "2px");

    arcs.append("text")
      .text(function(d) {
        return keys[d.index];
        // return keys[keys.length-d.index-1];
      })
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .style("text-anchor", "middle")
      .style("font-size", 17)

    // var path = arcs.selectAll('path')
    //   .data(pie(trunc_data))
    //   .enter()
    //   .append('path')
    //   .attr('d', arc)
    //   .attr('fill')

      // arcs.transition() // transition of redrawn pie
      //   .duration(750) // 
      //   .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
      //     var interpolate = d3.interpolate(this._current, d); // this = current path element
      //     this._current = interpolate(0); // interpolate between current value and the new value of 'd'
      //     return function(t) {
      //       return arc(interpolate(t));
      //     };
      //   });

  };

  if (Object.keys(data).length != 0) {
    drawChart();
  }

  return (
    <div></div>
  )
}
