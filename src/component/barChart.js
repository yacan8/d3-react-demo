import React from 'react';
import * as d3 from 'd3';
const BarChart = (props) => {
  var data1 = function a() {
    var data = [];
    for(var i=0; i<=5; i++){
      data.push({
        x: '坐标'+ i,
        y: Math.ceil(200*Math.random())
      })
    }
    return data;
  }();
  const { width = 600, height = 300, padding = 0, color = '#2dd2cc',xAxisPadding = 0.5, data = data1 } = props;
  const keys = data.map(v => v.x);
  const values = data.map(v => v.y);
  const length = values.length;
  const xScale = d3.scaleBand().padding(xAxisPadding).domain(keys).range([padding, width - 2 * padding]);
  const yScale = d3.scaleLinear().domain([0, Math.max(...values)]).rangeRound([height - 2 * padding, padding]);

  const bandwidth = xScale.bandwidth()
  const xAxisData = data.map((item ,i) => {
    return {
      translateX : xScale(item.x) + bandwidth/2,
      label: item.x
    }
  })
  const yBar = data.map((item ,i) => {
    const y = yScale(item.y)
    return {
      x : xScale(item.x),
      y,
      height: height - y
    }
  })

  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height} style={{padding: 20}}>
    <g id="xAxis" fill="none" fontSize="10" textAnchor="middle" fontFamily="sans-serif" transform={`translate(0, ${height - 2 *padding})`}>
      <path stroke="#000" d={`M0.5,6V0.5H${width}.5V6`} style={{stroke: 'rgb(153, 153, 153)'}}></path>
      {
        xAxisData.map((item, i) => {
          return <g key={i} opacity="1" transform={`translate(${item.translateX}, 0)`}>
            <line stroke="#000" y2="6" style={{stroke: 'rgb(153, 153, 153)'}} />
            <text fill="#000" dy="0.71em" y="9" >{item.label}</text>
          </g>
        })
      }
    </g>
    <g fill="none" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
      <path stroke="#999" d={`M-6,${height}.5H0.5V0.5H-6`} />
    </g>
    {
      yBar.map((item, i) => {
        return <rect key={i} x={item.x}
                      y={item.y}
                      width={bandwidth}
                      height={item.height}
                      style={{fill: 'rgb(255, 255, 255)', stroke: 'rgb(153, 153, 153)', strokeWidth: 1}} />
      })
    }
  </svg>);
}
export default BarChart;
