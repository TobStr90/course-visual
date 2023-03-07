import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback } from "react";
import * as d3 from "d3-force";

const ReactForceGraph = () => {
    var data = require("../assets/graph.json");
    console.log(data);

    if (!data) {
        return <div>Loading data...</div>;
    }

    const nodeSize = (node) => {
        if (node.group === 1) {
            return 10;
        } else if (node.group === 2) {
            return 100;
        } else {
            return 1;
        }
    };

    return (
        <ForceGraph2D
            graphData={data}
            nodeRelSize={9999}
            linksStrength={0.01}
            nodeVal={nodeSize}
            nodeAutoColorBy="group"
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(
                    (n) => n + fontSize * 0.2
                ); // some padding

                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.fillRect(
                    node.x - bckgDimensions[0] / 2,
                    node.y - bckgDimensions[1] / 2,
                    ...bckgDimensions
                );

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = node.color;
                ctx.fillText(label, node.x, node.y);

                node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
            }}
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
        />
    );
};

export default ReactForceGraph;
