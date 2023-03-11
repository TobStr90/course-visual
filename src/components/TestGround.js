import { React, useCallback, useState, useMemo } from "react";
import PrunedGraph2D from "./PrunedGraph2D copy";
import Searchbar from "./Searchbar";

function TestGround() {
  const graphData = require("../assets/graph.json");

  const rootId = "Objektorientierte Programmierung";

  const nodesById = useMemo(() => {
    const nodesById = Object.fromEntries(
      graphData.nodes.map((node) => [node.id, node])
    );

    graphData.nodes.forEach((node) => {
      node.collapsed = node.id !== rootId;
      node.childLinks = [];
    });
    graphData.links.forEach((link) => {
      if (!nodesById[link.source]) {
        window.location.reload();
      }
      nodesById[link.source].childLinks.push(link);
      nodesById[link.target].childLinks.push(link);
    });

    return nodesById;
  }, [graphData]);

  const getPrunedGraph = () => {
    const visibleNodes = new Set();
    const visibleLinks = [];
    const traverseGraph = (node = nodesById[rootId]) => {
      if (visibleNodes.has(node)) return;

      visibleNodes.add(node);
      if (node.collapsed) {
        return;
      }

      visibleLinks.push(...node.childLinks);
      node.childLinks
        .map((link) =>
          typeof link.target === "object" ? link.target : nodesById[link.target]
        )
        .forEach(traverseGraph);
    };
    traverseGraph();

    return { nodes: Array.from(visibleNodes), links: visibleLinks };
  };

  const [prunedGraph, setPrunedGraph] = useState(getPrunedGraph());

  const handleOnSelect = useCallback((item) => {
    const node = nodesById[item.id];
    if (node.childLinks && node.childLinks.length) {
      node.collapsed = false;
      setPrunedGraph(getPrunedGraph());
    }
  }, []);

  const handleNodeClick = useCallback((node) => {
    if (node.childLinks && node.childLinks.length) {
      node.collapsed = !node.collapsed;
      setPrunedGraph(getPrunedGraph());
    }
  }, []);

  return (
    <div>
      <Searchbar
        items={graphData.nodes}
        handleOnSelect={handleOnSelect}
      ></Searchbar>{" "}
      <PrunedGraph2D
        onNodeClick={handleNodeClick}
        prunedGraph={prunedGraph}
        setPrunedGraph={setPrunedGraph}
      ></PrunedGraph2D>
    </div>
  );
}

export default TestGround;
