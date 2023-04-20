import React from "react";
import * as d3 from "d3";
import { dagStratify, dagConnect, sugiyama, decrossOpt } from "d3-dag";
// import { hierarchy, sugiyama } from "d3-hierarchy";
import graphDataJson from "../assets/graph.json";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

function TestGround() {
    const data = graphDataJson;

    var nodesArr = [];
    const ids = new Set();
    data.nodes.forEach((node) => {
        if (ids.has(node.id)) {
            console.log(`Duplicate id found: ${node.id}`);
        } else {
            ids.add(node.id);
            nodesArr.push(node);
        }
    });

    const dag = dagStratify()(nodesArr);
    if (nodesArr > 0 && data.links.length > 0) dagConnect()(dag, data.links);
    console.log(dag);
    console.log(data.links);
    // dagConnect()(dag, data.links);

    // const nodes = data.nodes.map((d) => ({ id: d.id, ...d }));
    // console.log(nodes);
    // const links = data.links.map((d) => ({
    //     source: nodes.find((n) => n.id === d.source),
    //     target: nodes.find((n) => n.id === d.target),
    // }));

    // const dag = dagStratify()(nodes).linkData(links);

    // const dag = dagStratify()(data);
    console.log(dag);
    const nodeRadius = 20;
    const layout = sugiyama()
        .decross(decrossOpt())
        .nodeSize((node) => [(node ? 3.6 : 0.25) * nodeRadius, 3 * nodeRadius]);
    console.log(layout);
    const { width, height } = layout(dag);
    console.log(width);
    console.log(height);

    const svgRef = useRef(null);
    const defsRef = useRef(null);

    useEffect(() => {
        // const svgSelection = d3.select("svg");

        if (!svgRef.current || !defsRef.current) return;

        const svgSelection = d3.select(svgRef.current);
        svgSelection.attr("viewBox", [0, 0, width, height].join(" "));

        const defs = svgSelection.append("defs");
        defsRef.current = defs;

        const steps = dag.size();
        console.log(steps);
        const interp = d3.interpolateRainbow;
        console.log(interp);
        const colorMap = new Map();
        // for (const [i, node] of dag.idescendants().entries()) {
        //     colorMap.set(node.data.id, interp(i / steps));
        // }
        const dagNodes = dag.descendants();
        dagNodes.forEach((node, i) => {
            colorMap.set(node.data.id, interp(i / steps));
        });
        console.log(colorMap);

        const line = d3
            .line()
            .curve(d3.curveCatmullRom)
            .x((d) => d.x)
            .y((d) => d.y);
        console.log(line);

        svgSelection
            .append("g")
            .selectAll("path")
            .data(dag.links())
            .enter()
            .append("path")
            .attr("d", ({ points }) => line(points))
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke", ({ source, target }) => {
                const gradId = encodeURIComponent(
                    `${source.data.id}--${target.data.id}`
                );
                const grad = defs
                    .append("linearGradient")
                    .attr("id", gradId)
                    .attr("gradientUnits", "userSpaceOnUse")
                    .attr("x1", source.x)
                    .attr("x2", target.x)
                    .attr("y1", source.y)
                    .attr("y2", target.y);
                grad.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", colorMap.get(source.data.id));
                grad.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", colorMap.get(target.data.id));
                return `url(#${gradId})`;
            });
        console.log(svgSelection);

        const nodes = svgSelection
            .append("g")
            .selectAll("g")
            .data(dag.descendants())
            .enter()
            .append("g")
            .attr("transform", ({ x, y }) => `translate(${x}, ${y})`);
        console.log(nodes);

        nodes
            .append("rect")
            .attr("width", nodeRadius * 2)
            .attr("height", nodeRadius * 2)
            .attr("x", -nodeRadius)
            .attr("y", -nodeRadius)
            .attr("fill", (n) => colorMap.get(n.data.id));

        nodes
            .append("text")
            .text((d) => d.data.id)
            .attr("font-weight", "bold")
            .attr("font-family", "sans-serif")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("fill", "white");

        console.log(nodes);
    }, [width, height]);
    console.log("svgSelection");
    // console.log(svgSelection);
    // svgSelection.attr("viewBox", [0, 0, width, height].join(" "));
    // const defs = svgSelection.append("defs");
    // console.log(defs);

    return (
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
            <defs ref={defsRef} />
        </svg>
    );
}

export default TestGround;
