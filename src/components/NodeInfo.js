import React, { useState } from "react";

const NodeInfo = ({ node, onSave, onClose }) => {
  const [id, setId] = useState(node.id);
  const [name, setName] = useState(node.name);
  const [chapter, setChapter] = useState(node.chapter);
  const [unit, setUnit] = useState(node.unit);
  const [startpage, setStartpage] = useState(node.startpage);
  const [notes, setNotes] = useState(node.notes);

  const handleSave = () => {
    onSave({ ...node, id, name, chapter, unit, startpage, notes });
  };

  const handleClose = () => {
    onClose();
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
      {/* <label htmlFor="id" style={{ display: "block" }}>
        Id:
      </label>
      <input
        id="id"
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ width: "100%" }}
      /> */}

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

      {/* <label htmlFor="startpage" style={{ display: "block" }}>
        Startpage:
      </label>
      <input
        id="startpage"
        type="text"
        value={startpage}
        onChange={(e) => setStartpage(e.target.value)}
        style={{ width: "100%" }}
      /> */}

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
        <button onClick={handleSave}>Save</button>

        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default NodeInfo;
