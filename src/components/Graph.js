import { React, useCallback, useEffect, useState, useMemo } from "react";
import Button from "./Button";
import CheckboxWithText from "./CheckboxWithText";
import Dropdown from "./Dropdown";
import Filter from "./Filters";
import GraphDisplay from "./GraphDisplay.js";
import HelpWindow from "./HelpWindow";
import NodeInfo from "./NodeInfo";
import ProgressBar from "react-bootstrap/ProgressBar";
import SearchBar from "./SearchBar";
import SuccessWindow from "./SuccessWindow";

import "./Graph.css";

import graphDataJson from "../assets/graph.json";

const units = new Set([
    "Kurseinheit 1",
    "Kurseinheit 2",
    "Kurseinheit 3",
    "Kurseinheit 4",
    "Kurseinheit 5",
    "Kurseinheit 6",
    "Kurseinheit 7",
    "Vorwort",
]);

function Graph() {
    const savedGraphData = localStorage.getItem("graphData");

    const [graphData, setGraphData] = useState(
        savedGraphData ? JSON.parse(savedGraphData) : graphDataJson
    );

    const rootId = "Objektorientierte Programmierung";

    const [notCollapsedNodes, setNotCollapsedNodes] = useState(
        new Set([rootId])
    );

    const nodesById = useMemo(() => {
        if (!graphData) return;

        const nodesById = Object.fromEntries(
            graphData.nodes.map((node) => [node.id, node])
        );

        graphData.nodes.forEach((node) => {
            node.collapsed = !notCollapsedNodes.has(node.id);
            node.childLinks = [];
            node.expandable = false;
        });
        graphData.links.forEach((link) => {
            const source = nodesById[link.source];
            const target = nodesById[link.target];

            source.childLinks.push(link);
            target.childLinks.push(link);
        });

        return nodesById;
    }, [graphData]);

    const getNode = (node) => {
        if (nodesById[node]) return nodesById[node];
        else if (nodesById[node.id]) return nodesById[node.id];
        return null;
    };

    const [activeUnits, setActiveUnits] = useState(new Set(units));

    const changeFilter = (newFilter) => {
        setActiveUnits(newFilter);
    };

    useEffect(() => {
        setGraph(getGraph());
        setQuizGraph(getRandomQuiz(level));
    }, [activeUnits]);

    var visibleNodesCount = 0;

    const isActiveNode = (node) => {
        if (!node) return false;
        return !node.unit || node.unit === "Kurs" || activeUnits.has(node.unit);
    };

    const [startNodes, setStartNodes] = useState([getNode(rootId)]);

    const getGraph = () => {
        const visibleNodes = new Set();
        const visibleLinks = new Set();
        const traverseGraph = (node = getNode(rootId)) => {
            if (visibleNodes.has(node) || !isActiveNode(node)) return;

            visibleNodes.add(node);
            if (node.collapsed) return;

            node.childLinks.forEach((link) => {
                if (
                    isActiveNode(getNode(link.source)) &&
                    isActiveNode(getNode(link.target))
                )
                    visibleLinks.add(link);
            });

            node.childLinks.forEach((link) => {
                const source = getNode(link.source);
                traverseGraph(source);
                const target = getNode(link.target);
                traverseGraph(target);
            });
        };

        if (startNodes && startNodes.length > 0)
            startNodes.forEach((startNode) => {
                const node = getNode(startNode);
                traverseGraph(node);
            });
        else traverseGraph();

        visibleNodes.forEach((visibleNode) => {
            var expandable = false;
            if (visibleNode.collapsed && visibleNode.childLinks) {
                visibleNode.childLinks.forEach((link) => {
                    if (
                        !visibleLinks.has(link) &&
                        isActiveNode(getNode(link.source)) &&
                        isActiveNode(getNode(link.target))
                    ) {
                        expandable = true;
                    }
                });
            }
            visibleNode.expandable = expandable;
        });

        visibleNodesCount = visibleNodes.size;

        const nodes = Array.from(visibleNodes);
        nodes.sort((a, b) => a.id.localeCompare(b.id));

        let order = 0;
        nodes.map((node) => {
            node.order = order++;
        });

        const links = Array.from(visibleLinks);
        links.sort((a, b) => {
            if (a.source < b.source) return -1;
            if (a.source > b.source) return 1;
            if (a.target < b.target) return -1;
            if (a.target > b.target) return 1;
            return 0;
        });

        return {
            nodes: nodes,
            links: links,
        };
    };

    const [graph, setGraph] = useState(getGraph());

    useEffect(() => {
        setGraph(getGraph());
    }, [notCollapsedNodes]);

    useEffect(() => {
        setGraph(getGraph());
    }, [nodesById]);

    const changeCollapsed = (node, value) => {
        node.collapsed = value;
        const newNotCollapsedNodes = new Set([...notCollapsedNodes]);
        if (value) newNotCollapsedNodes.delete(node.id);
        else newNotCollapsedNodes.add(node.id);
        setNotCollapsedNodes(newNotCollapsedNodes);
    };

    const showPath = (node, newNotCollapsedNodes = new Set()) => {
        node.collapsed = false;
        newNotCollapsedNodes.add(node.id);

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
                        )
                            newNotCollapsedNodes = [
                                ...newNotCollapsedNodes,
                                ...showPath(source),
                            ];
                    }
                    const target = getNode(link.target);
                    if (target && target !== node) {
                        if (
                            target.chapter &&
                            target.chapter === previousChapter
                        )
                            newNotCollapsedNodes = [
                                ...newNotCollapsedNodes,
                                ...showPath(target),
                            ];
                    }
                });
            } else {
                node.childLinks.forEach((link) => {
                    const source = getNode(link.source);
                    if (source && source !== node) {
                        if (
                            source.chapter &&
                            source.chapter.includes("Kurseinheit")
                        )
                            newNotCollapsedNodes = [
                                ...newNotCollapsedNodes,
                                ...showPath(source),
                            ];
                    }
                    const target = getNode(link.target);
                    if (target && target !== node) {
                        if (
                            target.chapter &&
                            target.chapter.includes("Kurseinheit")
                        )
                            newNotCollapsedNodes = [
                                ...newNotCollapsedNodes,
                                ...showPath(target),
                            ];
                    }
                });
            }
        } else {
            node.childLinks.forEach((link) => {
                const source = getNode(link.source);
                if (source && source !== node) {
                    if (source.chapter)
                        newNotCollapsedNodes = [
                            ...newNotCollapsedNodes,
                            ...showPath(source),
                        ];
                }
                const target = getNode(link.target);
                if (target && target !== node) {
                    if (target.chapter)
                        newNotCollapsedNodes = [
                            ...newNotCollapsedNodes,
                            ...showPath(target),
                        ];
                }
            });
        }

        return newNotCollapsedNodes;
    };

    const handleOnSelect = (item) => {
        const node = getNode(item.id);

        if (isShowPathChecked) {
            if (node.childLinks && node.childLinks.length) {
                const newNotCollapsedNodes = showPath(node);

                const oldNotCollapsedNodes = new Set(notCollapsedNodes);

                setNotCollapsedNodes([
                    ...oldNotCollapsedNodes,
                    ...newNotCollapsedNodes,
                ]);
            }
        } else {
            changeCollapsed(node, false);

            setStartNodes((startNodes) => [...startNodes, node]);
        }
    };

    useEffect(() => {
        setGraph(getGraph());
    }, [startNodes]);

    const handleNodeClick = (item) => {
        const node = getNode(item);
        if (node.childLinks && node.childLinks.length)
            changeCollapsed(node, !node.collapsed);
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
                chapter: node.chapter,
                unit: node.unit,
                name: node.name,
                group: node.group,
                notes: node.notes,
            });
            links_dict[node.id] = [];
        });

        graphData.links.forEach((link) => {
            const source = link.source.id ? link.source.id : link.source;
            const target = link.target.id ? link.target.id : link.target;
            links.push({ source: source, target: target });
        });

        localStorage.setItem(
            "graphData",
            JSON.stringify({ nodes: nodes, links: links })
        );

        const localGraphData = localStorage.getItem("graphData");

        setGraphData(JSON.parse(localGraphData));
    };

    const handleNodeInfoCreate = (newNode, newLinks) => {
        if (getNode(newNode)) {
            window.alert(
                "Knoten mit gleichem Namen oder gleicher ID existiert bereits!"
            );
            return;
        }
        if (!newNode.name) {
            window.alert("Ein Name ist notwendig!");
            return;
        }
        if (!newLinks) {
            window.alert("Ein Kapitel ist notwendig!");
            return;
        }

        newLinks.forEach((key) => {
            const source = getNode(key);
            const link = {
                source: source.id,
                target: newNode.id,
            };
            graphData.links.push(link);
            newNode.childLinks.push(link);
            source.childLinks.push(link);
        });

        graphData.nodes.push(newNode);

        saveDataLocally();

        setSelectedNode(null);
        setShowNodeInfo(false);
    };

    const isTerm = (node) => {
        return !node.chapter && !node.unit;
    };

    const handleNodeInfoDelete = (id) => {
        const confirmed = window.confirm(
            "Soll der Begriff wirklich gelöscht werden? Dies kann nicht rückgängig gemacht werden!"
        );

        if (confirmed) {
            var deleteNode = getNode(id);

            for (let i = graphData.nodes.length - 1; i >= 0; i--) {
                const node = graphData.nodes[i];

                if (deleteNode === getNode(node)) graphData.nodes.splice(i, 1);
            }

            for (let i = graphData.links.length - 1; i >= 0; i--) {
                const link = graphData.links[i];

                if (
                    link.target === deleteNode.id ||
                    link.target.id === deleteNode.id ||
                    link.source === deleteNode.id ||
                    link.source.id === deleteNode.id
                )
                    deleteLink(link);
            }

            saveDataLocally();

            setSelectedNode(null);
            setShowNodeInfo(false);
        }
    };

    const deleteLink = (link) => {
        const source = getNode(link.source);
        const sourceIndex = source.childLinks.indexOf(link);
        if (sourceIndex > -1) {
            source.childLinks.splice(sourceIndex, 1);
        }

        const target = getNode(link.target);
        const targetIndex = target.childLinks.indexOf(link);
        if (targetIndex > -1) {
            target.childLinks.splice(targetIndex, 1);
        }

        const graphDataIndex = graphData.links.indexOf(link);
        if (graphDataIndex > -1) {
            graphData.links.splice(graphDataIndex, 1);
        }
    };

    const handleNodeInfoSave = (updatedNode, newLinks, removedLinks) => {
        var node = getNode(updatedNode);

        if (node.name !== updatedNode.name && getNode(updatedNode.name)) {
            window.alert(
                "Knoten mit gleichem Namen oder gleicher ID existiert bereits!"
            );
            return;
        }
        if (!updatedNode.name) {
            window.alert("Ein Name ist notwendig!");
            return;
        }
        if (
            updatedNode.childLinks.length +
                newLinks.length -
                removedLinks.length <=
            0
        ) {
            window.alert("Ein Kapitel ist notwendig!");
            return;
        }
        node.name = updatedNode.name;
        node.chapter = updatedNode.chapter;
        node.unit = updatedNode.unit;
        node.startpage = updatedNode.startpage;
        node.notes = updatedNode.notes;

        for (let i = graphData.links.length - 1; i >= 0; i--) {
            const link = graphData.links[i];
            if (
                ((removedLinks.has(link.source) ||
                    removedLinks.has(link.source.id)) &&
                    (link.target === updatedNode.id ||
                        link.target.id === updatedNode.id)) ||
                ((link.source === updatedNode.id ||
                    link.source.id === updatedNode.id) &&
                    (removedLinks.has(link.target) ||
                        removedLinks.has(link.target.id)))
            )
                deleteLink(link);
        }

        removedLinks.forEach((id) => {
            const removedNode = getNode(id);
            if (!removedNode.childLinks || removedNode.childLinks.length <= 0) {
                const graphDataIndex = graphData.nodes.indexOf(removedNode);
                if (graphDataIndex > -1) {
                    graphData.nodes.splice(graphDataIndex, 1);
                }
            }
        });

        if (!isTerm(node)) {
            newLinks.forEach((id) => {
                const target = getNode(id);
                const link = {
                    source: node,
                    target: target.id,
                };
                graphData.links.push(link);
                target.childLinks.push(link);
                node.childLinks.push(link);
            });
        }
        if (isTerm(node)) {
            newLinks.forEach((id) => {
                const source = getNode(id);
                const link = {
                    source: source.id,
                    target: node,
                };
                graphData.links.push(link);
                source.childLinks.push(link);
                node.childLinks.push(link);
            });
        }

        saveDataLocally();

        setSelectedNode(null);
        setShowNodeInfo(false);
    };

    const handleNodeInfoClose = () => {
        setSelectedNode(null);
        setShowNodeInfo(false);
    };

    const getChapters = () => {
        return graphData.nodes.filter((node) => node.unit || node.chapter);
    };

    const getTerms = () => {
        return graphData.nodes.filter((node) => !node.unit && !node.chapter);
    };

    const [displayOption, setDisplayOption] = useState("2D-ForceDirected");

    const handleDisplayOptionChange = (selectedOption) => {
        graphData.nodes.forEach((node) => {
            delete node.fx;
            delete node.x;
        });

        setDisplayOption(selectedOption);
    };

    const createNode = () => {
        setSelectedNode(false);
        setShowNodeInfo(true);
    };

    const collapseAll = () => {
        setStartNodes([getNode(rootId)]);

        const newNotCollapsedNodes = new Set();

        graphData.nodes.forEach((node) => {
            node.collapsed = true;
            newNotCollapsedNodes.add(node.id);
        });

        setNotCollapsedNodes(newNotCollapsedNodes);

        setGraph(getGraph());
    };

    const expandAll = () => {
        setStartNodes([getNode(rootId)]);

        setNotCollapsedNodes(new Set());

        graphData.nodes.forEach((node) => {
            node.collapsed = false;
        });
        setGraph(getGraph());
    };

    const resetGraphData = () => {
        const confirmed = window.confirm(
            "Sollen die lokalen Daten tatsächlich gelöscht werden? Dies kann nicht rückgängig gemacht werden!"
        );

        if (confirmed) {
            localStorage.removeItem("graphData");
            setGraphData(graphDataJson);
            document.location.reload();
        }
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

    const [isFinished, setIsFinished] = useState(false);

    const getRandomQuiz = (level) => {
        const activeStartNodes = graphData.nodes.filter(
            (node) => isActiveNode(node) && node.unit
        );

        const startNode =
            activeStartNodes[
                Math.floor(Math.random() * activeStartNodes.length)
            ];

        const possibleNeighbours = new Set();
        possibleNeighbours.add(getNode(startNode));
        const nodes = new Set();
        const num = level * 2 + 3;
        for (let i = 1; i <= num; i++) {
            if (possibleNeighbours.size === 0) break;

            const possibleNeighboursArr = Array.from(possibleNeighbours);
            const randomNode =
                possibleNeighboursArr[
                    Math.floor(Math.random() * possibleNeighboursArr.length)
                ];
            const node = getNode(randomNode);

            nodes.add(node);
            node.childLinks.forEach((link) => {
                const source = getNode(link.source);
                if (!nodes.has(source) && isActiveNode(source))
                    possibleNeighbours.add(source);
                const target = getNode(link.target);
                if (!nodes.has(target) && isActiveNode(target))
                    possibleNeighbours.add(target);
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
                if (
                    (node.id === link.source || node.id === link.source.id) &&
                    (nodeIds.has(link.target) || nodeIds.has(link.target.id))
                )
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

    const [recentLevelUp, setRecentLevelUp] = useState(false);

    useEffect(() => {
        if (experience >= nextLevelExperience()) {
            setLevel(level + 1);
            setRecentLevelUp(true);
            setExperience(0);
        }
    }, [experience]);

    useEffect(() => {
        if (recentLevelUp) {
            const timer = setTimeout(() => {
                setRecentLevelUp(false);
            }, 5000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [recentLevelUp]);

    useEffect(() => {
        if (
            quizGraph.links.length > 0 &&
            quizGraph.links.length < maxQuizGraphLinks
        ) {
            setExperience(experience + 10);
        }
        if (
            quizGraph.links.length > 0 &&
            quizGraph.links.length >= maxQuizGraphLinks
        ) {
            setExperience(experience + level * 10 + 10);
            setIsFinished(true);
            setIsSuccessOpen(true);
        }
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
        setIsFinished(false);
        setQuizGraph(getRandomQuiz(level));
    };

    const [isOptionsOpen, setIsOptionsOpen] = useState(true);
    const closeOptionsText = "Optionen ausblenden";
    const openOptionsText = "Optionen einblenden";

    function toggleOptions() {
        setIsOptionsOpen(!isOptionsOpen);
    }

    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const closeHelpText = "Hilfe ausblenden";
    const openHelpText = "Hilfe einblenden";

    function toggleHelp() {
        setIsHelpOpen(!isHelpOpen);
    }

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    function closeSuccess() {
        setIsSuccessOpen(false);
    }

    useEffect(() => {
        setGraphHeight(getGraphHeight);
    }, [isOptionsOpen]);

    const [graphHeight, setGraphHeight] = useState(0);

    const getGraphHeight = () => {
        const graphContainer = document.getElementById("Graph");
        if (!graphContainer) return 0;

        const graphContainerTop = graphContainer.getBoundingClientRect().top;

        const height = window.innerHeight - graphContainerTop;

        setGraphHeight(height - 5);
    };

    useEffect(() => {
        const updateGraphHeight = () => {
            const newHeight = getGraphHeight();
            if (newHeight !== graphHeight) {
                setGraphHeight(newHeight);
            }
        };

        window.addEventListener("resize", updateGraphHeight);
        updateGraphHeight();

        return () => {
            window.removeEventListener("resize", updateGraphHeight);
        };
    }, []);

    const [isShowPathChecked, setIsShowPathChecked] = useState(true);

    return (
        <div>
            <div className="options-wrapper">
                <div style={{ display: "flex" }}>
                    <button
                        className="options-toggle-button"
                        onClick={toggleHelp}
                    >
                        {isHelpOpen ? closeHelpText : openHelpText}
                    </button>
                    <button
                        className="options-toggle-button"
                        onClick={toggleOptions}
                    >
                        {isOptionsOpen ? closeOptionsText : openOptionsText}
                    </button>
                </div>
                {isHelpOpen && (
                    <div className="help-window">
                        <HelpWindow onClose={toggleHelp}></HelpWindow>
                    </div>
                )}
                {isOptionsOpen && (
                    <div className="options-container">
                        <div
                            style={{
                                marginLeft: "10px",
                            }}
                        >
                            <Dropdown
                                mode={displayOption}
                                handleDisplayOptionChange={
                                    handleDisplayOptionChange
                                }
                            ></Dropdown>
                        </div>
                        <Filter
                            units={units}
                            activeUnits={activeUnits}
                            changeFilter={changeFilter}
                        ></Filter>
                        {displayOption !== "Quiz" && (
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <SearchBar
                                            items={graphData.nodes}
                                            onSelect={handleOnSelect}
                                            width={500}
                                        />
                                    </div>
                                    <div>
                                        <CheckboxWithText
                                            isChecked={isShowPathChecked}
                                            setIsChecked={setIsShowPathChecked}
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        marginLeft: "5px",
                                    }}
                                >
                                    <Button
                                        text="Knoten hinzufügen"
                                        onHandleClick={createNode}
                                    />
                                    <Button
                                        text="Alle Knoten einklappen"
                                        onHandleClick={collapseAll}
                                    />
                                    <Button
                                        text="Alle Knoten ausklappen"
                                        onHandleClick={expandAll}
                                    />
                                    <Button
                                        text="Lokale Daten zurücksetzen"
                                        onHandleClick={resetGraphData}
                                    />
                                </div>

                                <div
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    <p>Angezeigte Knoten: {getLabel()}</p>

                                    <div>
                                        <ProgressBar now={getProgress()} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {displayOption === "Quiz" && (
                            <div>
                                <div
                                    style={{
                                        marginLeft: "10px",
                                    }}
                                >
                                    <p
                                        style={{
                                            marginBottom: "5px",
                                            backgroundColor: recentLevelUp
                                                ? "lightgreen"
                                                : "inherit",
                                        }}
                                    >
                                        Level: {level}
                                    </p>
                                    <div style={{ marginBottom: "5px" }}>
                                        Erfahrung
                                        <ProgressBar
                                            now={getExperienceProgress()}
                                            label={getExperienceLabel()}
                                        ></ProgressBar>
                                    </div>
                                    <div style={{ marginBottom: "5px" }}>
                                        Quiz-Fortschritt
                                        <ProgressBar
                                            now={getQuizProgress()}
                                            label={getQuizLabel()}
                                        ></ProgressBar>
                                    </div>
                                </div>
                                {isFinished && (
                                    <div
                                        style={{
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <Button
                                            text="Neues Quiz"
                                            onHandleClick={newQuiz}
                                        ></Button>
                                        {isSuccessOpen && (
                                            <div className="success-window">
                                                <SuccessWindow
                                                    onClose={closeSuccess}
                                                    onNewQuiz={newQuiz}
                                                ></SuccessWindow>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {!isFinished && (
                                    <div
                                        style={{
                                            marginLeft: "10px",
                                        }}
                                    >
                                        Klicken Sie auf Knoten um Sie zu
                                        verbinden!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                    id={"Graph"}
                    style={{
                        display: "flex",
                        flexGrow: 1,
                        position: "relative",
                    }}
                >
                    <div>
                        <GraphDisplay
                            onNodeClick={handleNodeClick}
                            onNodeRightClick={handleNodeRightClick}
                            graph={graph}
                            height={graphHeight}
                            mode={displayOption}
                            onQuizNodeClick={handleNodeClickQuiz}
                            quizGraph={quizGraph}
                        />
                    </div>
                    {showNodeInfo && (
                        <div className="node-info">
                            <NodeInfo
                                key={selectedNode.id}
                                node={selectedNode}
                                onSave={handleNodeInfoSave}
                                onClose={handleNodeInfoClose}
                                onCreate={handleNodeInfoCreate}
                                onDelete={handleNodeInfoDelete}
                                chapters={getChapters()}
                                terms={getTerms()}
                                getNode={getNode}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Graph;
