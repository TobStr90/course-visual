import React, { useState } from "react";
import SearchBar from "./SearchBar";

const NodeInfo = ({ node, onSave, onClose, onCreate, chapters }) => {
    const [id, setId] = useState(node.id);
    const [name, setName] = useState(node.name);
    const [childLinks, setChildLinks] = useState(node.childLinks);
    const [newLinks, setNewLinks] = useState(new Set());
    const [removedLinks, setRemovedLinks] = useState(new Set());
    const [chapter, setChapter] = useState(node.chapter);
    const [unit, setUnit] = useState(node.unit);
    const [startpage, setStartpage] = useState(node.startpage);
    const [notes, setNotes] = useState(node.notes);

    console.log(childLinks);

    const handleCreate = () => {
        const newNode = {
            id: name,
            name: name,
            childLinks: childLinks,
            notes: notes,
        };
        onCreate(newNode);
    };

    const handleSave = () => {
        onSave(
            {
                ...node,
                id,
                name,
                chapter,
                childLinks,
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
        newLinks.add(selectedNode.id);
    };

    const handleDeleteChildLink = (childLink, key) => {
        console.log(childLink);
        console.log(key);
        setChildLinks(childLinks.filter((link) => link !== childLink));
        removedLinks.add(key);
        console.log(childLinks);
    };

    return (
        <div
            style={{
                backgroundColor: "lightgrey",
                paddingBottom: "5px",
                paddingLeft: "5px",
                paddingRight: "5px",
                paddintTop: "5px",
            }}
        >
            <label htmlFor="name" style={{ display: "block" }}>
                Name:
            </label>
            <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%" }}
            />
            <label htmlFor="links" style={{ display: "block" }}>
                Links:
            </label>
            <ul>
                {childLinks.map((childLink) => {
                    let key =
                        childLink.source.id !== id
                            ? childLink.source.id
                            : childLink.target.id;
                    if (!key)
                        key =
                            childLink.source !== id
                                ? childLink.source
                                : childLink.target;

                    return (
                        <li key={key}>
                            {key}
                            <button
                                onClick={() =>
                                    handleDeleteChildLink(childLink, key)
                                }
                            >
                                X
                            </button>
                        </li>
                    );
                })}
            </ul>
            <SearchBar
                items={chapters}
                onSelect={handleOnSelect}
                width={300}
            ></SearchBar>{" "}
            {/* {node.chapter && (
                <div>
                    <label htmlFor="chapter" style={{ display: "block" }}>
                        Chapter:
                    </label>
                    <input
                        id="chapter"
                        type="text"
                        value={chapter}
                        onChange={(e) => setChapter(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>
            )}
            {node.unit && (
                <div>
                    <label htmlFor="unit" style={{ display: "block" }}>
                        Unit:
                    </label>
                    <input
                        id="unit"
                        type="text"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>
            )} */}
            <label htmlFor="notes" style={{ display: "block" }}>
                Notes:
            </label>
            <textarea
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: "100%" }}
            />
            <div style={{ display: "block" }}>
                {!node && <button onClick={handleCreate}>Create</button>}
                {node && <button onClick={handleSave}>Save</button>}
                <button onClick={handleClose}>Close</button>
            </div>
        </div>
    );
};

export default NodeInfo;
