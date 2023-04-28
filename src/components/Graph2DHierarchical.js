import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";
import React from "react";
import Graph2D from "./Graph2D";

function Graph2DHierarchical(props) {
    const handleNodeClick = (node) => {
        props.onNodeClick(node);
    };

    const handleNodeRightClick = (node) => {
        props.onNodeRightClick(node);
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
                return "Black";
        }
    };

    const getDisplayLabel = (node) => {
        return node.chapter ? node.chapter : node.name;
    };

    const getMouseOverLabel = (node) => {
        return node.name;
    };

    const graphRef = useRef();

    const [height, setHeight] = useState(0);

    const getHeight = () => {
        const graphContainer = document.getElementById("Graph2DHierarchical");
        if (!graphContainer) return 0;

        const graphContainerTop = graphContainer.getBoundingClientRect().top;

        const height = window.innerHeight - graphContainerTop;

        return height - 5;
    };

    useEffect(() => {
        const updateHeight = () => {
            const newHeight = getHeight();
            if (newHeight !== height) {
                setHeight(newHeight);
            }
        };

        window.addEventListener("resize", updateHeight);
        updateHeight();

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, [height]);

    const getDagMode = () => {
        if (!props.dagMode) return null;
        else return props.dagMode;
    };

    const handleEngineTick = () => {
        // nodesRef.current.some((node) => {
        //     if (!node.x) {
        //         nodesRef.current = props.graph.nodes;
        //         return true;
        //     }
        // });

        //sort nodes into layers based on x value
        const nodesByLayer = {};
        props.graph.nodes.forEach((node) => {
            const layer = node.x;

            if (!nodesByLayer[layer]) nodesByLayer[layer] = [];

            nodesByLayer[layer].push(node);
        });
        console.log("nodesByLayer");
        console.log(nodesByLayer);

        //sort layers from left to right
        const sortedLayers = Object.entries(nodesByLayer)
            .sort((a, b) => Number(a[0]) - Number(b[0])) // sort by key
            .map(([_, nodes]) => nodes); // extract values
        console.log("sortedLayers");
        console.log(sortedLayers);

        //sort nodes in each layer
        const sortedNodesByLayer = {};
        sortedNodesByLayer[0] = sortedLayers[0].sort((a, b) =>
            a.id.localeCompare(b.id)
        );
        for (let i = 0; i < sortedNodesByLayer[0].length; i++)
            sortedNodesByLayer[0][i].order = i + 1;

        for (let layer = 1; layer < sortedLayers.length; layer++) {
            //calculate order based on parentnodes
            sortedLayers[layer].forEach((node) => {
                let sum = 0;
                let num = 0;
                node.childLinks.forEach((link) => {
                    if (link.target.id === node.id) {
                        sum += link.source.order;
                        num += 1;
                    }
                });
                node.order = sum / num;
            });
            console.log("sortedLayers[layer]");
            console.log(sortedLayers[layer]);

            //sort by order, chapter and id
            sortedNodesByLayer[layer] = sortedLayers[layer].sort((a, b) => {
                if (a.order === b.order) {
                    if (a.chapter && b.chapter) {
                        const chapterA = Number(a.chapter.split(".").pop());
                        const chapterB = Number(b.chapter.split(".").pop());
                        return chapterA - chapterB;
                    }
                    if (a.chapter) return -1;
                    if (b.chapter) return 1;

                    return a.id.localeCompare(b.id);
                }
                return a.order - b.order;
            });
            console.log("sortedNodesByLayer[layer]");
            console.log(sortedNodesByLayer[layer]);

            for (let i = 0; i < sortedNodesByLayer[layer].length; i++)
                sortedNodesByLayer[layer][i].order = i + 1;
        }

        //get all y values in a layer and distribute them to the nodes in order
        Object.values(sortedNodesByLayer).forEach((layer) => {
            const yValues = [];
            layer.forEach((node) => {
                yValues.push(node.y);
            });

            const sortedYValues = yValues.sort((a, b) => a - b);

            for (let i = 0; i < sortedYValues.length; i++)
                layer[i].y = sortedYValues[i];
        });

        props.graph.nodes = Object.values(sortedNodesByLayer).flat();
    };

    const getGraph = () => {
        return (
            <ForceGraph2D
                dagMode={getDagMode()}
                dagLevelDistance={100}
                height={getHeight()}
                ref={graphRef}
                graphData={props.graph}
                // graphData={{ nodes: nodesRef.current, links: linksRef.current }}
                linkDirectionalParticles={4}
                linkDirectionalParticleColor={(link) => getColor(link.source)}
                linkDirectionalParticleSpeed={0.001}
                linkDirectionalParticleWidth={(link) =>
                    highlightLinks.has(link) ? 4 : 0
                }
                linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
                onEngineTick={handleEngineTick}
                onLinkHover={handleLinkHover}
                onNodeClick={handleNodeClick}
                onNodeHover={handleNodeHover}
                onNodeRightClick={handleNodeRightClick}
                nodeAutoColorBy={"group"}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = getDisplayLabel(node);
                    const fontSize = 16 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [
                        textWidth * 1.1,
                        fontSize * 1.1,
                    ].map((n) => n + fontSize * 0.2);

                    // ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                    ctx.fillStyle = node.expandable
                        ? "rgba(11, 156, 49, 0.2)"
                        : "rgba(239, 239, 240, 0.8)";

                    ctx.fillRect(
                        node.x - bckgDimensions[0] / 2,
                        node.y - bckgDimensions[1] / 2,
                        ...bckgDimensions
                    );

                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = getColor(node);
                    ctx.fillText(label, node.x, node.y);

                    node.__bckgDimensions = bckgDimensions;

                    if (highlightNodes.has(node)) {
                        ctx.strokeStyle = getColor(node);
                        ctx.lineWidth = fontSize / 15;
                        ctx.strokeRect(
                            node.x - bckgDimensions[0] / 2,
                            node.y - bckgDimensions[1] / 2,
                            ...bckgDimensions
                        );
                    }
                }}
                nodeLabel={getMouseOverLabel}
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
            ></ForceGraph2D>
        );
    };

    return getGraph();
}

export default Graph2DHierarchical;
