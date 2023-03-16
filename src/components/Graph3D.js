import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3-force";
import React from "react";
import SpriteText from "three-spritetext";

function Graph3D(props) {
  const handleNodeClick = (node) => {
    props.onNodeClick(node);
  };

  const handleNodeRightClick = (node) => {
    props.onNodeRightClick(node);
  };

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (node) {
      highlightNodes.add(node);
      node.childLinks.forEach((childLink) => {
        highlightNodes.add(childLink.target);
        highlightNodes.add(childLink.source);
      });
      node.childLinks.forEach((link) => highlightLinks.add(link));
    }

    updateHighlight();
  };

  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      link.source.childLinks
        .filter(
          (childLink) =>
            childLink.source === link.target && link.source === childLink.target
        )
        .forEach((childLink) => highlightLinks.add(childLink));
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }
  };

  const getColor = (node) => {
    switch (node.unit) {
      case "Vorwort":
        return "Red";
      case "Kurseinheit 1":
        return "Blue";
      case "Kurseinheit 2":
        return "Green";
      case "Kurseinheit 3":
        return "Orange";
      case "Kurseinheit 4":
        return "Purple";
      case "Kurseinheit 5":
        return "Teal";
      case "Kurseinheit 6":
        return "Gray";
      case "Kurseinheit 7":
        return "Brown";
      default:
        return "White";
    }
  };

  const getGraph = () => {
    return (
      <ForceGraph3D
        graphData={props.graph}
        // linkDirectionalParticles={4}
        // linkDirectionalParticleColor={(link) => getColor(link.source)}
        // linkDirectionalParticleSpeed={0.001}
        // linkDirectionalParticleWidth={(link) =>
        //   highlightLinks.has(link) ? 4 : 0
        // }
        // linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
        nodeAutoColorBy={"group"}
        nodeThreeObject={(node) => {
          const label = node.id;
          const sprite = new SpriteText(label);
          sprite.color = getColor(node);
          sprite.textHeight = 8;
          return sprite;
        }}
        // onLinkHover={handleLinkHover}
        onNodeClick={handleNodeClick}
        // onNodeHover={handleNodeHover}
        onNodeRightClick={handleNodeRightClick}
      />
    );
  };

  return getGraph();
}

export default Graph3D;
