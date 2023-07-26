import { ForceGraph2D } from "react-force-graph";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import React from "react";

function Graph2DForceDirected({
    graph,
    onNodeClick,
    onNodeRightClick,
    height,
    highlightLinks,
    onLinkHover,
    onNodeHover,
    getMouseOverLabel,
    getColor,
    getLinkColor,
    nodeCanvasObject,
    nodePointerAreaPaint,
}) {
    const graphRef = useRef();

    useEffect(() => {
        const fg = graphRef.current;
        fg.d3Force("charge", d3.forceManyBody().strength(-200));
        fg.d3Force("collide", d3.forceCollide(10));
    });

    const getGraph = () => {
        return (
            <ForceGraph2D
                height={height}
                ref={graphRef}
                graphData={graph}
                linkColor={getLinkColor}
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
                nodeCanvasObject={nodeCanvasObject}
                nodeLabel={getMouseOverLabel}
                nodePointerAreaPaint={nodePointerAreaPaint}
            ></ForceGraph2D>
        );
    };

    return getGraph();
}

export default Graph2DForceDirected;
