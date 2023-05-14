import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";
import React from "react";

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
    nodeCanvasObject,
    nodePointerAreaPaint,
}) {
    const graphRef = useRef();

    useEffect(() => {
        const fg = graphRef.current;
        fg.d3Force("charge", d3.forceManyBody().strength(-150));
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

        const getLayer = (chapter) => {
            if (!chapter) return 0;

            if (!/^[0-9.]+$/.test(chapter)) return 1;

            const dots = chapter.split(".").length - 1;
            return 2 + dots;
        };

        const swapLayer = (oldLayer, newLayer, layers, node) => {
            const nodeIndex = layers[oldLayer].indexOf(node);
            if (nodeIndex > -1) layers[oldLayer].splice(nodeIndex, 1);

            if (layers[newLayer]) {
                layers[newLayer].push(node);
                const x = layers[newLayer][0].x;
                node.x = x;
                node.fx = x;
            } else {
                while (layers.length <= newLayer) layers[layers.length] = [];
                const layerDiff = layers[1][0].x - layers[0][0].x;
                layers[newLayer].push(node);
                const x = layers[0][0].x + layerDiff * newLayer;
                node.x = x;
                node.fx = x;
            }
        };

        //sort nodes into correct layer
        for (const [layerIndex, layer] of sortedLayers.entries()) {
            layer.forEach((node) => {
                if (node.chapter) {
                    const newLayer = getLayer(node.chapter);
                    if (newLayer > layerIndex) {
                        swapLayer(layerIndex, newLayer, sortedLayers, node);
                    }
                }
                if (!node.chapter && !node.unit) {
                    let maxLayer = layerIndex;
                    node.childLinks.forEach((childLink) => {
                        if (childLink.source.x) {
                            const newLayer =
                                getLayer(childLink.source.chapter) + 1;
                            maxLayer = Math.max(maxLayer, newLayer);
                        }
                    });
                    if (maxLayer > layerIndex)
                        swapLayer(layerIndex, maxLayer, sortedLayers, node);
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

        graph.nodes = Object.values(sortedNodesByLayer).flat();
    };

    const getDagLevelDistance = () => {
        let maxLength = 10;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        graph.nodes.forEach((node) => {
            const width = context.measureText(getDisplayLabel(node)).width;
            maxLength = Math.max(maxLength, width);
        });

        return maxLength + 10;
    };

    const getGraph = () => {
        return (
            <ForceGraph2D
                // cooldownTime={2500}
                dagMode={getDagMode()}
                dagLevelDistance={getDagLevelDistance()}
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
                nodeCanvasObject={nodeCanvasObject}
                nodeLabel={getMouseOverLabel}
                nodePointerAreaPaint={nodePointerAreaPaint}
            ></ForceGraph2D>
        );
    };

    return getGraph();
}

export default Graph2DHierarchical;
