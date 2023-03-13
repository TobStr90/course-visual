import { React, useCallback, useState, useMemo } from "react";
import PrunedGraph2D from "./PrunedGraph2D copy";
import Searchbar from "./Searchbar";

function TestGround() {
    const graphData = require("../assets/graph.json");

    const rootId = "Objektorientierte Programmierung";

    const nodesById = useMemo(() => {
        const nodesById = Object.fromEntries(
            graphData.nodes.map((node) => [node.id, node])
        );

        graphData.nodes.forEach((node) => {
            node.collapsed = node.id !== rootId;
            node.childLinks = [];
            node.expandable = false;
        });
        graphData.links.forEach((link) => {
            if (!nodesById[link.source]) {
                window.location.reload();
            }
            nodesById[link.source].childLinks.push(link);
            nodesById[link.target].childLinks.push(link);
        });

        return nodesById;
    }, [graphData]);

    const getPrunedGraph = () => {
        const visibleNodes = new Set();
        const visibleLinks = new Set();
        const traverseGraph = (node = nodesById[rootId]) => {
            if (visibleNodes.has(node)) return;

            visibleNodes.add(node);
            if (node.collapsed) {
                return;
            }

            // visibleLinks.add(...node.childLinks);
            node.childLinks.forEach((link) => {
                visibleLinks.add(link);
            });

            node.childLinks
                .map((link) =>
                    typeof link.target === "object"
                        ? link.target
                        : nodesById[link.target]
                )
                .forEach(traverseGraph);
        };
        traverseGraph();

        visibleNodes.forEach((node) => {
            var expandable = false;
            if (node.collapsed && node.childLinks) {
                node.childLinks.forEach((link) => {
                    if (!visibleLinks.has(link)) {
                        expandable = true;
                    }
                });
            }
            node.expandable = expandable;
        });

        console.log(visibleLinks);

        return {
            nodes: Array.from(visibleNodes),
            links: Array.from(visibleLinks),
        };
    };

    const [prunedGraph, setPrunedGraph] = useState(getPrunedGraph());

    const showPath = (node) => {
        node.collapsed = false;

        if (node.id === rootId.id) return;

        if (node.chapter) {
            const lastDotIndex = node.chapter.lastIndexOf(".");
            if (lastDotIndex >= 0) {
                const previousChapter = node.chapter.slice(0, lastDotIndex);
                node.childLinks.forEach((link) => {
                    const neighbour = nodesById[link.target];
                    if (neighbour && neighbour !== node) {
                        if (
                            neighbour.chapter &&
                            neighbour.chapter === previousChapter
                        ) {
                            showPath(neighbour);
                        }
                    }
                });
            } else {
                node.childLinks.forEach((link) => {
                    const neighbour = nodesById[link.target];
                    if (neighbour && neighbour !== node) {
                        if (
                            neighbour.chapter &&
                            neighbour.chapter.includes("Kurseinheit")
                        ) {
                            showPath(neighbour);
                        }
                    }
                });
            }
        } else {
            node.childLinks.forEach((link) => {
                const neighbour = nodesById[link.target];
                if (neighbour && neighbour !== node) {
                    if (neighbour.chapter) {
                        showPath(neighbour);
                    }
                }
            });
        }
    };

    const handleOnSelect = useCallback((item) => {
        const node = nodesById[item.id];
        if (node.childLinks && node.childLinks.length) {
            showPath(node);

            setPrunedGraph(getPrunedGraph());
        }
    }, []);

    const handleNodeClick = useCallback((node) => {
        if (node.childLinks && node.childLinks.length) {
            node.collapsed = !node.collapsed;
            setPrunedGraph(getPrunedGraph());
        }
    }, []);

    return (
        <div>
            <Searchbar
                items={graphData.nodes}
                handleOnSelect={handleOnSelect}
            ></Searchbar>{" "}
            <PrunedGraph2D
                onNodeClick={handleNodeClick}
                prunedGraph={prunedGraph}
                setPrunedGraph={setPrunedGraph}
            ></PrunedGraph2D>
        </div>
    );
}

export default TestGround;
