import React from "react";
import {render} from 'react-dom';

let iterations;
let prevTime;
let currentCmp;
let max = 100000;

class StatefulUpdates extends React.Component {
  render () {
    return <div>Hello Cmp1: stateful</div>;
  }
}

class StatefulNoUpdate extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  
  render () {
    return <div>Hello Cmp2: stateful, no updates</div>;
  }
}

function Stateless() {
  return <div>Hello Cmp3: stateless</div>;
}

function* cmpCycle(components){
  let index = 0;
  const len = components.length;
  while(index < len) {
    yield components[index];
    index++;
  }
}

const components = [Stateless, StatefulUpdates, StatefulNoUpdate];
const cmpSwitcher = cmpCycle(components);

function nextComponent() {
  console.log('%c                                         ', 'border-top: 1px solid #999;');
  start(cmpSwitcher.next().value);
}

function start(cmp) {
  if (!cmp) {
    return;
  }
  iterations = max;
  console.log(`%cTesting Componenent${cmp.name}`,'color: green; font-weight: bold;');
  prevTime = performance.now();
  // Perf.start();
  iterate(cmp);
}

function rerender(cmp, i) {
  render((
    <Main currentCmp={cmp} iteration={i}/>
  ), document.getElementById('main'));
}

function iterate(cmp) {
  while (iterations--) {
    rerender(cmp, iterations);
  }
  console.log(`Time: %c${Math.round(performance.now() - prevTime)}ms`, 'color:blue');
  setTimeout(nextComponent, 500);
}

class Main extends React.Component {
  render() {
    const { currentCmp, iteration } = this.props;
    return <main>{iteration}{React.createElement(currentCmp)}</main>;
  }
}

Main.defaultProps = {
  iteration: 'Init'
};

console.log(`Starting ${max} tests with %cReact 14...`, 'font-weight: bold');
setTimeout(nextComponent, 1000);
