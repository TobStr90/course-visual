import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { csvParse } from "d3-dsv";
import * as d3 from "d3-force";
import React from "react";

import graphDataJson from "../assets/graph.json";

function TestGround(props) {
    const [data, setData] = useState({ nodes: [], links: [] });

    useEffect(() => {
        fetch("../datasets/d3-dependencies.csv")
            // fetch("../assets/graph.json")
            .then((r) => r.text())
            .then(csvParse)
            .then((data) => {
                const nodes = [],
                    links = [];
                data.forEach(({ size, path }) => {
                    if (!path) return;

                    const levels = path.split("/"),
                        level = levels.length - 1,
                        module = level > 0 ? levels[1] : null,
                        leaf = levels.pop(),
                        parent = levels.join("/");

                    const node = {
                        path,
                        leaf,
                        module,
                        size: +size || 20,
                        level,
                    };

                    nodes.push(node);

                    if (parent) {
                        links.push({
                            source: parent,
                            target: path,
                            targetNode: node,
                        });
                    }
                });

                console.log(nodes);
                console.log(links);

                setData({ nodes, links });
            });
    }, []);

    return (
        <div id="graph" style={{ height: "111vh", width: "111vw" }}>
            {data.nodes.length > 0 && <ForceTree data={data} />}
        </div>
    );
}

const ForceTree = ({ data }) => {
    const fgRef = useRef();

    useEffect(() => {
        // add collision force
        fgRef.current.d3Force(
            "collision",
            d3.forceCollide((node) => Math.sqrt(100 / (node.level + 1)))
        );
    }, []);

    return (
        <ForceGraph2D
            height={111}
            width={111}
            ref={fgRef}
            graphData={data}
            dagMode={"lr"}
            dagLevelDistance={300}
            backgroundColor="#101020"
            linkColor={() => "rgba(255,255,255,0.2)"}
            nodeRelSize={1}
            nodeId="path"
            nodeVal={(node) => 100 / (node.level + 1)}
            nodeLabel="path"
            nodeAutoColorBy="module"
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={2}
            d3VelocityDecay={0.3}
        />
    );
};

export default TestGround;
