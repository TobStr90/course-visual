import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";
import React from "react";
import Graph2DForceDirected from "./Graph2DForceDirected";

function Graph2DHierarchical({
    graph,
    onNodeClick,
    onNodeRightClick,
    dagMode,
    height,
    highlightLinks,
    highlightNodes,
    onLinkHover,
    onNodeHover,
    getDisplayLabel,
    getMouseOverLabel,
    getColor,
}) {
    const graphRef = useRef();

    useEffect(() => {
        const fg = graphRef.current;
        fg.d3Force("charge", d3.forceManyBody().strength(-100));
    });

    const getDagMode = () => {
        if (!dagMode) return null;
        else return dagMode;
    };

    const handleEngineTick = () => {
        // nodesRef.current.some((node) => {
        //     if (!node.x) {
        //         nodesRef.current = graph.nodes;
        //         return true;
        //     }
        // });

        //sort nodes into layers based on x value
        const nodesByLayer = {};
        graph.nodes.forEach((node) => {
            const layer = node.x;

            if (!nodesByLayer[layer]) nodesByLayer[layer] = [];

            nodesByLayer[layer].push(node);
        });

        //sort layers from left to right
        let sortedLayers = Object.entries(nodesByLayer)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([_, nodes]) => nodes);
        sortedLayers[sortedLayers.length] = [];

        //sort nodes into correct layer
        // sortedLayers.forEach((layer) => {
        for (const [layerIndex, layer] of sortedLayers.entries()) {
            layer.forEach((node) => {
                if (node.chapter) {
                    const chapter = node.chapter;
                    if (chapter && /^[0-9.]+$/.test(chapter)) {
                        const dots = chapter.split(".").length - 1;
                        const newLayer = 2 + dots;
                        const nodeIndex = layer.indexOf(node);
                        if (nodeIndex > -1) {
                            layer.splice(nodeIndex, 1);
                        }
                        if (sortedLayers[newLayer]) {
                            sortedLayers[newLayer].push(node);
                            node.x = sortedLayers[newLayer][0].x;
                        }
                    }
                }
                if (!node.unit) {
                    for (const link of node.childLinks) {
                        if (
                            link.source.x &&
                            link.target.x &&
                            link.source.x === link.target.x
                        ) {
                            const index = layer.indexOf(node);
                            if (index > -1) {
                                layer.splice(index, 1);
                            }
                            if (!sortedLayers[layerIndex + 1][0]) {
                                node.x +=
                                    node.x - sortedLayers[layerIndex - 1][0].x;
                            } else node.x = sortedLayers[layerIndex + 1][0].x;
                            sortedLayers[layerIndex + 1].push(node);
                            break;
                        }
                    }
                }
            });
        }

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

            //sort by order, chapter and id
            sortedNodesByLayer[layer] = sortedLayers[layer].sort((a, b) => {
                if (a.chapter && b.chapter) {
                    const chapterA = a.chapter.split(".");
                    const chapterB = b.chapter.split(".");
                    for (let i = 0; i < chapterA.length; i++) {
                        if (Number(chapterA[i]) < Number(chapterB[i]))
                            return -1;
                        if (Number(chapterB[i]) < Number(chapterA[i])) return 1;
                    }
                }

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

        console.log(graph.nodes);

        graph.nodes = Object.values(sortedNodesByLayer).flat();
    };

    const getGraph = () => {
        return (
            <ForceGraph2D
                // cooldownTime={2500}
                dagMode={getDagMode()}
                dagLevelDistance={200}
                height={height}
                ref={graphRef}
                graphData={graph}
                linkDirectionalParticles={4}
                linkDirectionalParticleColor={(link) => getColor(link.source)}
                linkDirectionalParticleSpeed={0.001}
                linkDirectionalParticleWidth={(link) =>
                    highlightLinks.has(link) ? 4 : 0
                }
                linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
                onEngineTick={handleEngineTick}
                onLinkHover={onLinkHover}
                onNodeClick={onNodeClick}
                onNodeHover={onNodeHover}
                onNodeRightClick={onNodeRightClick}
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
