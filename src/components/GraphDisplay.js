import { React, useCallback, useEffect, useState, useMemo } from "react";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Graph2D from "./Graph2D";
import Graph2DHierarchical from "./Graph2DHierarchical";
import Graph3D from "./Graph3D";
import GraphQuiz from "./GraphQuiz";
import NodeInfo from "./NodeInfo";
import ProgressBar from "react-bootstrap/ProgressBar";
import SearchBar from "./SearchBar";
import TestGround from "./TestGround";

import graphDataJson from "../assets/graph.json";

function GraphDisplay() {
    const savedGraphData = localStorage.getItem("graphData");

    var graphData = savedGraphData ? JSON.parse(savedGraphData) : graphDataJson;

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
        // }, [graphData]);
    }, []);

    const getNode = (node) => {
        if (nodesById[node]) return nodesById[node];
        else if (nodesById[node.id]) return nodesById[node.id];
        return null;
    };

    var visibleNodesCount = 0;

    const getGraph = () => {
        const visibleNodes = new Set();
        const visibleLinks = new Set();
        const traverseGraph = (node = getNode(rootId)) => {
            if (visibleNodes.has(node)) return;

            visibleNodes.add(node);
            if (node.collapsed) {
                return;
            }

            node.childLinks.forEach((link) => {
                visibleLinks.add(link);
            });

            node.childLinks
                .map((link) =>
                    typeof link.source === "object"
                        ? link.source
                        : getNode(link.source)
                )
                .forEach(traverseGraph);

            node.childLinks
                .map((link) =>
                    typeof link.target === "object"
                        ? link.target
                        : getNode(link.target)
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

        visibleNodesCount = visibleNodes.size;

        const nodes = Array.from(visibleNodes);
        nodes.sort((a, b) => a.id.localeCompare(b.id));

        let order = 0;
        nodes.map((node) => {
            node.order = order++;
        });
        // nodes.sort((a, b) => b.id.localeCompare(a.id));

        const links = Array.from(visibleLinks);
        links.sort((a, b) => {
            if (a.source < b.source) return -1;
            if (a.source > b.source) return 1;
            if (a.target < b.target) return -1;
            if (a.target > b.target) return 1;
            return 0;
        });

        return {
            // nodes: Array.from(visibleNodes),
            nodes: nodes,
            // links: Array.from(visibleLinks),
            links: links,
        };
    };

    const [graph, setGraph] = useState(getGraph());

    const showPath = (node) => {
        node.collapsed = false;

        if (node.id === rootId.id) return;

        if (node.chapter) {
            const lastDotIndex = node.chapter.lastIndexOf(".");
            if (lastDotIndex >= 0) {
                const previousChapter = node.chapter.slice(0, lastDotIndex);
                node.childLinks.forEach((link) => {
                    const source = getNode(link.source);
                    if (source && source !== node) {
                        if (
                            source.chapter &&
                            source.chapter === previousChapter
                        ) {
                            showPath(source);
                        }
                    }
                    const target = getNode(link.target);
                    if (target && target !== node) {
                        if (
                            target.chapter &&
                            target.chapter === previousChapter
                        ) {
                            showPath(target);
                        }
                    }
                });
            } else {
                node.childLinks.forEach((link) => {
                    const source = getNode(link.source);
                    if (source && source !== node) {
                        if (
                            source.chapter &&
                            source.chapter.includes("Kurseinheit")
                        ) {
                            showPath(source);
                        }
                    }
                    const target = getNode(link.target);
                    if (target && target !== node) {
                        if (
                            target.chapter &&
                            target.chapter.includes("Kurseinheit")
                        ) {
                            showPath(target);
                        }
                    }
                });
            }
        } else {
            node.childLinks.forEach((link) => {
                const source = getNode(link.source);
                if (source && source !== node) {
                    if (source.chapter) {
                        showPath(source);
                    }
                }
                const target = getNode(link.target);
                if (target && target !== node) {
                    if (target.chapter) {
                        showPath(target);
                    }
                }
            });
        }
    };

    const handleOnSelect = (item) => {
        const node = getNode(item.id);
        if (node.childLinks && node.childLinks.length) {
            showPath(node);

            const rootNode = getNode(rootId);
            rootNode.collapsed = false;

            setGraph(getGraph());
        }
    };

    const handleNodeClick = (node) => {
        if (node.childLinks && node.childLinks.length) {
            node.collapsed = !node.collapsed;
            setGraph(getGraph());
        }
    };

    const [showNodeInfo, setShowNodeInfo] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);

    const handleNodeRightClick = (node) => {
        if (selectedNode && selectedNode.id === node.id) {
            setSelectedNode(null);
            setShowNodeInfo(false);
        } else {
            setSelectedNode(node);
            setShowNodeInfo(true);
        }
    };

    const saveDataLocally = () => {
        const nodes = [];
        const links = [];
        const links_dict = {};
        graphData.nodes.forEach((node) => {
            nodes.push({
                id: node.id,
                name: node.name,
                unit: node.unit,
                chapter: node.chapter,
                group: node.group,
                notes: node.notes,
            });
            links_dict[node.id] = [];
        });
        graphData.nodes.forEach((node) => {
            if (node.childLinks && node.childLinks.length > 0) {
                node.childLinks.forEach((link) => {
                    const source = link.source.id
                        ? link.source.id
                        : link.source;
                    const target = link.target.id
                        ? link.target.id
                        : link.target;
                    if (
                        !links_dict[source].includes(target) ||
                        !links_dict[target].includes(source)
                    ) {
                        links.push({ source: source, target: target });
                        links_dict[source].push(target);
                    }
                });
            }
        });
        localStorage.setItem(
            "graphData",
            JSON.stringify({ nodes: nodes, links: links })
        );
    };

    const handleNodeInfoSave = (updatedNode) => {
        var node = getNode(updatedNode);
        node.name = updatedNode.name;
        node.chapter = updatedNode.chapter;
        node.unit = updatedNode.unit;
        node.startpage = updatedNode.startpage;
        node.notes = updatedNode.notes;

        saveDataLocally();

        setGraph(getGraph());
        setSelectedNode(null);
        setShowNodeInfo(false);
    };

    const handleNodeInfoClose = () => {
        setSelectedNode(null);
        setShowNodeInfo(false);
    };

    // const [displayOption, setDisplayOption] = useState("2D-ForceDirected");
    const [displayOption, setDisplayOption] = useState("2D-Hierarchical");

    const handleDisplayOptionChange = (selectedOption) => {
        setDisplayOption(selectedOption);
    };

    const collapseAll = () => {
        graphData.nodes.forEach((node) => {
            node.collapsed = true;
            setGraph(getGraph());
        });
    };

    const expandAll = () => {
        graphData.nodes.forEach((node) => {
            node.collapsed = false;
            setGraph(getGraph());
        });
    };

    const resetGraphData = () => {
        localStorage.removeItem("graphData");
        graphData = graphDataJson;
    };

    const getProgress = () => {
        return (visibleNodesCount / graphData.nodes.length) * 100;
    };

    const getLabel = () => {
        var length = graphData.nodes.length;
        return `${visibleNodesCount}/${length} (${Math.round(
            (visibleNodesCount / length) * 100
        )}%)`;
    };

    const [level, setLevel] = useState(1);

    const [finished, setFinished] = useState(false);

    const getRandomQuiz = (level) => {
        const startNode =
            graphData.nodes[Math.floor(Math.random() * graphData.nodes.length)];

        const possibleNeighbours = new Set();
        possibleNeighbours.add(getNode(startNode));
        const nodes = new Set();
        const num = level * 2 + 3;
        for (let i = 1; i <= num; i++) {
            if (possibleNeighbours.length === 0) break;

            const possibleNeighboursArr = Array.from(possibleNeighbours);
            const randomNode =
                possibleNeighboursArr[
                    Math.floor(Math.random() * possibleNeighboursArr.length)
                ];
            const node = getNode(randomNode);

            nodes.add(node);
            node.childLinks.forEach((link) => {
                const source = getNode(link.source);
                if (!nodes.has(source)) possibleNeighbours.add(source);
                const target = getNode(link.target);
                if (!nodes.has(target)) possibleNeighbours.add(target);
            });
            possibleNeighbours.delete(node);
        }

        return { nodes: Array.from(nodes), links: [] };
    };

    const [quizGraph, setQuizGraph] = useState(getRandomQuiz(level));

    const [maxQuizGraphLinks, setMaxQuizGraphLinks] = useState(0);

    const quizGraphNodeIds = quizGraph.nodes.map((node) => node.id).join(",");

    useEffect(() => {
        var nodeIds = new Set();
        quizGraph.nodes.forEach((node) => {
            nodeIds.add(node.id);
        });

        var count = 0;
        quizGraph.nodes.forEach((node) => {
            node.childLinks.forEach((link) => {
                if (node.id === link.source && nodeIds.has(link.target))
                    count++;
            });
        });
        setMaxQuizGraphLinks(count);
    }, [quizGraphNodeIds]);

    const handleQuizGraphUpdate = (links) => {
        const newGraph = {
            nodes: quizGraph.nodes,
            links: quizGraph.links.concat(links),
        };

        setQuizGraph(newGraph);
    };

    const updateExperience = () => {
        if (experience + 10 === nextLevelExperience) {
            setLevel(level + 1);
            setExperience(0);
        } else setExperience(experience + 10);
    };

    useEffect(() => {
        if (quizGraph.links.length > 0) {
            updateExperience();
        }

        if (
            quizGraph.links.length > 0 &&
            quizGraph.links.length >= maxQuizGraphLinks
        )
            setFinished(true);
    }, [quizGraph.links.length]);

    const handleNodeClickQuiz = (links) => {
        handleQuizGraphUpdate(links);
    };

    const getQuizProgress = () => {
        return (quizGraph.links.length / maxQuizGraphLinks) * 100;
    };

    const getQuizLabel = () => {
        var length = quizGraph.links.length;
        return `${length}/${maxQuizGraphLinks} (${Math.round(
            (length / maxQuizGraphLinks) * 100
        )}%)`;
    };

    const newQuiz = () => {
        setFinished(false);
        setQuizGraph(getRandomQuiz(level));
    };

    const [experience, setExperience] = useState(0);

    const nextLevelExperience = () => {
        return 50 * 2 ** level;
    };

    const getExperienceProgress = () => {
        return (experience / nextLevelExperience()) * 100;
    };

    const getExperienceLabel = () => {
        return `${experience} / ${nextLevelExperience()}`;
    };

    return (
        <div>
            <Dropdown
                handleDisplayOptionChange={handleDisplayOptionChange}
            ></Dropdown>
            {displayOption !== "Quiz" && (
                <div>
                    <div>
                        <ProgressBar
                            now={getProgress()}
                            label={getLabel()}
                        ></ProgressBar>
                    </div>
                    <div>
                        <Button
                            text="Collapse all"
                            handleClick={collapseAll}
                        ></Button>
                        <Button
                            text="Expand all"
                            handleClick={expandAll}
                        ></Button>
                        <Button
                            text="Reset local graphdata"
                            handleClick={resetGraphData}
                        ></Button>
                    </div>
                    <SearchBar
                        items={graphData.nodes}
                        handleOnSelect={handleOnSelect}
                    ></SearchBar>{" "}
                </div>
            )}
            {displayOption === "Quiz" && (
                <div>
                    <div>
                        <div style={{ marginBottom: "5px" }}>
                            Quiz Progress
                            <ProgressBar
                                now={getQuizProgress()}
                                label={getQuizLabel()}
                            ></ProgressBar>
                        </div>
                        <div>
                            Experience
                            <ProgressBar
                                now={getExperienceProgress()}
                                label={getExperienceLabel()}
                            ></ProgressBar>
                        </div>
                    </div>
                    {finished && (
                        <div>
                            <Button
                                text="New quiz"
                                handleClick={newQuiz}
                            ></Button>
                        </div>
                    )}
                    {!finished && <div>Click on nodes to connect them</div>}
                </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                    id={"Graph"}
                    style={{
                        display: "flex",
                        flexGrow: 1,
                        position: "relative",
                    }}
                >
                    {displayOption === "2D-ForceDirected" && (
                        <div id={"Graph2D"}>
                            <Graph2D
                                dagMode=""
                                onNodeClick={handleNodeClick}
                                onNodeRightClick={handleNodeRightClick}
                                graph={graph}
                                setGraph={setGraph}
                            />
                        </div>
                    )}
                    {displayOption === "2D-Hierarchical" && (
                        <div id={"Graph2DHierarchical"}>
                            <Graph2DHierarchical
                                dagMode="lr"
                                onNodeClick={handleNodeClick}
                                onNodeRightClick={handleNodeRightClick}
                                graph={graph}
                                setGraph={setGraph}
                            />
                        </div>
                    )}
                    {displayOption === "3D" && (
                        <div id={"Graph3D"}>
                            <Graph3D
                                onNodeClick={handleNodeClick}
                                onNodeRightClick={handleNodeRightClick}
                                graph={graph}
                                setGraph={setGraph}
                            />
                        </div>
                    )}
                    {displayOption === "Quiz" && (
                        <div id={"GraphQuiz"}>
                            <GraphQuiz
                                onNodeClick={handleNodeClickQuiz}
                                // onNodeRightClick={handleNodeRightClick}
                                graph={quizGraph}
                                setGraph={setQuizGraph}
                            />
                        </div>
                    )}
                    {showNodeInfo && (
                        <div
                            style={{
                                position: "absolute",
                                right: "0",
                                top: "0",
                                width: "20%",
                                zIndex: "1",
                                overflow: "hidden",
                            }}
                        >
                            <NodeInfo
                                key={selectedNode.id}
                                node={selectedNode}
                                onSave={handleNodeInfoSave}
                                onClose={handleNodeInfoClose}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GraphDisplay;