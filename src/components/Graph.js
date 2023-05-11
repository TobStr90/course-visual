import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";
import React from "react";
import Graph2DForceDirected from "./Graph2DForceDirected";
import Graph3D from "./Graph3D";
import Graph2DHierarchical from "./Graph2DHierarchical";
import GraphQuiz from "./GraphQuiz";

function Graph({
    graph,
    onNodeClick,
    onNodeRightClick,
    mode,
    height,
    onQuizNodeClick,
    quizGraph,
}) {
    const handleNodeClick = (node) => {
        onNodeClick(node);
    };

    const handleNodeRightClick = (node) => {
        onNodeRightClick(node);
    };

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
                if (mode === "3D") return "white";
                return "Black";
        }
    };

    const getDisplayLabel = (node) => {
        return node.chapter ? node.chapter : node.name;
    };

    const getMouseOverLabel = (node) => {
        return node.name;
    };

    const getGraph = () => {
        switch (mode) {
            case "2D-ForceDirected":
                return (
                    <div id={"2D-ForceDirected"}>
                        <Graph2DForceDirected
                            graph={graph}
                            onNodeClick={handleNodeClick}
                            onNodeRightClick={handleNodeRightClick}
                            height={height}
                            highlightLinks={highlightLinks}
                            highlightNodes={highlightNodes}
                            onLinkHover={handleLinkHover}
                            onNodeHover={handleNodeHover}
                            getDisplayLabel={getDisplayLabel}
                            getMouseOverLabel={getMouseOverLabel}
                            getColor={getColor}
                        />
                    </div>
                );
            case "2D-Hierarchical":
                return (
                    <div id={"2D-Hierarchical"}>
                        <Graph2DHierarchical
                            graph={graph}
                            dagMode={"lr"}
                            onNodeClick={handleNodeClick}
                            onNodeRightClick={handleNodeRightClick}
                            height={height}
                            highlightLinks={highlightLinks}
                            highlightNodes={highlightNodes}
                            onLinkHover={handleLinkHover}
                            onNodeHover={handleNodeHover}
                            getDisplayLabel={getDisplayLabel}
                            getMouseOverLabel={getMouseOverLabel}
                            getColor={getColor}
                        />
                    </div>
                );
            case "3D":
                return (
                    <div id={"3D"}>
                        <Graph3D
                            graph={graph}
                            onNodeClick={handleNodeClick}
                            onNodeRightClick={handleNodeRightClick}
                            height={height}
                            getColor={getColor}
                        />
                    </div>
                );
            case "Quiz":
                return (
                    <div id={"GraphQuiz"}>
                        <GraphQuiz
                            graph={quizGraph}
                            onNodeClick={onQuizNodeClick}
                            height={height}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return getGraph();
}

export default Graph;
