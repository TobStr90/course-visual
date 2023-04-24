import React from "react";
import { ForceGraph2D } from "react-force-graph";
import * as d3 from "d3";

const data = {
  nodes: [
    { id: "A" },
    { id: "B" },
    { id: "C" },
    { id: "D" },
    { id: "E" },
    { id: "F" },
    { id: "G" },
    { id: "H" },
    { id: "I" },
    { id: "J" },
  ],
  links: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" },
    { source: "C", target: "E" },
    { source: "C", target: "F" },
    { source: "A", target: "G" },
    { source: "G", target: "H" },
    { source: "G", target: "I" },
    { source: "G", target: "J" },
  ],
};

const sortNodes = (data) => {
  const root = d3.hierarchy(data);
  root.eachBefore((node) => {
    node.sort((a, b) => {
      return a.data.id.localeCompare(b.data.id);
    });
  });
  console.log(root.data);
  return root.data;
};

const handleNodeClick = (node) => {
  console.log("Clicked node:", node);
};

let order = 0;
data.nodes.forEach((node) => {
  node.order = order++;
});

const handleEngineTick = () => {
  data.nodes.forEach((node) => {
    if (node.order > 0) {
      if (data.nodes[node.order - 1].x > node.x) {
        let helper = node.x;
        node.x = data.nodes[node.order - 1].x;
        data.nodes[node.order - 1].x = helper;
      }
    }
  });
};

const TestGround = () => {
  return (
    <ForceGraph2D
      graphData={sortNodes(data)}
      dagMode="td"
      dagLevelDistance={25}
      nodeRelSize={5}
      nodeId="id"
      nodeLabel="id"
      linkDirectionalArrowLength={3}
      linkDirectionalArrowRelPos={1}
      onNodeClick={handleNodeClick}
      onEngineTick={handleEngineTick}
    />
  );
};

export default TestGround;
