// src/pages/TaskPage/ChapterCreation.js
import React, { useState } from "react";
import {toast} from "react-toastify";

const ChapterCreation = ({ projectId, createChapter , mode,observe}) => {
    const [showChapterInput, setShowChapterInput] = useState(false);
    const [chapterName, setChapterName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleAddChapter = async () => {
        if (!chapterName.trim()) return alert("Enter chapter name");

        try {
            setIsCreating(true);
            await createChapter({ name: chapterName, projectId }).unwrap();
           toast("Chapter added successfully!");
            setChapterName("");
            setShowChapterInput(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to add chapter");
        } finally {
            setIsCreating(false);
        }
    };

    return !showChapterInput  ? (
        mode && !observe && (

        <button className="add-chapter-btn" onClick={() => setShowChapterInput(true)}>
            + Capitol nou
        </button>
        )
    ) : (
        <div className="chapter-input-container">
            <input
                type="text"
                className="chapter-input"
                value={chapterName}
                placeholder="Enter chapter name"
                onChange={(e) => setChapterName(e.target.value)}
            />
            <button className="submit-chapter-btn" onClick={handleAddChapter} disabled={isCreating}>
                {isCreating ? "Adding..." : "Add"}
            </button>
        </div>
    );
};

export default ChapterCreation;
