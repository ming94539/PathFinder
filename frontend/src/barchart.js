import React, {Component} from 'react';
import * as d3 from 'd3';
/**
 * @return {object} JSX
 */
class BarChart extends Component {
  /**
 *
 */
  componentDidMount() {
    this.drawChart();
  }
  /**
     *
     */
  drawChart() {
    /**
     *
     */
    const data = [120, 50, 60, 60, 90, 100];
    const svg = d3.select('body').append('svg').attr('width', 700)
        .attr('height', 300);
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 70)
        .attr('y', 0)
        .attr('width', 25)
        .attr('height', (d, i) => d)
        .attr('fill', 'green');
  }
  /**
 * @return { object } JSX
 */
  render() {
    return <div></div>;
  }
}
export default BarChart;
