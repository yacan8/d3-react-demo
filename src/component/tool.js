import _ from 'lodash';

export function isCoreSelfNodes(node, coreSelfNodes){
  return node.isSelfNode && coreSelfNodes.find(item => item == node.name);
}

export function getNodeRadius(coreSelfNodes) {
  return d => {
    let ir = 0;
    if (isCoreSelfNodes(d, coreSelfNodes)) {
      ir = Math.max(Math.min(d.degree, 20), 10)
    } else {
      ir = Math.max(Math.min(d.degree, 15), 5)
    }
    d.ir = ir;
    return ir;
  }
}

export function cluster(alpha) {
  return o => {
    o.y += (o.center.y - o.y) * alpha;
    o.x += (o.center.x - o.x) * alpha;
  }
}

// 计算包围一组群体的最小圆
export function getMinCircle(d) {
  const maxRight = _.maxBy(d.values, 'x');
  const maxLeft = _.minBy(d.values, 'x');
  const maxTop = _.maxBy(d.values, 'y');
  const maxBottom = _.minBy(d.values, 'y');
  const center = [(maxLeft.x + maxRight.x) / 2, (maxTop.y + maxBottom.y) / 2];
  const radius = Math.sqrt(Math.pow(maxRight.x - maxLeft.x, 2) + Math.pow(maxTop.y - maxBottom.y, 2)) / 2;
  return {
    center: center,
    radius: radius
  }
}
