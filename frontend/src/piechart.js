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
    var keys = Object.keys(data).slice(0, 10);
    var counts = Object.values(data).slice(0, 10);

    if (keys.length == 0) return;

		var svg = d3.select("svg"),
			width = svg.attr("width"),
			height = svg.attr("height"),
			radius = Math.min(width, height) / 2,
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
        return keys[keys.length-d.index-1];
        // return 'text';
      })
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .style("text-anchor", "middle")
      .style("font-size", 17);

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

// export class PieChart extends Component {
//   constructor(props) {
//     super(props);
//     // console.log('pie?');
//     // console.log(props.data);
//     // console.log(this.props.data);
//     // this.state.data = props.data;
//     console.log("in constructor");
//     console.log(props.data.length == null);
//     // this.state.week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
//     //   'Friday', 'Saturday'];
//   }
//   /**
//  *
//  */
//   componentDidMount() {
//     // if (Object.keys(this.state.data).length) {
//     //   console.log('data:', this.state.data);
//       // this.drawChart();
//     // }
//     if(this.props.data.length != 0){
//       this.drawChart2();
//     }
    
//     console.log("in did mount");
//   }

//   componentDidUpdate(prevProps) {
//     this.drawChart2();
//     // if (prevProps.data != this.props.data) {
//     //   this.drawChart();
//     // }
//     // console.log(prevProps);
//     // if (this.props.data.length !=null){
//     //   this.drawChart2();
//     // }
//     console.log("in did update");
//   }

//   drawChart2() {
//     console.log('drawing chart with data:', dataset);
//     // var dataset = {a: 2, b: 4, c: 8, d: 10};
//     var dataset = this.props.data;
//     var keys = Object.keys(dataset);
//     var counts = Object.values(dataset);

//     if (keys.length == 0) return;

// 		var svg = d3.select("svg"),
// 			width = svg.attr("width"),
// 			height = svg.attr("height"),
// 			radius = Math.min(width, height) / 2,
// 			g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//     var color = d3.scaleOrdinal()
//       .domain(counts)
//       .range(d3.schemeSet3);

// 		// Generate the pie
// 		var pie = d3.pie();

// 		// Generate the arcs
// 		var arc = d3.arc()
//       .innerRadius(0)
//       .outerRadius(radius);

// 		//Generate groups
// 		var arcs = g.selectAll("arc")
// 					.data(pie(counts))
// 					.enter()
// 					.append("g")
// 					.attr("class", "arc")

// 		//Draw arc paths
// 		arcs.append("path")
// 			.attr("fill", function(d, i) {
// 				return color(i);
// 			})
// 			.attr("d", arc)
//       .attr("stroke", "black")
//       .attr("stroke-width", "2px");

//     arcs.append("text")
//       .text(function(d) {
//         return keys[keys.length-d.index-1];
//         // return 'text';
//       })
//       .attr("transform", function(d) {
//         return "translate(" + arc.centroid(d) + ")";
//       })
//       .style("text-anchor", "middle")
//       .style("font-size", 17);

//     // svg
//     //   .selectAll("arc")
//     //   .data(data)
//     //   .enter()
//     //   .append("text")
//     //   .text(function(d) {return ('bottom text')})
//     //   .attr("transform", function(d)
//     //     // {return "translate(" + arc.centroid(d) + ")";})
//     //     {return "translate(" + '5' + ")";})
//     //   .style("text-anchor", "middle")
//     //   .style("font-size", 20)
//   }
  
//   /**
//      *
//      */
//   drawChart() {
//     /**
//      *
//      */
//     // const data = this.props.data;
//     // console.log('pie draw?');
//     // console.log(this.p);
//     // console.log(this.props.data);
//     const data = {a:120, b:50, c:60, d:60, e:90, f:100};
//     console.log('data:', data);
//     let width = 450;
//     let height = 450;
//     let margin = 40;
//     let radius = Math.min(width, height) / 2 - margin;
//     let svg = d3.select("#piechart")
//       .append("svg")
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform, translate(" + width / 2 + "," + height / 2 + ")");

//     let color = d3.scaleOrdinal()
//       .domain(data)
//       .range(d3.schemeSet2); 
      
//     // scheme options: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9 

//     let pie = d3.pie()
//       .value(function(d) {return d.value; })
//     let data_ready = pie(Object.entries(data)); // d3.entries before d3 version 6

//     let arcGenerator = d3.arc()
//       .innerRadius(0)
//       .outerRadius(radius);
    
//     svg
//       .selectAll("mySlices")
//       .data(data_ready)
//       .enter()
//       .append("path")
//         .attr("d", arcGenerator)
//         .attr("fill", function(d) {return (color(d.data.key))})
//         .attr("stroke", "black")
//         .attr("stroke-width", "2px")
//         .style("opacity", 0.8)

//     svg
//       .selectAll("mySlices")
//       .data(data_ready)
//       .enter()
//       .append("text")
//       .text(function(d) {return (d.data.key)})
//       .attr("transform", function(d)
//         {return "translate(" + arcGenerator.centroid(d) + ")";})
//       .style("text-anchor", "middle")
//       .style("font-size", 12)

//     // const data = [120, 50, 60, 60, 90, 100];
//     // const svg = d3.select('body').append('svg').attr('width', 700)
//     //     .attr('height', 300);
//     // svg.selectAll('rect')
//     //     .data(data)
//     //     .enter()
//     //     .append('rect')
//     //     .attr('x', (d, i) => i * 70)
//     //     .attr('y', 0)
//     //     .attr('width', 25)
//     //     .attr('height', (d, i) => d)
//     //     .attr('fill', 'green');
//   }



//   /**
//  * @return { object } JSX
//  */
//   render() {
//     return <div></div>;
//   }
// }
// export default PieChart;
