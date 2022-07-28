import React from 'react';

import {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Constraint,
  MouseConstraint,
  Mouse,
  Vector,
  Vertices,
  Bounds
} from 'matter-js';

import { motion, useMotionValue } from "framer-motion";

import styled from 'styled-components';

import useAnimationFrame from './use-animation-frame';


// scatter, slightly
const s = v => v + Math.random() - 0.5;


// create an engine
var engine = Engine.create({gravity: Vector.create(0, 0)});

// create a renderer
// var render = Render.create({
//     element: document.getElementById('app'),
//     engine: engine
// });

// create two boxes and a ground
const letters = "stare".split('');

const bods = letters.map((letter, i) => {
  return Bodies.circle(
    s(i * 100),
    s(100),
    40,
    {
      id: i,
      frictionAir: 0.1
    }
  );
});

// var mouse = Mouse.create(render.canvas);
// var mouseConstraint = MouseConstraint.create(engine, {
//     mouse: mouse,
//     constraint: {
//         stiffness: 0.2,
//         render: {
//             visible: false
//         }
//     }
// });


function* generateConstraints() {
  for (var i = 0; i < bods.length - 1; i++) {
    yield Constraint.create({
      bodyA: bods[i],
      bodyB: bods[i+1],
      stiffness: 1,
      label: 'link'
    });

    if (i < bods.length - 2) {
      yield Constraint.create({
        bodyA: bods[i],
        bodyB: bods[i+2],
        stiffness: 0.01,
        length: 200
      });
    }
  }
}
  // Constraint.create({
  //   bodyA: boxA,
  //   bodyB: boxB,
  //   stiffness: 1,
  // }),
  // Constraint.create({
  //   bodyA: boxB,
  //   bodyB: boxC,
  //   stiffness: 1,
  // }),
  // Constraint.create({
  //   bodyA: boxA,
  //   bodyB: boxC,
  //   stiffness: 0.01,
  //   length: 150
  // }),

var joints = [...generateConstraints()];


// Composite.add(engine.world, joint1);
// Composite.add(engine.world, joint2);
// Composite.add(engine.world, joint3);
// Composite.add(engine.world, joint4);
Composite.add(engine.world, bods);
// add all of the bodies to the world
// Composite.add(engine.world, mouseConstraint);
Composite.add(engine.world, joints);



// run the renderer
// Render.run(render);

// create runner
//var runner = Runner.create();

// run the engine
//Runner.run(runner, engine);


const Character = styled.text`
  font-family: Roboto;
  font-size: 40px;
  text-anchor: middle;
  dominant-baseline: middle;
`

function Letter({body}) {
  const { position, id } = body;

  return <g transform={`translate(${position.x} ${position.y})`}>
    <circle r={30} stroke="gray" fill="white"/>
    <Character y={4}>{letters[id].toUpperCase()}</Character>
  </g>
}

function Line({constraint}) {
  const { bodyA, bodyB, label } = constraint;
  if (label !== 'link') return null;

  return <line
    x1={bodyA.position.x}
    y1={bodyA.position.y}
    x2={bodyB.position.x}
    y2={bodyB.position.y}
    stroke="black"
    strokeWidth={2}
  />
}


export default function () {
  const [bodies, setBodies] = React.useState([]);
  const [constraints, setConstraints] = React.useState([]);

  const viewBox = useMotionValue(`0 0 400 400`);

  const animate = React.useCallback(() => {
    const allBodies = Composite.allBodies(engine.world);
    const allContraints = Composite.allConstraints(engine.world);
    const positions = allBodies.map(body => body.position);
    const center = Vertices.mean(positions);
    const bounds = Bounds.create(positions);
    const min = Vector.mult(bounds.min, 0.67);
    const max = Vector.mult(bounds.max, 1.5);
    const width = max.x - min.x;
    const height = max.y - min.y;
    const longest = Math.max(width, height);
    const offset = longest / 2;

    setBodies([...allBodies]);
    setConstraints([...allContraints]);
    Engine.update(engine, 1000 / 60);

    viewBox.set(`${center.x - offset} ${center.y - offset} ${longest} ${longest}`);
  })

  useAnimationFrame(animate);

return <>
    <motion.svg width="100vw" height="100vw" viewBox={viewBox}>
      { constraints.map(constraint => <Line key={constraint.id} constraint={constraint} />)}
      { bodies.map(body => <Letter key={body.id} body={body}/>)}
    </motion.svg>
    <div>

    </div>
  </>
}
