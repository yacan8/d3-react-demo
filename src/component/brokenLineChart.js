import React, { Component } from 'react';
import * as d3 from 'd3';
import { getBgColors } from './tool';
var data1 = function () {
  var data = [];
  for (var i = 1; i <= 24; i++) {
    data.push({
      value: Math.ceil(200 * Math.random()),
      key: `k${i}`
    })
  }
  return data;
}();

class BrokenLineChart extends Component {
  static defaultProps = {
    width: 600,
    height: 300,
    padding: 0,
    data: data1
  };

  translate = 0;
  scale = 1;

  componentWillMount() {
    const color = getBgColors()[0];
    const { width = 600, height = 300, padding = 0, data } = this.props;
    const keys = data.map(v => v.key);
    const values = data.map(v => v.value);
    const xScale = d3.scaleBand().padding(0).domain(keys).range([padding, width - padding]);

    const yScale = d3.scaleLinear().domain([0, Math.max(...values)]).range([height - padding, padding]);
    this.xScale = xScale;
    this.yScale = yScale;
    this.color = color;
    this.setRenderData();
  }

  setRenderData = () => {
    const { xScale, yScale } = this;
    this.setXAxisData(xScale)
    this.setGridLineAxisData(xScale);
    this.setPathD(xScale, yScale);
  }

  setXAxisData = xScale => {
    const { data } = this.props;
    const xAxisData = data.map((item, i) => {
      return {
        translateX: xScale(item.key),
        label: item.key
      }
    })
    this.xAxisData = xAxisData
  }

  setGridLineAxisData = xScale => {
    const { data } = this.props;
    const keys = data.map(v => v.key);
    const gridLineAxisData = data.map((item, i) => {
      return {
        translateX: xScale(keys[i]),
        label: item.key
      }
    })
    this.gridLineAxisData = gridLineAxisData;
  }

  setPathD = (xScale, yScale) => {
    const values = this.props.data.map(v => v.value);
    const keys = this.props.data.map(v => v.key);
    const line = d3.line().x((d, i) => xScale(keys[i])).y((d, i) => yScale(values[i])).curve(d3.curveCatmullRom.alpha(0.4));;
    const pathD = line(values);
    this.pathD = pathD;
  }
  


  componentWillUpdate() {
    const { width, padding } = this.props;
    const { xScale, scale, translateX } = this;
    xScale.range([padding + translateX, width - padding + (scale - 1) * width + translateX]);
    this.setRenderData();
  }

  componentDidMount = () => {
    const zoom = d3.zoom()
      .on('zoom', () => {
        const { width, padding } = this.props;
        const transform = d3.event.transform;
        let translateX = transform.x, scale = transform.k;
        const minX = padding;
        const leftX = padding + translateX;
        if (leftX > minX) {
          translateX = minX - leftX;
          zoom.transform(d3.select(this.svg), d3.zoomIdentity.translate(translateX, 0).scale(scale))
        } 
        else if (translateX + scale * width < width) {
          translateX = -(scale - 1) * width;
          zoom.transform(d3.select(this.svg), d3.zoomIdentity.translate(translateX, 0).scale(scale))
        }
        this.translateX = translateX;
        this.scale = scale;
        this.forceUpdate();
      }).scaleExtent([1, 10])
    d3.select(this.svg).call(zoom);
  }

  saveRef = s => this.svg = s

  render() {
    const { width, height, padding, data } = this.props;
    const { pathD, xScale, yScale, xAxisData, gridLineAxisData, color } = this;
    const values = data.map(v => v.value);
    const keys = data.map(v => v.key);

    return <svg ref={this.saveRef} xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height} style={{ padding: 20 }}>
      <g fill="none" fontSize="10" textAnchor="middle" fontFamily="sans-serif" transform={`translate(0, ${height - 2 * padding})`}>
        <path stroke="#000" d={`M0,-6V0.5H${width - 2 * padding}`} style={{ stroke: '#999' }}></path>
        {
          gridLineAxisData.map((item, i) => {
            return <g key={i} opacity="1" transform={`translate(${item.translateX}, 0)`}>
              <line stroke="#000" y2={`-${height}`} style={{ stroke: '#999' }}></line>
            </g>
          })
        }
      </g>
      <g fill="none" fontSize="10" textAnchor="middle" fontFamily="sans-serif" transform={`translate(0, ${height - 2 * padding})`}>
        {
          xAxisData.map((item, i) => {
            return <g key={i} opacity="1" transform={`translate(${item.translateX}, 0)`}>
              <text fill="#000" dy="0em" y="-9" transform="translate(0, 25)">{item.label}</text>
            </g>
          })
        }
      </g>

      <path d={pathD} style={{ fill: 'none', strokeWidth: 1, stroke: color }}></path>
      {
        values.map((item, i) => {
          return <circle key={i} cx={xScale(keys[i])} cy={yScale(item)} r="5" style={{ strokeWidth: 0, fill: color }}></circle>
        })
      }
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0 }}></stop>
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 1 }}></stop>
        </linearGradient>
      </defs>
    </svg>;
  }
}

export default BrokenLineChart;
