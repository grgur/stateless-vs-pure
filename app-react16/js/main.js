import React, { createElement, Component } from "react";
import { render } from "react-dom";

let iterations;
let prevTime;
let currentCmp;
let max = 100000;

function workHard() {
  // Don't do anything right now.
  // Pure component will remain fast because it never updates.
  // This is unfair advantage over the other two component types.
  return;
  let i = 10;
  while (i > 0) {
    JSON.parse(JSON.stringify({ foo: --i }));
  }
}

class Stateful extends Component {
  render() {
    workHard();
    return <div>Hello Cmp1: stateful</div>;
  }
}

class Pure extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    workHard();
    return <div>Hello Cmp2: stateful, pure, no updates</div>;
  }
}

function Stateless() {
  workHard();
  return <div>Hello Cmp3: stateless</div>;
}

var Memo = React.memo(
  function MyComponent(props) {
    workHard();
    return <div>Hello Cmp4: memo, no updates</div>;
  },
  () => true
);

function* cmpCycle(components) {
  yield* components;
}

const components = [
  { component: Stateless, name: "Stateless" },
  { component: Stateful, name: "Stateful" },
  { component: Pure, name: "Pure" },
  { component: Memo, name: "Memo" }
];
const cmpSwitcher = cmpCycle(components);

function nextComponent() {
  console.log(
    "%c                                         ",
    "border-top: 1px solid #999;"
  );
  start(cmpSwitcher.next().value);
}

function start(cmp) {
  if (!cmp) {
    return;
  }
  iterations = max;
  console.log(
    `%cTesting componenent ${cmp.name}`,
    "color: green; font-weight: bold;"
  );
  prevTime = performance.now();
  iterate(cmp.component);
}

function rerender(cmp, i) {
  render(
    <Main currentCmp={cmp} iteration={i} />,
    document.getElementById("main")
  );
}

function iterate(cmp) {
  while (iterations--) {
    rerender(cmp, iterations);
  }
  console.log(
    `Time: %c${Math.round(performance.now() - prevTime)}ms`,
    "color:red"
  );
  setTimeout(nextComponent, 500);
}

class Main extends Component {
  render() {
    const { currentCmp, iteration } = this.props;
    return createElement(currentCmp, { iteration });
  }
}

Main.defaultProps = {
  iteration: "Init"
};

console.log(`Starting ${max} tests with %cReact 16...`, "font-weight: bold");
setTimeout(nextComponent, 1000);
