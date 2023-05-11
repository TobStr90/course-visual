import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import * as d3 from "d3-force";
import * as d3 from "d3";
// import { forceSimulation, force, forceX } from "d3-force";
import React from "react";

function Graph2DForceDirected({
    graph,
    onNodeClick,
    onNodeRightClick,
    height,
    highlightLinks,
    highlightNodes,
    onLinkHover,
    onNodeHover,
    getDisplayLabel,
    getMouseOverLabel,
    getColor,
}) {
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
    }, [graph]);

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

    useEffect(() => {
        const fg = graphRef.current;
        fg.d3Force("charge", d3.forceManyBody());
        fg.d3Force("link", d3.forceLink());
        fg.d3Force("center", d3.forceCenter());
        fg.d3Force("collide", d3.forceCollide());
        fg.d3ReheatSimulation();
    });

    const getGraph = () => {
        return (
            <ForceGraph2D
                // {...config}
                // d3Force={getForce()}
                // dagLevelDistance={100}
                height={height}
                ref={graphRef}
                graphData={graph}
                linkDirectionalParticles={4}
                linkDirectionalParticleColor={(link) => getColor(link.source)}
                linkDirectionalParticleSpeed={0.001}
                linkDirectionalParticleWidth={(link) =>
                    highlightLinks.has(link) ? 4 : 0
                }
                linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
                onLinkHover={onLinkHover}
                onNodeClick={onNodeClick}
                onNodeHover={onNodeHover}
                onNodeRightClick={onNodeRightClick}
                nodeAutoColorBy={"group"}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = getDisplayLabel(node);
                    const fontSize = 16 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [
                        textWidth * 1.1,
                        fontSize * 1.1,
                    ].map((n) => n + fontSize * 0.2);

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

export default Graph2DForceDirected;
