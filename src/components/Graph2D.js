import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import * as d3 from "d3-force";
import * as d3 from "d3";
// import { forceSimulation, force, forceX } from "d3-force";
import React from "react";

function Graph2D(props) {
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
    console.log(node);
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
        return "Black";
    }
  };

  const getDisplayLabel = (node) => {
    return node.chapter ? node.chapter : node.name;
  };

  const getMouseOverLabel = (node) => {
    return node.name;
  };

  const graphRef = useRef();

  // useEffect(() => {
  //   const fg = graphRef.current;

  // const graphContainer = document.getElementById("Graph");
  // const graphContainerTop = graphContainer.getBoundingClientRect().top;
  // const graphContainerHeight = graphContainer.clientHeight;
  // const height = 100;
  // const width = window.innerWidth;
  // const padding = 10;

  // d3.forceSimulation()
  //   .force(
  //     "x",
  //     d3.forceX().x((d) => Math.max(padding, Math.min(width - padding, d.x)))
  //   )
  //   .force(
  //     "y",
  //     d3.forceY().y((d) => Math.max(padding, Math.min(height - padding, d.y)))
  //   );

  // const centerForce = d3.forceCenter(0, 0);

  // const nodeToCenter = props.graph.nodes.find(
  //   (node) => node.id === "Objektorientierte Programmierung"
  // );
  // nodeToCenter.fx = 0;
  // nodeToCenter.fy = 0;
  // console.log(nodeToCenter);

  // fg.d3Force("center", centerForce);

  // fg.d3Force("link", d3.forceLink().distance(30));
  // fg.d3Force("collide", d3.forceCollide(50));
  // fg.d3Force("charge", d3.forceManyBody().strength(-10).distanceMin(10));
  // });

  const [height, setHeight] = useState(0);

  const getHeight = () => {
    const graphContainer = document.getElementById("Graph2D");
    if (!graphContainer) return 0;

    const graphContainerTop = graphContainer.getBoundingClientRect().top;

    const height = window.innerHeight - graphContainerTop;

    return height - 5;
  };

  useEffect(() => {
    const updateHeight = () => {
      const newHeight = getHeight();
      if (newHeight !== height) {
        setHeight(newHeight);
      }
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [height]);

  const getDagMode = () => {
    if (!props.dagMode) return null;
    else return props.dagMode;
  };

  useEffect(() => {
    // const customForce = () => {
    //     props.graph.nodes.forEach((d) => {
    //         d.x = props.graph.nodes.indexOf(d) * 100;
    //         d.y = props.graph.nodes.indexOf(d) * 100;
    //         // d.x += (d.targetX - d.x) * alpha * 0.1;
    //         // d.y += (d.targetY - d.y) * alpha * 0.1;
    //     });
    //     console.log(props.graph.nodes);
    // };
    // fgRef.d3Force("center", null);
    // fgRef.d3Force("charge", null);
    // fgRef.d3Force("collide", null);
    // fgRef.d3Force("x", null);
    // fgRef.d3Force("y", null);
    // fgRef.d3Force("x", customForce());
    // fgRef.d3Force("y", customForce());
    // d3.forceSimulation().force("x", null).force("y", null);
    // d3.forceSimulation()
    //     .force(
    //         "x",
    //         d3.forceX().x((d) => props.graph.nodes.indexOf(d) * 100)
    //     )
    //     .force(
    //         "y",
    //         d3.forceY().y((d) => props.graph.nodes.indexOf(d) * 100)
    //     );
    // fgRef.d3Force("x", null);
    // fgRef.d3Force("y", null);
    // const simulation = fgRef.current.d3forceSimulation();
    // simulation.force("x", null);
    // simulation.force(
    //     "x",
    //     d3.forceX().x((d) => props.graph.nodes.indexOf(d) * 100)
    // );
    // fgRef.current.graphData(props.graph);
  }, [props.graph]);

  //   const config = React.useMemo(() => {
  //     return {
  //       d3Force: {
  //         // fx: d3.forceX().x((d) => props.graph.nodes.indexOf(d) * 100),
  //         // fy: d3.forceY().y((d) => props.graph.nodes.indexOf(d) * 100),
  //         x: null,
  //         y: null,
  //       },
  //     };
  //   }, [props.graph]);

  //   const getForce = () => {
  //     const customForce = () => {
  //       props.graph.nodes.forEach((d) => {
  //         d.x = props.graph.nodes.indexOf(d) * 100;
  //         d.y = props.graph.nodes.indexOf(d) * 100;
  //         // d.x += (d.targetX - d.x) * alpha * 0.1;
  //         // d.y += (d.targetY - d.y) * alpha * 0.1;
  //       });
  //       console.log(props.graph.nodes);
  //     };

  //     return {
  //       linkDistance: 999,
  //       charge: -100,
  //       x: customForce(),
  //       y: customForce(),
  //     };
  //   };

  const getGraph = () => {
    return (
      <ForceGraph2D
        dagMode={getDagMode()}
        // {...config}
        // d3Force={getForce()}
        dagLevelDistance={100}
        height={getHeight()}
        ref={graphRef}
        graphData={props.graph}
        linkDirectionalParticles={4}
        linkDirectionalParticleColor={(link) => getColor(link.source)}
        linkDirectionalParticleSpeed={0.001}
        linkDirectionalParticleWidth={(link) =>
          highlightLinks.has(link) ? 4 : 0
        }
        linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
        onLinkHover={handleLinkHover}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onNodeRightClick={handleNodeRightClick}
        nodeAutoColorBy={"group"}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = getDisplayLabel(node);
          const fontSize = 16 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth * 1.1, fontSize * 1.1].map(
            (n) => n + fontSize * 0.2
          );

          // ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillStyle = node.expandable
            ? "rgba(11, 156, 49, 0.2)"
            : "rgba(239, 239, 240, 0.8)";

          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = getColor(node);
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions;

          if (highlightNodes.has(node)) {
            ctx.strokeStyle = getColor(node);
            ctx.lineWidth = fontSize / 15;
            ctx.strokeRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions
            );
          }
        }}
        nodeLabel={getMouseOverLabel}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions &&
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions
            );
        }}
      ></ForceGraph2D>
    );
  };

  return getGraph();
}

export default Graph2D;