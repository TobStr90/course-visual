import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3-force";
import React from "react";
import SpriteText from "three-spritetext";

function PrunedGraph3D() {
    const graphData = require("../assets/graph.json");

    const rootId = "Objektorientierte Programmierung";

    const nodesById = useMemo(() => {
        const nodesById = Object.fromEntries(
            graphData.nodes.map((node) => [node.id, node])
        );

        graphData.nodes.forEach((node) => {
            node.collapsed = node.id !== rootId;
            node.childLinks = [];
        });
        graphData.links.forEach((link) => {
            nodesById[link.source].childLinks.push(link);
            nodesById[link.target].childLinks.push(link);
        });

        return nodesById;
    }, [graphData]);

    const getPrunedGraph = () => {
        const visibleNodes = new Set();
        const visibleLinks = [];
        const traverseGraph = (node = nodesById[rootId]) => {
            if (visibleNodes.has(node)) return;

            visibleNodes.add(node);
            if (node.collapsed) {
                return;
            }

            visibleLinks.push(...node.childLinks);
            node.childLinks
                .map((link) =>
                    typeof link.target === "object"
                        ? link.target
                        : nodesById[link.target]
                )
                .forEach(traverseGraph);
        };
        traverseGraph();

        return { nodes: Array.from(visibleNodes), links: visibleLinks };
    };

    const [prunedGraph, setPrunedGraph] = useState(getPrunedGraph());

    const handleNodeClick = useCallback((node) => {
        if (node.childLinks && node.childLinks.length) {
            node.collapsed = !node.collapsed;
            setPrunedGraph(getPrunedGraph());
        }
    }, []);

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
        console.log(link);
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
            highlightLinks.add(link);
            link.source.childLinks
                .filter(
                    (childLink) =>
                        childLink.source === link.target &&
                        link.source === childLink.target
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
                graphData={prunedGraph}
                // linkDirectionalParticles={4}
                // linkDirectionalParticleColor={(link) => getColor(link.source)}
                // linkDirectionalParticleSpeed={0.001}
                // linkDirectionalParticleWidth={(link) =>
                //     highlightLinks.has(link) ? 4 : 0
                // }
                // linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
                // onLinkHover={handleLinkHover}
                onNodeClick={handleNodeClick}
                // onNodeHover={handleNodeHover}
                nodeAutoColorBy={"group"}
                nodeThreeObject={(node) => {
                    const label = node.chapter ? node.chapter : node.id;
                    const sprite = new SpriteText(label);
                    sprite.color = getColor(node);
                    sprite.textHeight = 8;
                    return sprite;
                }}
            />
        );
    };

    if (!graphData) {
        return <div>Loading data...</div>;
    }

    return getGraph();
}

export default PrunedGraph3D;
