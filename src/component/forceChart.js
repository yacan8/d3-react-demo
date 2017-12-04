import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import { getNodeRadius, isCoreSelfNodes, getMinCircle } from './tool';

const attrList = {
  "attr1": "属性1",
  "attr2": "属性2",
  "attr3": "属性3",
  "attr4": "属性4",
  "attr5": "属性5",
  "attr6": "属性6",
  "attr7": "属性7",
  "attr8": "属性8",
  "attr9": "属性9",
  "attr10": "属性10",
  "attr11": "属性11",
  "attr12": "属性12",
  "attr13": "属性13",
};
const fill = index => {
  const colors = [
    '#83DCEC',
    '#A4BDAC',
    '#d4bbeb',
    '#6493A8',
    '#F5BD5F',
    // '#036776',
    '#A7D2C7',
    '#CBE474',
    '#DBDA63',
    '#AE9A93'
  ];
  return colors[index % colors.length];
};
export default class ForceChart extends React.Component {

  getDefs = () => {
    const { links, subGroups } = this.props;
    return <defs>
      {
        links.map((link, i) => {
          if (link.source.subGroupId !== link.target.subGroupId) {
            const sourceFill = fill(_.findIndex(subGroups, o => link.source.subGroupId == o.id));
            const targetFill = fill(_.findIndex(subGroups, o => link.target.subGroupId == o.id));
            return <linearGradient key={i} id={`${link.source.subGroupId}-${link.target.subGroupId}`} x1="0%" y1="0%" x2="1000%" y2="100%">
              <stop offset="0%" style={{stopColor: sourceFill, stopOpacity: 1}}></stop>
              <stop offset="100%" style={{stopColor: targetFill, stopOpacity: 1}}></stop>
            </linearGradient>
          } else {
            return ''
          }
        })
      }
    </defs>
  }

  oneSubGroupRender = () => {
    const { width, height, links, nodes, coreSelfNodes, subGroups, lineWidth } = this.props;
    return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height}>
      <g className="outg">
        <g className="links">
          {
            links.map((item, i) => {
              return <line key={i} stroke={((d) => {
                const weight = lineWidth(d.weight) || 1;
                let color = 'rgb(51,51,51)';
                switch(weight){
                  case 1: color = 'rgb(222,222,222)'; break;
                  case 2: color = 'rgb(102,102,102)'; break;
                  case 3: color = 'rgb(102,102,102)'; break;
                  default: break;
                }
                return color;
              })(item)} strokeOpacity={((d) => {
                const weight = lineWidth(d.weight) || 1;
                var opacity = 0.5;
                if(weight == 2){
                  opacity = 0.7;
                }
                return opacity;
              })(item)} strokeWidth={((d)=> {
                const weight = lineWidth(d.weight) || 1;
                if (weight == 1 || weight == 2){
                  return 1;
                } else {
                  return weight;
                }
              })(item)} x1={item.source.x} y1={item.source.y} x2={item.target.x} y2={item.target.y} />
            })
          }
        </g>
        <g className="nodes">
          {
            nodes.map((item, i) => {
              return <g key={i}
                transform={`translate(${item.x}, ${item.y})`}
                fill={item.isSelfNode ? '#ffd388' : '#b0e1fa'}
                >
                  <circle
                    r={getNodeRadius(coreSelfNodes)(item)}
                    stroke={item.isBlack ? '#dd1818' : '#999'}
                    strokeWidth={item.isBlack ? 2 : 0} />
                  <image
                    width={item.ir * 2 - 4}
                    height={item.ir * 2 - 4}
                    x={-item.ir + 2}
                    y={-item.ir + 2}
                    xlinkHref={((d)=> {
                      return require(`../images/${d.type}.svg`);
                    })(item)}/>
                </g>
            })
          }
        </g>
        <g className="texts">
          {
            nodes.map((item, i) => {
              if (item.isSelfNode && (item.isCoreNode || nodes.length <= 50 || isCoreSelfNodes(item, coreSelfNodes))) {
                return <g key={i} transform={`translate(${item.x}, ${item.y})`}>
                  <text style={{textAnchor: 'middle', fontSize: 12, fill: '#333'}} dy="3">
                    {item.name}
                  </text>
                </g>
              } else {
                return '';
              }
            })
          }
        </g>
      </g>
    </svg>
  }

  manySubGroupRender = () => {
    const { width, height, links, nodes, coreSelfNodes, subGroups } = this.props;
    const groups =  _.map(d3.nest().key(d => d.subGroupId).entries(nodes), group => {
      const maxDNode = _.maxBy(group.values, 'degree');
      const circle = getMinCircle(group);
      group.center = circle.center;
      group.radius = circle.radius + Math.min(maxDNode.degree, 30) + 2;
      return group;
    });

    return <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height}>
      <g className="outg">
        <g className="groups">
          {
            groups.map((d, i) => {
              return <circle
                key={i}
                cx={d.center[0]}
                cy={d.center[1]}
                r={d.radius}
                fillOpacity="0"
                stroke={fill(_.findIndex(subGroups, o => o.id == d.key))}
                strokeDasharray="4,4"
                strokeWidth="1"></circle>
            })
          }
        </g>
        <g>
          {
            groups.map((d, i) => {
              return <text
                key={i}
                style={{
                  textAnchor: 'middle',
                  fonsSize: 14,
                  fontWeight: '600'
                }}
                transform={`translate(${(d.center[0] - d.radius -18)}, ${d.center[1]})`}
                fill={fill(_.findIndex(subGroups, o => o.id == d.key))}
              >
                {d.key}
              </text>
            })
          }
        </g>
        <g className="links">
          {
            links.map((item, i) => {
              return <line
                key={i}
                stroke={(d => {
                  if (d.source.subGroupId == d.target.subGroupId) {
                    return fill(_.findIndex(subGroups, o => o.id == d.source.subGroupId));
                  } else {
                    return `url(#${d.source.subGroupId}-${d.target.subGroupId})`;
                  }
                })(item)}
                strokeWidth="1"
                strokeOpacity="0.5"
                x1={item.source.x}
                y1={item.source.y}
                x2={item.target.x}
                y2={item.target.y}
              />
            })
          }
        </g>
        <g className="nodes">
          {
            nodes.map((d, i) => {
              const radius = Math.min(d.degree, 30);
              const color = fill(_.findIndex(subGroups, o => o.id == d.subGroupId));
              return <g key={i} transform={`translate(${d.x}, ${d.y})`}>
                <circle
                  r={(radius < 15 ? radius : (radius - 4)) + (d.isBlack ? 2 : 0)}
                  fill={color}
                  fillOpacity={!d.isSelfNode ? 0.3: 1}
                  stroke={d.isBlack? '#dd1818':''}
                  strokeWidth={d.isBlack? 2: 1}
                  ></circle>
              </g>
            })
          }
        </g>

        <g className="texts">
          {
            nodes.map((d, i) => {
              if (d.isSelfNode&&(d.isCoreNode || nodes.length <= 50 || isCoreSelfNodes(d, coreSelfNodes))) {
                return <g key={i} className="text" transform={`translate(${d.x}, ${d.y})`}>
                  <text style={{ textAnchor: 'middle', fontSize: 12, fill: '#333'}} dy="3"> {d.name}</text>
                </g>
              } else if (!d.isSelfNode&&(d.isCoreNode || nodes.length <= 50)) {
                return <g key={i} className="text" transform={`translate(${d.x}, ${d.y})`}>
                  <text style={{ textAnchor: 'middle', fontSize: 12, fill: '#333'}} dy="3"> {attrList[d.type]}</text>
                </g>
              }
            })
          }
        </g>
        <defs>
          {this.getDefs()}
        </defs>
      </g>
    </svg>
  }
  render() {
    const { subGroups } = this.props;
    return (<div>
      {
        subGroups.length === 1 && this.oneSubGroupRender()
      }
      {
        subGroups.length !== 1 && this.manySubGroupRender()
      }
    </div>);
  }
}
