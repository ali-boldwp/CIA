// src/pages/TaskPage/ChapterCreation.js
import React, { useState } from "react";
import {toast} from "react-toastify";

const ChapterCreation = ({ projectId, createChapter , mode,observe}) => {
    const [showChapterInput, setShowChapterInput] = useState(false);
    const [chapterName, setChapterName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleAddChapter = async () => {
        if (!chapterName.trim()) {
            toast.error("Enter chapter name");
            return;
        }

        setIsCreating(true);

        try {
            await toast.promise(
                createChapter({ name: chapterName, projectId }).unwrap(),
                {
                    pending: "Se adaugă capitolul...",
                    success: "Capitol adăugat cu succes!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Failed to add chapter";
                        },
                    },
                },
                { autoClose: 2000, toastId: `create-chapter-${projectId}` }
            );

            setChapterName("");
            setShowChapterInput(false);
        } catch (err) {
            console.error(err);
            // toast.promise already handled error
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
