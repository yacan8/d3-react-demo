import React from 'react';
import { renderToString } from 'react-dom/server';
import BrokenLineChart from './component/brokenLineChart';
import PieChart, { TwoPieChart } from './component/pieChart';
import BarChart from './component/barChart';
import ForceChart from './component/forceChart';
import * as d3 from 'd3';
import _ from 'lodash';
import data from './component/data.json';
import { getNodeRadius, isCoreSelfNodes, cluster } from './component/tool';

function Force(options) {
  return d3.forceSimulation()
            .alphaDecay(options.alphaDecay || 0.2)
            .nodes(options.nodes || [])
            .force("link", d3.forceLink(options.links).distance(options.distance || 10)) // distance为连线的距离设置
            .force('collide', d3.forceCollide(function(d) {
              return getNodeRadius(d);
            })) // collide 为节点指定一个radius区域来防止节点重叠。
            .force("charge", d3.forceManyBody().strength(options.charge || -300))  // 节点间的作用力
            .on('tick', e => {
              if (typeof options.tick == 'function') {
                options.tick(e);
              }
            })
            .on('end', () => {
              if (typeof options.end == 'function') {
                options.end();
              }
            });
}

function renderAssociations(data) {
  return new Promise(resolve => {
    const nodes = data.nodes;
    const links = _.map(data.edges,edge => {
      return {
        source: _.findIndex(nodes, node => node.nodeId == edge.srcId),
        target: _.findIndex(nodes, node => node.nodeId == edge.targetId),
        weight: edge.weight
      };
    });
    let subGroups = _.uniq(_.map(nodes, function(node) {return node.subGroupId})).filter(node => !node.subGroupId);
    if (subGroups.length == 0) {
      resolve(null);
      return;
    }
    let coreSelfNodes = [];
    if (data.wholeCoreSelfNode) {
      coreSelfNodes = data.wholeCoreSelfNode.split(';');
    }

    // 只有一个子群体无需分团
    if (subGroups.length == 1) {
      const force1 = new Force({
        nodes: nodes,
        links: links,
        alphaDecay: 0.0228,
        charge: -100,
        end: () => {
          const num = Math.min(Math.max(Math.ceil(Math.sqrt(nodes.length) * 8), 1), 300);
          const minX = _.minBy(nodes, 'x').x - 100;
          const minY = _.minBy(nodes, 'y').y - 100;
          const maxX = _.maxBy(nodes, 'x').x - minX + 100;
          const maxY = _.maxBy(nodes, 'y').y - minY + 100;

          const width = maxX;
          const height = maxY;

          _.each(nodes, node => {
            node.x -= minX;
            node.y -= minY;
          });
          /* 数据处理 end */
          //线长度比例尺
          const maxWeight = _.result(_.maxBy(links, 'weight'), 'weight');
          const minWeight = _.result(_.minBy(links, 'weight'), 'weight');
          var lineWidth = d3.scaleQuantize().domain([minWeight, maxWeight]).range(maxWeight == minWeight ? [1]: [1, 2, 3, 4]);

          resolve({
            id: data.groupId,
            base: renderToString(<ForceChart lineWidth={lineWidth} width={width} height={height} nodes={nodes} links={links} subGroups={subGroups} coreSelfNodes={coreSelfNodes}/>),
            width: width > 870 ? 870 * height / width : height
          });
        }
      }).restart();
    } else {
      // 分团
      subGroups = _.map(subGroups, id => { return {id: id} });
      _.forEach(subGroups, group => {
        group.radius = 0;
        nodes.forEach(node => {
          if (node.subGroupId == group.id) {
            node.center = group;
            group.radius++;
          }
        });
        group.radius = Math.min(group.radius * 2 + 20, Math.max(nodes.length / subGroups.length, 90));
      })
      const npgId = `${data.groupId}_node`;
      const gpgId = `${data.groupId}_group`;
      const nodeForce = new Force({
        nodes: nodes,
        links: links,
        charge:  Math.min(Math.max(150 -subGroups.length * 5  -nodes.length * 2, -500), -30),
        // charge: -30,
        start: () => {
        },
        tick: e => {
          nodes.forEach(cluster(Math.min(subGroups.length / 2 * nodeForce.alpha(), 0.9)));
        },
        end: () => {
          // $('#svgs').empty();
          /* 数据处理 start */
          const minX = _.minBy(nodes, 'x').x - 100;
          const minY = _.minBy(nodes, 'y').y - 100;
          const maxX = _.maxBy(nodes, 'x').x - minX + 100;
          const maxY = _.maxBy(nodes, 'y').y - minY + 100;

          const width = maxX;
          const height = maxY;

          _.each(nodes, node => {
            node.x -= minX;
            node.y -= minY;
          });
          /* 数据处理 end */

          resolve({
            id: data.groupId,
            base: renderToString(<ForceChart width={width} height={height} nodes={nodes} links={links} subGroups={subGroups} coreSelfNodes={coreSelfNodes}/>),
            width: width>870?870*height/width:height
          });
        }
      });
      // pm.setCurrent(0, gpgId);
      // 群体力导,实时计算群体中心
      const force2 = new Force({
        nodes: subGroups,
        size: [1200, 1200],
        charge: -300,
        start: () => {
          nodeForce.restart();
        },
        end: () => {
        }
      }).restart();
    }
  });
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      svg: ''
    }
  }

  componentDidMount() {
    const promises = data.features.map(feature => renderAssociations(feature));
    const self = this;
    Promise.all(promises).then((values) => {
      self.setState({
        svg: values.map(v => v.base).join('')
      })
    })
  }

  render() {
    return (<div>
      <h1>折线图</h1>
      <div>
        <BrokenLineChart />
      </div>
      <h1>饼图</h1>
      <div>
        <PieChart />
      </div>
      <div>
        <TwoPieChart />
      </div>
      <h1>柱状图</h1>
      <div>
        <BarChart />
      </div>
      <h1>力导图</h1>
      <div dangerouslySetInnerHTML={{__html: this.state.svg}}>
      </div>
    </div>);
  }
}
