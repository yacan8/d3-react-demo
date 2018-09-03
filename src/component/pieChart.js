import React from 'react';
import * as d3 from 'd3';
import { getBgColors } from './tool';


const getChartData = (radius, data, labelKey = 'label') => {
  const pie = d3.pie().sort(null).value(d => d.population);
  const path = d3.arc().outerRadius(radius - 10).innerRadius(0);
  const label = d3.arc().outerRadius(radius/ 2).innerRadius(radius/ 2);
  const outerArc = d3.arc().outerRadius(radius + 20).innerRadius(0);
  let endAngle = 0;
  const pieData = pie(data);
  const dataArc = [];
  function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}
  pieData.forEach(item => {
    dataArc.push({
      pathD: path(item),
      labelTranslate: [radius * (midAngle(item) < Math.PI ? 1 : -1), outerArc.centroid(item)[1]],
      // labelTranslate:  label.centroid(item),
      textAnchor: midAngle(item) < Math.PI ? "start":"end",
      label: item.data[labelKey],
      pos: [label.centroid(item), outerArc.centroid(item), radius * 0.95 * (midAngle(item) < Math.PI ? 1 : -1), outerArc.centroid(item)[1]]
    })
  })
  return dataArc;
}

const PieChart = (props) => {
  var data1 = [
    {"label":"","population":"53"},
    {"label":"dsgfd","population":"31"},
  ]
  let { width = 265, height = 176.6666666, data = data1, labelKey = 'label'} = props;
  const bgColor = getBgColors();
  const radius = Math.min(width * 2 / 3, height)/2;
  const dataArc = getChartData(radius, data, labelKey)
  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height}>
      <g fontSize="12" transform={`translate(${width/3}, ${height/2})`}>
        {
          dataArc.map((item, i) => {
            return <g key={i}>
              <path d={item.pathD} style={{fill: bgColor[i] , strokeWidth: width/35, stroke: '#fff' }} />
              {/* <text transform={`translate(${item.labelTranslate})`} stroke="#999" fill="#999">{item.label}</text> */}
              {/* <text dy={item.textAnchor=='start'?'.35em': '.35em'} textAnchor={item.textAnchor} transform={`translate(${item.labelTranslate})`}  fill="#333">{item.label}</text> */}
            </g>
          })
        }
        {/* {
          dataArc.map((item, i) => {
            return <g key={i}>
              <polyline fill="none" stroke="#333" points={item.pos.join(',')}></polyline>
            </g>
          })
        } */}
      </g>
      <g fontSize="12" transform={`translate(${width * 2/3}, ${(height - (dataArc.length+1) * 30) / 2})`}>
        {
          dataArc.map((item, i) => {
            return <g key={i}>
              <rect x="0" y={(i+1) * 25} width="10" height="10" fill={bgColor[i]}></rect>
              <text fill="#333" transform={`translate(15, ${(i+1) * 25 + 10})`}>{item.label}</text>
            </g>
          })
        }
      </g>
    </svg>);
}

export default PieChart;
