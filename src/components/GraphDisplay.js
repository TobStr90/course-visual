import { React, useCallback, useState, useMemo } from "react";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Graph2D from "./Graph2D";
import Graph3D from "./Graph3D";
import NodeInfo from "./NodeInfo";
import ProgressBar from "react-bootstrap/ProgressBar";
import SearchBar from "./SearchBar";

import graphDataJson from "../assets/graph.json";

function GraphDisplay() {
  // const graphData = require("../assets/graph.json");
  var graphData = graphDataJson;
  // const [graphData, setGraphData] = useState(graphDataJson);

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

  const getNode = (node) => {
    if (nodesById[node]) return nodesById[node];
    else if (nodesById[node.id]) return nodesById[node.id];
    return null;
  };

  var visibleNodesCount = 0;

  const getGraph = () => {
    const visibleNodes = new Set();
    const visibleLinks = new Set();
    // const traverseGraph = (node = nodesById[rootId]) => {
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
          // typeof link.target === "object" ? link.target : nodesById[link.target]
          typeof link.target === "object" ? link.target : getNode(link.target)
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

    return {
      nodes: Array.from(visibleNodes),
      links: Array.from(visibleLinks),
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
          // const neighbour = nodesById[link.target];
          const neighbour = getNode(link.target);
          if (neighbour && neighbour !== node) {
            if (neighbour.chapter && neighbour.chapter === previousChapter) {
              showPath(neighbour);
            }
          }
        });
      } else {
        node.childLinks.forEach((link) => {
          // const neighbour = nodesById[link.target];
          const neighbour = getNode(link.target);
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
        // const neighbour = nodesById[link.target];
        const neighbour = getNode(link.target);
        if (neighbour && neighbour !== node) {
          if (neighbour.chapter) {
            showPath(neighbour);
          }
        }
      });
    }
  };

  const handleOnSelect = (item) => {
    // const node = nodesById[item.id];
    const node = getNode(item.id);
    if (node.childLinks && node.childLinks.length) {
      showPath(node);

      // const rootNode = nodesById[rootId];
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

  const handleNodeInfoSave = (updatedNode) => {
    const updatedGraphData = {
      ...graphData,
      nodes: graphData.nodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      ),
    };
    // setGraphData(updatedGraphData);
    graphData = updatedGraphData;
    setGraph(getGraph());
    setSelectedNode(null);
    setShowNodeInfo(false);
  };

  const handleNodeInfoClose = () => {
    setSelectedNode(null);
    setShowNodeInfo(false);
  };

  const [displayOption, setDisplayOption] = useState("2D");

  const handleDisplayOptionChange = (selectedOption) => {
    setDisplayOption(selectedOption);
  };

  const expandAll = () => {
    graphData.nodes.forEach((node) => {
      node.collapsed = false;
      setGraph(getGraph());
    });
  };

  const collapseAll = () => {
    graphData.nodes.forEach((node) => {
      node.collapsed = true;
      setGraph(getGraph());
    });
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

  return (
    <div>
      <div>
        <ProgressBar now={getProgress()} label={getLabel()}></ProgressBar>
      </div>
      <Button text="Collapse all" handleClick={collapseAll}></Button>
      <Button text="Expand all" handleClick={expandAll}></Button>
      <Dropdown
        handleDisplayOptionChange={handleDisplayOptionChange}
      ></Dropdown>
      <SearchBar
        items={graphData.nodes}
        handleOnSelect={handleOnSelect}
      ></SearchBar>{" "}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexGrow: 1, position: "relative" }}>
          {displayOption === "2D" && (
            <Graph2D
              onNodeClick={handleNodeClick}
              onNodeRightClick={handleNodeRightClick}
              graph={graph}
              setGraph={setGraph}
            />
          )}
          {displayOption === "3D" && (
            <Graph3D
              onNodeClick={handleNodeClick}
              onNodeRightClick={handleNodeRightClick}
              graph={graph}
              setGraph={setGraph}
            />
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
