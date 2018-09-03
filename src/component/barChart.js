import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { getBgColors } from './tool';
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


export const BarChart2 = (props) => {
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
  const colors = getBgColors();
  let { width = 600, height = 300, padding = 0, xAxisPadding = 0.5, data = data1, xTitle = '横坐标', yTitle='纵坐标' } = props;
  let paddingTop = 20, paddingLeft = 80, paddingRight = 50, paddingBottom = 50;
  width = width - paddingLeft - paddingRight;
  height = height - paddingTop - paddingBottom;
  const keys = data.map(v => v.x);
  const values = data.map(v => v.y);
  const length = values.length;
  const xScale = d3.scaleBand().padding(xAxisPadding).domain(keys).range([padding, width - 2 * padding]);
  const yScale = d3.scaleLinear().domain([0, Math.max(...values)]).rangeRound([height - 2 * padding, padding]);
  const yAxisTicks = yScale.ticks(6);
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

  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height} style={{padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`}}>
    <g transform={`translate(-45, ${height/2}),rotate(-90)`}><text textAnchor="middle" fontSize="12">{xTitle}</text></g>
    <g transform={`translate(${width / 2}, ${height + 40})`}><text textAnchor="middle" fontSize="12">{yTitle}</text></g>
    {
      yAxisTicks.map((item, i) => {
        return <g key={i} fontSize="10" transform={`translate(0, ${yScale(item)})`} fontFamily="sans-serif">
          <text textAnchor="end" dy="-0.5em" y="9" x="-10">{item}</text>
          <line stroke="#999" x2={width} x1="0" strokeWidth="1"></line>
        </g>
      })
    }
    <g id="xAxis" fill="none" fontSize="10" textAnchor="middle" fontFamily="sans-serif" transform={`translate(0, ${height - 2 *padding})`}>
      <path stroke="#000" d={`M0.5,6V0.5H${Math.ceil(width)}.5V6`} style={{stroke: 'rgb(153, 153, 153)'}}></path>
      {
        xAxisData.map((item, i) => {
          return <g key={i} opacity="1" transform={`translate(${item.translateX}, 0)`}>
            <line stroke="#000" y2="6" style={{stroke: 'rgb(153, 153, 153)'}} />
            <text fill="#000" dy="0.71em" y="9">{item.label}</text>
          </g>
        })
      }
    </g>
    <g fill="none" fontSize="10" textAnchor="middle" fontFamily="sans-serif">
      <path stroke="#999" d={`M-6,${Math.ceil(height)}.5H0.5V0.5H-6`} />
    </g>
    {
      yBar.map((item, i) => {
        return <rect key={i} x={item.x}
                      y={item.y}
                      width={bandwidth}
                      height={item.height}
                      style={{fill: colors[i%colors.length], stroke: '', strokeWidth: 1}} />
      })
    }
  </svg>);
}


export const BarChart3 = (props) => {
  var data1 = function a() {
    var data = [];
    for(var i=0; i<=1; i++){
      data.push({
        x: '坐标'+ i,
        y: [Math.ceil(200*Math.random()), Math.ceil(200*Math.random()), Math.ceil(200*Math.random())]
      })
    }
    return data;
  }();
  const colors = ['#6388cb', '#5ea2f9', '#f2f3f5'];
  let { width = 500, height = 200, padding = 0, color = '#2dd2cc',xAxisPadding = 0.8, data = data1 } = props;
  let paddingTop = 20, paddingLeft = 20, paddingRight = 20, paddingBottom = 20;
  width = width - paddingLeft - paddingRight;
  height = height - paddingTop - paddingBottom;
  const keys = data.map(v => v.x);
  const values = data.map(v => _.sum(v.y));
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
  const yData = [];
  data.forEach((item ,i) => {
    let ySum = 0;
    let heightSum = 0;
    item.y.forEach((_item, j) => {
      ySum += _item
      const y = yScale(ySum);
      yData.push({
        x: xScale(item.x),
        y: y,
        height: height- yScale(_item),
        fill: colors[j]
      })
    })
  })

  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height} style={{padding: 20}}>
    <g id="xAxis" fill="none" fontSize="10" textAnchor="middle" fontFamily="sans-serif" transform={`translate(0, ${height - 2 *padding})`}>
      <path stroke="#000" d={`M0.5,6V0.5H${Math.ceil(width)}.5V6`} style={{stroke: 'rgb(153, 153, 153)'}}></path>
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
      <path stroke="#999" d={`M-6,${Math.ceil(height)}.5H0.5V0.5H-6`} />
    </g>

    <g fontSize="14" transform={`translate(${width - 100}, 40)`}>
      <g>
        <rect x="10" y={7} width="10" height="15" fill={colors[0]} strokeWidth="0"></rect>
        <text fill="#999" transform={`translate(25, 20)`}>风险名单</text>
      </g>
      <g>
        <rect x="10" y={37} width="10" height="15" fill={colors[1]} strokeWidth="0"></rect>
        <text fill="#999" transform={`translate(25, 50)`}>关注名单</text>
      </g>
    </g>
    {
      yData.map((item, i) => {
        return <rect key={i} x={item.x}
                      y={item.y}
                      fill={item.fill}
                      width={bandwidth}
                      height={item.height}
                      style={{ stroke: item.fill, strokeWidth: 1}} />
      })
    }
  </svg>);
}

export default BarChart;
