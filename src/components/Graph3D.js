import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3-force";
import React from "react";
import SpriteText from "three-spritetext";

function Graph3D({ graph, onNodeClick, onNodeRightClick, height, getColor }) {
    const getGraph = () => {
        return (
            <ForceGraph3D
                graphData={graph}
                height={height}
                nodeAutoColorBy={"group"}
                nodeThreeObject={(node) => {
                    const label = node.id;
                    const sprite = new SpriteText(label);
                    sprite.color = getColor(node);
                    sprite.textHeight = 8;
                    return sprite;
                }}
                onNodeClick={onNodeClick}
                onNodeRightClick={onNodeRightClick}
            />
        );
    };

    return getGraph();
}

export default Graph3D;
