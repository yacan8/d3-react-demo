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
  const maxRight = d.values.maxBy('x');
  const maxLeft = d.values.minBy('x');
  const maxTop = d.values.maxBy('y');
  const maxBottom = d.values.minBy('y');
  const center = [(maxLeft.x + maxRight.x) / 2, (maxTop.y + maxBottom.y) / 2];
  const radius = Math.sqrt(Math.pow(maxRight.x - maxLeft.x, 2) + Math.pow(maxTop.y - maxBottom.y, 2)) / 2;
  return {
    center: center,
    radius: radius
  }
}
export function getBgColors(){
  const colors = ['#5db2dc', '#855ba0', '#efa841', '#e95d5f', '#5ab67a', '#70ad47', '#265e91'];
  const length = colors.length;
  let result = [];
  while (result.length < length) {
    const random = Math.ceil(Math.random() * colors.length) - 1;
    result = result.concat(colors[random]);
    colors.splice(random, 1)
  }
  return result
};
