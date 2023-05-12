import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

import "./NodeInfo.css";

const NodeInfo = ({
    node,
    onSave,
    onClose,
    onCreate,
    chapters,
    terms,
    getNode,
}) => {
    const [id, setId] = useState(node.id);
    const [name, setName] = useState(node.name);
    const [childLinks, setChildLinks] = useState(node.childLinks);
    const [newLinks, setNewLinks] = useState(new Set());
    const [removedLinks, setRemovedLinks] = useState(new Set());
    const [chapter, setChapter] = useState(node.chapter);
    const [unit, setUnit] = useState(node.unit);
    const [startpage, setStartpage] = useState(node.startpage);
    const [notes, setNotes] = useState(node.notes);
    const [shownLinks, setShownLinks] = useState([]);

    useEffect(() => {
        if (childLinks) {
            const links = childLinks.filter((childLink) => {
                return isChapterTermLink(childLink);
            });

            let keys = links.map((link) => {
                let key =
                    link.source.id !== id ? link.source.id : link.target.id;
                if (!key) {
                    key = link.source !== id ? link.source : link.target;
                }
                return key;
            });

            keys.sort((a, b) => {
                let keyA;
                if (a.source && a.target)
                    keyA = a.source.id !== id ? a.source.id : a.target.id;
                else keyA = a.source !== id ? a.source : a.target;
                let keyB;
                if (b.source && b.target)
                    keyB = b.source.id !== id ? b.source.id : b.target.id;
                else keyB = b.source !== id ? b.source : b.target;

                const splitA = keyA ? keyA.split(".") : a;
                const splitB = keyB ? keyB.split(".") : b;

                for (
                    let i = 0;
                    i < Math.min(splitA.length, splitB.length);
                    i++
                ) {
                    if (splitA[i] < splitB[i]) return -1;
                    if (splitB[i] < splitA[i]) return 1;
                }

                return splitA.length - splitB.length;
            });

            setShownLinks(keys);
        }
    }, []);

    const handleCreate = () => {
        const newNode = {
            id: name,
            name: name,
            notes: notes,
            childLinks: [],
            group: 2,
        };
        onCreate(newNode, shownLinks);
    };

    const handleSave = () => {
        onSave(
            {
                ...node,
                id,
                name,
                chapter,
                shownLinks,
                unit,
                startpage,
                notes,
            },
            newLinks,
            removedLinks
        );
    };

    const handleClose = () => {
        onClose();
    };

    const handleOnSelect = (selectedNode) => {
        removedLinks.delete(selectedNode);
        newLinks.add(selectedNode.id);
        setShownLinks([...shownLinks, selectedNode.id]);
    };

    const handleDeleteChildLink = (deletedKey) => {
        // setChildLinks(childLinks.filter((link) => link !== childLink));
        setShownLinks(shownLinks.filter((key) => key !== deletedKey));
        newLinks.delete(deletedKey);
        removedLinks.add(deletedKey);
    };

    const isChapterTermLink = (link) => {
        const source = getNode(link.source);
        const target = getNode(link.target);

        if ((source.unit || source.chapter) && (target.unit || target.chapter))
            return false;
        return true;
    };

    return (
        <div className="node-info-container">
            <label htmlFor="name" style={{ display: "block" }}>
                Name:
            </label>
            <input
                id="name"
                type="text"
                value={node ? name : name || ""}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%" }}
            />
            {(chapter || unit) && (
                <div>
                    <label htmlFor="links" style={{ display: "block" }}>
                        Terme:
                    </label>
                    <ul>
                        {shownLinks.map((key) => {
                            return (
                                <li key={key}>
                                    {key}
                                    <button
                                        onClick={() =>
                                            handleDeleteChildLink(key)
                                        }
                                    >
                                        X
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <SearchBar
                        items={terms}
                        onSelect={handleOnSelect}
                        width={300}
                    ></SearchBar>{" "}
                </div>
            )}
            {!chapter && !unit && (
                <div>
                    <label htmlFor="links" style={{ display: "block" }}>
                        Kapitel:
                    </label>
                    {shownLinks && (
                        <div>
                            <ul>
                                {shownLinks.map((key) => {
                                    return (
                                        <li key={key}>
                                            {key}
                                            <button
                                                onClick={() =>
                                                    handleDeleteChildLink(key)
                                                }
                                            >
                                                X
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                    <SearchBar
                        items={chapters}
                        onSelect={handleOnSelect}
                        width={300}
                    ></SearchBar>{" "}
                </div>
            )}
            <label htmlFor="notes" style={{ display: "block" }}>
                Notizen:
            </label>
            <textarea
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: "100%" }}
            />
            <div style={{ display: "block" }}>
                {!node && (
                    <button className="button" onClick={handleCreate}>
                        Create
                    </button>
                )}
                {node && (
                    <button className="button" onClick={handleSave}>
                        Save
                    </button>
                )}
                <button className="button" onClick={handleClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default NodeInfo;
