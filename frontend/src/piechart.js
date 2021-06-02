import './style.css';
import * as d3 from 'd3';

/**
 * Returns more readable version of a data label
 * @param   {String}  value Data label to process
 * @return  {String}  Processed data label
 */
function processLabel(value) {
  if (value.length == 0) return '';
  if (value.length == 1) {
    switch(value) {
      case 'b':
        return 'Bachelor';
      case 'm':
        return 'Master'
      case 'a':
        return 'Associate';
      case 'p':
        return 'PhD';
      default:
        return value.toUpperCase();
    }
  } else {
    const capital = ['CSS', 'SCSS', 'HTML', 'PHP', 'API', 'AWS', 'UI'];
    value = value.replace(/sql/g, 'SQL');
    let matchCapital = capital.find(e => e.toLowerCase()==value);
    if (matchCapital) {
      return matchCapital;
    } else {
      return value.split(' ').map(w => w[0].toUpperCase()+w.substring(1)).join(' ');
    }
  }
}

/**
 * Draws a Pie Chart with the given id and data
 * Reference: https://codepen.io/thecraftycoderpdx/pen/jZyzKo
 * @param {int} id  ID of card to draw chart in
 * @param {Array.<{value: String, count: String}} data  Data for chart to represent
 */
export default function piechart(id, data) {
  let svg = d3.select('svg');
  let width=350;
  let height=350;
  let margin = 10;

    // Radius of the chart
    var radius = Math.min(width, height) / 2 - margin;

    // Color scale
    // More color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
    var color = d3.scaleOrdinal(d3.schemeSet3);

    // Get data at id
    let dataEntry = data.find(e => e.id == id);
    if (!dataEntry) {
      console.error('[drawChart] Data entry not found at id:', id);
      return;
    }
    let pieData = dataEntry.data;

    // Only display top 20 entries
    pieData = pieData.slice(0, 20);
    
    const pieID = `#pie${id}`;

    // Define chart attributes
    svg = d3.select(pieID) 
      .append('svg') 
      .attr('width', width) 
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')') // our reference is now to the 'g' element. centerting the 'g' element to the svg element
      .attr('stroke', 'black')
      .style("stroke-width", "0.5px")
      

    // Set arc sizes
    var arc = d3.arc()
      .innerRadius(0) 
      .outerRadius(radius);

    // Define the way the chart will display its data
    var pie = d3.pie()
      .value(function(d) { 
        return d.count; 
      }) 
      .sort(null);
    
    // Define tooltip
    var tooltip = d3.select(pieID) 
      .append('div')                                    
      .attr('class', 'tooltip'); 

    tooltip.append('div')                            
      .attr('class', 'label');                        

    tooltip.append('div')                   
      .attr('class', 'count');                

    tooltip.append('div') 
      .attr('class', 'percent'); 

    // Creating the chart
    var path = svg.selectAll('path') 
      .data(pie(pieData)) 
      .enter() 
      .append('path') 
      .attr('d', arc) 
      .attr('fill', function(d) { return color(d.data.value); }) 
      .each(function(d) { this._current - d; });

    // Display tooltip when mouse enters path (a pie slice)
    path.on('mouseover', function(d) { 
      // Count total data entries for this dataset
      let total = path.data().map(e => parseInt(e.data.count)).reduce((acc, cur) => acc+cur);
      d = d.path[0].__data__;                                       
      
      var percent = Math.round(1000 * d.data.count / total) / 10; 
      let label = processLabel(d.data.value);

      if (label.length > 0) {
        tooltip.select('.label').html(label); 
        tooltip.select('.percent').html(percent + '%'); 
        tooltip.style('display', 'block');
        // Calculate variable box length
        const box_width = label.split(' ').map(word => word.length).reduce((acc, curr) => acc+curr);
        tooltip.style('width', box_width*8 + 50 + 'px')
      }
    });                                                           

    // Hide tooltip when mouse leaves path
    path.on('mouseout', function() {
      tooltip.style('display', 'none');
    });

    // Tooltip tracks mouse's movement
    path.on('mousemove', function(d) {
      tooltip.style('top', (d.offsetY + 100) + 'px')
            .style('left', (d.offsetX + 200) + 'px');
    });

    // Update chart when data is updated
    document.addEventListener(`chartUpdate`, function(event) {
      // Get new data, then set to fixed length of 20
      let dataEntry = event.detail.find(e => e.id==id);
      if (!dataEntry) return;
      let newData = dataEntry.data;
      newData = newData.slice(0, 20);
      while (newData.length < 20) {
        newData.push({value: '', count: 0});
      }

      path = path.data(pie(newData));

      // Animate transition to new data
      path.transition() 
        .duration(500)
        .attrTween('d', function(d) { 
          // Slices fan out from the top
          if (this.current) {
            this.current.startAngle = 0;
            this.current.endAngle = 0;
          }
          
          var interpolate = d3.interpolate(this.current, d); 
          this.current = interpolate(0) ;
          return function(t) {
            return arc(interpolate(t));
          };
        });
    });
}
