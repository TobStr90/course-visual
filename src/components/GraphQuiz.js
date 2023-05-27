import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3-force";
import React from "react";

function GraphQuiz({ graph, onNodeClick, height, nodePointerAreaPaint }) {
    const handleNodeClick = (node) => {
        if (!highlightedNode) setHighlightedNode(node);
        else {
            if (node === highlightedNode) setHighlightedNode(null);
            else {
                //check if already connected
                let alreadyConnceted = false;
                graph.links.forEach((link) => {
                    if (
                        ((link.source.id === node.id ||
                            link.source === node.id) &&
                            (link.target.id === highlightedNode.id ||
                                link.target === highlightedNode.id)) ||
                        ((link.target.id === node.id ||
                            link.target === node.id) &&
                            (link.source.id === highlightedNode.id ||
                                link.source === highlightedNode.id))
                    )
                        alreadyConnceted = true;
                });

                if (alreadyConnceted) return;

                const links = highlightedNode.childLinks.filter(
                    (link) =>
                        link.target.id === node.id ||
                        link.target === node.id ||
                        link.source.id === node.id ||
                        link.source === node.id
                );
                if (links.length > 0) {
                    onNodeClick(links);
                } else {
                    setWrongNodes([highlightedNode, node]);
                }
                setHighlightedNode(null);
            }
        }
    };

    const [wrongNodes, setWrongNodes] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setWrongNodes(null);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [wrongNodes]);

    const [highlightedNode, setHighlightedNode] = useState(null);

    const fgRef = useRef();

    useEffect(() => {
        const fg = fgRef.current;
        fg.d3Force("charge", d3.forceManyBody().strength(-1));
        fg.d3Force("center", d3.forceCenter().strength(0.01));
        fg.d3Force("collide", d3.forceCollide(10));
    });

    const getLinkColor = () => "rgba(0, 0, 0, 0.5)";

    const getGraph = () => {
        return (
            <ForceGraph2D
                cooldownTicks={100}
                onEngineStop={() => fgRef.current.zoomToFit(100)}
                linkColor={getLinkColor}
                height={height}
                ref={fgRef}
                graphData={graph}
                onNodeClick={handleNodeClick}
                nodeAutoColorBy={"group"}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 16 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [
                        textWidth * 1.1,
                        fontSize * 1.1,
                    ].map((n) => n + fontSize * 0.2);

                    ctx.fillStyle = "rgba(239,239,240,0.8)";
                    if (node === highlightedNode)
                        ctx.fillStyle = "rgba(11, 156, 49, 0.2)";
                    if (
                        wrongNodes &&
                        wrongNodes.some((wrongNode) => wrongNode.id === node.id)
                    )
                        ctx.fillStyle = "rgba(155, 0, 0, 0.5)";

                    ctx.fillRect(
                        node.x - bckgDimensions[0] / 2,
                        node.y - bckgDimensions[1] / 2,
                        ...bckgDimensions
                    );

                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "black";
                    ctx.fillText(label, node.x, node.y);

                    node.__bckgDimensions = bckgDimensions;
                }}
                nodePointerAreaPaint={nodePointerAreaPaint}
            />
        );
    };

    return getGraph();
}

export default GraphQuiz;
