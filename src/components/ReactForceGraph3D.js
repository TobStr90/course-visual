import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback } from "react";
import SpriteText from "three-spritetext";
import * as d3 from "d3-force";

const ReactForceGraph3D = () => {
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
        <ForceGraph3D
            graphData={data}
            nodeRelSize={9999}
            linksStrength={0.01}
            nodeVal={nodeSize}
            nodeAutoColorBy="group"
            nodeThreeObject={(node) => {
                const label = node.chapter ? node.chapter : node.id;
                const sprite = new SpriteText(label);
                sprite.color = node.color;
                sprite.textHeight = 8;
                return sprite;
            }}
        />
    );
};

export default ReactForceGraph3D;
