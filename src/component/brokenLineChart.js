import React from 'react';
import * as d3 from 'd3';

const BrokenLineChart = (props) => {
  var data1 = function() {
    var data = [];
    for(var i=0; i<=23; i++){
      data.push({
        value: Math.ceil(200*Math.random()),
        key: i
      })
    }
    return data;
  }();

  const { width = 600, height = 300, padding = 0, color = '#2dd2cc', data = data1 } = props;
  const keys = data.map(v => v.key);
  const values = data.map(v => v.value);
  const length = values.length;
  const svg= d3.select('#brokenLineGraph').attr("width", width).attr("height", height)
  const xScale = d3.scaleLinear().domain([0, length-1]).range([padding, width - 2 * padding]);//这个range相当于横轴的左右平移
  const yScale = d3.scaleLinear().domain([0, Math.max(...values)]).range([height - 2 * padding, padding]);
  const xAxisData = data.map((item ,i) => {
    return {
      translateX : xScale(i),
      label: item.key
    }
  })
  const gridScale = d3.scaleLinear().domain([0, length-1]).range([width - 2 * padding, padding])
  const gridLineAxisData = data.map((item ,i) => {
    return {
      translateX : gridScale(i),
      label: item.key
    }
  })
  const line = d3.line().x((d, i) =>  xScale(i)).y(d => yScale(d)).curve(d3.curveCatmullRom.alpha(0.5));;
  const pathD = line(values);
  const transformXArr = xAxisData.map(v => v.translateX)
  const max = Math.max(...values);
  let maxIndex = 0;
  values.forEach((v, i) => {
    if (max === v) maxIndex = i
  })
  let left = transformXArr[(maxIndex-1<0?0:maxIndex-1)];
  const middle = transformXArr[maxIndex];
  const right = transformXArr[(maxIndex+1>length-1?length-1:maxIndex+1)];
  const cs = (maxIndex-1==0 ) ? 2 : 1;
  const _width = (right - left) / cs;
  if (maxIndex-1 === 0) {
    left = 0;
  }
  const _height = height;
  return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height} style={{padding: 20}}>
    <rect width={_width} height={height} fill="url(#grad1)" transform={`translate(${left}, 0)`}></rect>
    <g fill="none" fontSize="10" textAnchor="middle" fontFamily="sans-serif" transform={`translate(0, ${height - 2 *padding})`}>
      <path stroke="#000" d={`M0,-6V0.5H${width}`} style={{stroke: 'rgb(153, 153, 153)'}}></path>
      {
        gridLineAxisData.map((item, i) => {
          return <g key={i} opacity="1" transform={`translate(${item.translateX}, 0)`}>
            <line stroke="#000" y2={`-${height}`} style={{stroke: 'rgb(153, 153, 153)'}}></line>
          </g>
        })
      }
    </g>
    <g fill="none" fontSize="10" textAnchor="middle" fontFamily="sans-serif" transform={`translate(0, ${height - 2 *padding})`}>
      {
        xAxisData.map((item, i) => {
          return <g key={i} opacity="1" transform={`translate(${item.translateX}, 0)`}>
            <text fill="#000" dy="0em" y="-9" transform="translate(0, 25)">{item.label}</text>
          </g>
        })
      }
    </g>

    <path d={pathD} style={{fill: 'none', strokeWidth: 2, stroke: 'rgb(45, 210, 204)'}}></path>
    {
      values.map((item, i) => {
        return <circle key={i} cx={xScale(i)} cy={yScale(item)} r="3.0" style={{stroke: 'rgb(45, 210, 204)', fill: '#fff'}}></circle>
      })
    }
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0}}></stop>
        <stop offset="100%" style={{stopColor:'#2dd2cc',stopOpacity:1}}></stop>
      </linearGradient>
    </defs>
  </svg>;
}
export default BrokenLineChart;
