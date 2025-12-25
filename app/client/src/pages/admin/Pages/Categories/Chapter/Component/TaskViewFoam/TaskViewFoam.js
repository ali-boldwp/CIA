import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {useCreateTaskTemplateMutation , useUpdateTaskTemplateMutation} from "../../../../../../../services/categoryApi";

const TaskViewFoam = ({ task, chapterId, onUpdate, onCreated }) => {
    const editor = useRef(null);
    const navigate = useNavigate();

    const [createTaskTemplate] = useCreateTaskTemplateMutation();
    const [updateTaskTemplate] = useUpdateTaskTemplateMutation();

    const isCreatingRef = useRef(false);



    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Conținut inițial",
            height: 300,
            uploader: {
                insertImageAsBase64URI: true,
            },
        }),
        []
    );

    // 🔹 CREATE ON BLUR
    const handleTitleBlur = async () => {
        if (!task.name.trim() || task.isCreated) return;

        if (isCreatingRef.current) return;
        isCreatingRef.current = true;

        if (!chapterId) {
            toast.error("Capitolul nu este valid");
            isCreatingRef.current = false;
            return;
        }

        try {
            const res = await createTaskTemplate({
                name: task.name,
                content: task.content || "",
                chapter: chapterId
            }).unwrap();

            // ✅ FIX IS HERE
            const realId = res?.data?._id;

            if (!realId) {
                console.error("Invalid response:", res);
                throw new Error("ID lipsă");
            }

            onCreated(task.uid, realId);

            toast.success("Task creat cu succes ");
        } catch (err) {
            console.error("Create task error:", err);
            toast.error("Operația a eșuat ");
        } finally {
            isCreatingRef.current = false;
        }
    };

    const handleUpdate = async (payload) => {
        if (!task.isCreated) return;

        try {
            await updateTaskTemplate({
                id: task.uid,
                data: {
                    ...payload,
                    chapter: chapterId
                }
            }).unwrap();

            toast.success("Task actualizat cu succes");

        } catch (err) {
            console.error("Update task error:", err);
            toast.error("Actualizarea a eșuat");

        }
    };





    // 🔹 SETTINGS CLICK (ALWAYS WORKS)
    const handleSettingsClick = () => {
        if (!task.isCreated) return;
        navigate(`/categories/chapter/task/${task.uid}`);
    };

    return (
        <div className="form-box">
            <div style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Numele taskului"
                    className="input"
                    value={task.name}
                    onChange={(e) =>
                        onUpdate(task.uid, { name: e.target.value })
                    }
                    onBlur={() =>
                        task.isCreated
                            ? handleUpdate({ name: task.name })   // ✏️ UPDATE
                            : handleTitleBlur()                   // ➕ CREATE
                    }
                />


                <IoMdSettings
                    onClick={handleSettingsClick}
                    style={{
                        position: "absolute",
                        top: "10px",
                        fontSize: "13pt",
                        cursor: task.isCreated ? "pointer" : "not-allowed",
                        right: "7px",
                    }}
                />
            </div>

            <JoditEditor
                ref={editor}
                value={task.content}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => {
                    onUpdate(task.uid, { content: newContent });
                    handleUpdate({ content: newContent }); // ✏️ UPDATE
                }}
            />

        </div>
    );
};

export default TaskViewFoam;
