import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';


const getChartData = (width, height, radius, data, index, calculationKey = 'calculation', labelKey = 'label' ) => {
  data = _.sortBy(data, v => v[calculationKey]);
  const pie = d3.pie().sort(null).value(d => d.population);
  const path = d3.arc().outerRadius(radius - 10).innerRadius(0);
  const label = d3.arc().outerRadius(radius/ 2).innerRadius(radius/ 2);
  let endAngle = 0;
  const pieData = pie(data);
  const dataArc = [];
  pieData.forEach(item => {
    if (item.data[calculationKey]) {
      endAngle = item.endAngle;
    }
    dataArc.push({
      pathD: path(item),
      labelTranslate: label.centroid(item),
      label: item.data[labelKey],
      calculation: item.data[calculationKey]
    })
  })

  const x = index * width + width/2 + Math.round(Math.sin(endAngle) * (radius-10) );
  const y = width/2 - Math.round(Math.cos(endAngle) * (radius-10) );
  return { dataArc, calculationEndXY: { x, y } };
}

const PieChart = (props) => {
  var data1 = [{"label":"有风险","population":"135", calculation: true},{"label":"无风险","population":"75"}]
  let { width = 300, height = 300, data = data1, index = 0, calculationKey = 'calculation', labelKey = 'label' } = props;
  const radius = Math.min(width, height)/3;
  const { dataArc, calculationEndXY } = getChartData(width, height, radius, data, index, calculationKey, labelKey)
  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height}>
    <g transform={`translate(${width * index + width/2},${height/2})`}>
      {
        dataArc.map((item, i) => {
          return <g key={i}>
            <path d={item.pathD} style={{fill: 'rgb(255, 255, 255)', strokeWidth: 1, stroke: 'rgb(153, 153, 153)'}} />
            <text transform={`translate(${item.labelTranslate})`} stroke="#999" fill="#999">{item.label}</text>
          </g>
        })
      }
    </g>
  </svg>);
}

export const TwoPieChart = (props) => {
  var _data1 = [{"label":"有风险","population":"135", calculation: true},{"label":"无风险","population":"75"}]
  var _data2 = [{"label":"己方","population":"40", calculation: true},{"label":"非己方","population":"25"}]
  let { width = 300, height = 300, data1 = _data1, data2 = _data2, calculationKey = 'calculation', labelKey = 'label' } = props;
  const radius = Math.min(width, height)/3;
  const data1Arc = getChartData(width, height, radius, data1, 0, calculationKey, labelKey);
  const data2Arc = getChartData(width, height, radius, data2, 1, calculationKey, labelKey);
  const line = d3.line().x(d => d.x).y(d => d.y);
  const endPathD = line([data1Arc.calculationEndXY, data2Arc.calculationEndXY]);
  const startPathD = line([{x: width/2, y: height / 2 - radius + 10 }, {x:  width/2 * 3, y: height / 2 - radius + 10}]);
  return (<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={2 * width} height={height}>
    <g transform={`translate(${ width/2},${height/2})`}>
      {
        data1Arc.dataArc.map((item, i) => {
          return <g key={i}>
            <path d={item.pathD} style={{fill: item.calculation ? '#fff3f3' :'rgb(255, 255, 255)', strokeWidth: 1, stroke: 'rgb(153, 153, 153)'}} />
            <text transform={`translate(${item.labelTranslate})`} stroke="#999" fill="#999">{item.label}</text>
          </g>
        })
      }
    </g>
    <g transform={`translate(${width + width/2},${height/2})`}>
      {
        data2Arc.dataArc.map((item, i) => {
          return <g key={i}>
            <path d={item.pathD} style={{fill: item.calculation ? '#fff3f3' :'rgb(255, 255, 255)', strokeWidth: 1, stroke: 'rgb(153, 153, 153)'}} />
            <text transform={`translate(${item.labelTranslate})`} stroke="#999" fill="#999">{item.label}</text>
          </g>
        })
      }
    </g>
    <path strokeDasharray="6,2,3" d={endPathD} style={{strokeWidth: 1, stroke: 'rgb(153, 153, 153)'}}></path>
    <path strokeDasharray="6,2,3" d={startPathD} style={{strokeWidth: 1, stroke: 'rgb(153, 153, 153)'}}></path>
  </svg>);
}

export default PieChart;
