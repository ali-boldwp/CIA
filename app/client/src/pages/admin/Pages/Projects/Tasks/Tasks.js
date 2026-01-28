import "./TaskPage.css";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
    useCreateChapterMutation,
    useCreateTaskMutation,
    useGetChapterByIdQuery,
    useUpdateEditableMutation,
    useFinalizeTaskMutation,
    useCreateObservationMutation,
    useGetObservationsByProjectQuery,
    useFetchProjectShortcodesMutation
} from "../../../../../services/taskApi";

import {
    useGetCreateProjectByIdQuery,
    useGetAnalystsProjectProgressQuery,
} from "../../../../../services/projectApi";

import { toast } from "react-toastify";
import ChapterCreation from "../../../../taskPage/components/ChapterCreation";
import ReviewPopUp from "./Popup/ReviewPop/ReviewPopUp";
import PleaseWaitPopUp from "./Popup/PleaseWaitPopUp/PleaseWaitPopUp";
import Chapter from "./Components/Chapter";
import Details from "./Components/Details";
import { useGetCategoryByIdQuery } from "../../../../../services/categoryApi";


const escapeHtml = (s = "") =>
    String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

const isTableValue = (v) =>
    v && typeof v === "object" && Array.isArray(v.columns) && Array.isArray(v.rows);

// ✅ Editor sometimes gives "&nbsp;" so handle it

const getStandaloneToken = (htmlText) => {
    const raw = String(htmlText || "");

    // 1) Strip HTML -> plain text
    const doc = new DOMParser().parseFromString(raw, "text/html");
    let text = (doc.body.textContent || "");

    // 2) Normalize spaces + remove hidden chars
    text = text
        .replace(/&nbsp;/g, " ")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/\s+/g, " ")
        .trim();


    const m = text.match(/^\[([^\[\]]+)\]$/);
    return m ? m[1].trim() : null;
};



const tableToHtml = (tbl) => {
    const cols = tbl.columns || [];
    const rows = tbl.rows || [];

    const head = `<tr>${cols.map((c) => `<th class="r-th">${escapeHtml(c)}</th>`).join("")}</tr>`;

    const body = rows
        .map((r) => {
            // rows can be array OR object
            let cells = [];
            if (Array.isArray(r)) cells = r;
            else if (r && typeof r === "object") {
                // map object values in same order as columns if possible
                const keys = Object.keys(r);
                cells = cols.map((_, i) => {
                    // best effort: try by known keys or by index
                    const k = keys[i];
                    return r?.[k] ?? "";
                });
            } else cells = [r ?? ""];

            return `<tr>${cells.map((c) => `<td class="r-td">${escapeHtml(c)}</td>`).join("")}</tr>`;
        })
        .join("");

    return `<table class="r-table"><thead>${head}</thead><tbody>${body}</tbody></table>`;
};

const replaceInlineShortcodes = (text, map) => {
    if (!text) return text;

    return String(text).replace(/\[([^\[\]]+)\]/g, (full, token) => {
        const key = String(token).trim();
        const v = map?.[key];

        if (v === undefined || v === null) return full;

        // inline tables not allowed
        if (isTableValue(v)) return full;

        if (Array.isArray(v)) return v.map(String).join(", ");
        if (typeof v === "object") return full;

        return String(v);
    });
};

const extractTextContent = (html) => {
    const tmp = new DOMParser().parseFromString(String(html || ""), "text/html");
    return (tmp.body.textContent || "").replace(/&nbsp;/g, " ");
};

const extractTokensFromEditorData = (editorData) => {
    const tokens = new Set();
    const blocks = editorData?.blocks || [];

    for (const b of blocks) {
        if (!b) continue;

        if (b.type === "paragraph" || b.type === "header") {
            const text = extractTextContent(b?.data?.text);
            [...text.matchAll(/\[([^\[\]]+)\]/g)].forEach((m) => tokens.add(m[1].trim()));
        }

        if (b.type === "list") {
            const items = b?.data?.items || [];
            for (const it of items) {
                const t = extractTextContent(it);
                [...t.matchAll(/\[([^\[\]]+)\]/g)].forEach((m) => tokens.add(m[1].trim()));
            }
        }

        if (b.type === "table") {
            const content = b?.data?.content || [];
            for (const row of content) {
                for (const cell of row || []) {
                    const t = extractTextContent(cell);
                    [...t.matchAll(/\[([^\[\]]+)\]/g)].forEach((m) => tokens.add(m[1].trim()));
                }
            }
        }
    }

    return [...tokens];
};


const editorBlockToHtml = (block, shortcodeMap) => {
    if (!block) return "";

    if (block.type === "paragraph") {
        const raw = block.data?.text || "";
        const token = getStandaloneToken(raw);
        if (token && isTableValue(shortcodeMap?.[token])) {
            return tableToHtml(shortcodeMap[token]);
        }
        return `<p class="r-p">${replaceInlineShortcodes(raw, shortcodeMap)}</p>`;
    }

    if (block.type === "header") {
        const lvl = block.data?.level || 2;
        const raw = block.data?.text || "";
        return `<h${lvl} class="r-h">${replaceInlineShortcodes(raw, shortcodeMap)}</h${lvl}>`;
    }

    if (block.type === "list") {
        const style = block.data?.style === "ordered" ? "ol" : "ul";
        const items = (block.data?.items || [])
            .map((it) => `<li class="r-li">${replaceInlineShortcodes(it, shortcodeMap)}</li>`)
            .join("");
        return `<${style} class="r-list">${items}</${style}>`;
    }

    if (block.type === "table") {
        const content = block.data?.content || [];
        const rows = content
            .map(
                (row) =>
                    `<tr>${(row || [])
                        .map((c) => `<td class="r-td">${replaceInlineShortcodes(c, shortcodeMap)}</td>`)
                        .join("")}</tr>`
            )
            .join("");
        return `<table class="r-table"><tbody>${rows}</tbody></table>`;
    }

    // ✅ ✅ ADD THIS: IMAGE BLOCK
    if (block.type === "image") {
        const url = block.data?.file?.url || "";
        const caption = block.data?.caption || "";

        if (!url) return "";

        // crossOrigin is important for html2canvas
        return `
      <figure class="r-figure">
        <img class="r-img" src="${url}" crossorigin="anonymous" />
        ${caption ? `<figcaption class="r-cap">${escapeHtml(caption)}</figcaption>` : ""}
      </figure>
    `;
    }

    return "";
};



const editorDataToHtml = (editorData, shortcodeMap) => {
    const blocks = editorData?.blocks || [];
    return blocks.map((b) => editorBlockToHtml(b, shortcodeMap)).join("");
};





const ProjectTasks = ({ projectData }) => {
    const { user } = useSelector((state) => state.auth);
    const { id: projectId } = useParams();

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [activeChapterId, setActiveChapterId] = useState(null);

    const [tasksByChapter, setTasksByChapter] = useState({});
    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [showEditingPopup, setShowEditingPopup] = useState(false);
    const [showPleaseWait, setShowPleaseWait] = useState(false);
    const [allBtn, setAllBtn] = useState(false);
    const [isFinalizedLocal, setIsFinalizedLocal] = useState(false);

    // ✅ Export HTML (rendered in hidden div)
    const [exportHtml, setExportHtml] = useState("");

    const [updateEditable] = useUpdateEditableMutation();
    const [finalizeTask] = useFinalizeTaskMutation();
    const [createObservation] = useCreateObservationMutation();
    const [fetchProjectShortcodes] = useFetchProjectShortcodesMutation();


    const { data: Observation } = useGetObservationsByProjectQuery(projectId, {
        skip: !projectId,
    });

    const { data: analystsProgress, refetch: refetchProgress } =
        useGetAnalystsProjectProgressQuery(projectId);

    const [createTask] = useCreateTaskMutation();

    const { data: pro } = useGetCreateProjectByIdQuery(projectId, {
        ship: !projectId,
    });

    const { data: chapter, refetch: refetchChapters } = useGetChapterByIdQuery(projectId, {
        skip: !projectId,
    });

    const chapterData = chapter?.data || [];
    const legendColors = ["blue", "purple", "green", "red", "yellow", "pink"];

    const project = projectData?.data;
    const isObservation = project?.status === "observation";

    const entityType = project?.entityType; // categoryId

    const { data: categoryResponse } = useGetCategoryByIdQuery(entityType, {
        skip: !entityType,
    });

    // ✅ This is your category which contains editorData (as you shared)
    const category = categoryResponse?.data;

    const [createChapter] = useCreateChapterMutation();

    useEffect(() => {
        if (project) {
            setIsFinalizedLocal(project?.status === "revision" || project?.isFinalized);
        }
    }, [project]);

    useEffect(() => {
        const fetchAll = async () => {
            let result = {};

            for (const ch of chapterData) {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/task/${ch._id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const json = await res.json();
                result[ch._id] = json.data || [];
            }

            setTasksByChapter(result);
        };

        if (chapterData.length > 0) fetchAll();
    }, [chapterData]);

    const responsible = project?.responsibleAnalyst;
    const assigned = project?.assignedAnalysts || [];

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (project) setEditMode(project.isEditable);
    }, [project]);

    const handleCreateTask = async (chapterId) => {
        if (!newTaskName.trim()) return;

        try {
            const response = await toast.promise(
                createTask({ name: newTaskName, chapterId }).unwrap(),
                {
                    pending: "Se adaugă task-ul...",
                    success: "Task adăugat cu succes!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Eroare la adăugarea taskului!";
                        },
                    },
                },
                { autoClose: 2000, toastId: `create-task-${chapterId}` }
            );

            refetchProgress();

            setTasksByChapter((prev) => ({
                ...prev,
                [chapterId]: [...(prev[chapterId] || []), response.data],
            }));

            setShowTaskForm(false);
            setNewTaskName("");
        } catch (error) {
            console.error(error);
        }
    };

    const navigate = useNavigate();
    const goBack = () => navigate("/");

    const handleAddObservation = async (notes) => {
        if (!projectId) return toast.error("Project not selected");
        if (!notes || !notes.trim()) return toast.error("Observația este goală");

        setShowPleaseWait(true);

        try {
            await toast.promise(
                createObservation({ projectId, text: notes.trim() }).unwrap(),
                {
                    pending: "Se salvează observația...",
                    success: "Observație adăugată! Proiect marcat ca observation.",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Nu s-a putut salva observația";
                        },
                    },
                },
                { autoClose: 2000, toastId: `add-observation-${projectId}` }
            );

            setAllBtn(true);
            setShowReviewPopup(false);
        } catch (err) {
            console.error(err);
        } finally {
            setShowPleaseWait(false);
        }
    };

    const handleToggleEdit = async () => {
        const newValue = !editMode;
        setEditMode(newValue);

        try {
            await updateEditable({ projectId, isEditable: newValue }).unwrap();
            toast.success(`Modul de editare ${newValue ? "ACTIVAT" : "DEZACTIVAT"}`);
        } catch (err) {
            toast.error("Actualizarea modului de editare a eșuat");
        }
    };

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return "0h00m";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m.toString().padStart(2, "0")}m`;
    };

    const handleFinalize = async (statusType) => {
        setIsFinalizedLocal(true);
        setShowPleaseWait(true);
        setAllBtn(true);

        try {
            await toast.promise(
                finalizeTask({ id: projectId, status: statusType }).unwrap(),
                {
                    pending: "Se trimite din nou la revizie...",
                    success: "Project trimis la revizie!",
                    error: {
                        render({ data }) {
                            return data?.data?.message || "Finalization error!";
                        },
                    },
                },
                { autoClose: 2000, toastId: `finalize-${projectId}-${statusType}` }
            );
        } catch (err) {
            console.error(err);
            setIsFinalizedLocal(false);
            setAllBtn(false);
        } finally {
            setShowPleaseWait(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.trim().split(" ");
        const first = parts[0]?.charAt(0).toUpperCase() || "";
        const last = parts[parts.length - 1]?.charAt(0).toUpperCase() || "";
        return first + last;
    };

    let totalWorkedSeconds = 0;
    let analystWorkMap = {};

    chapterData.forEach((ch) => {
        const chapterTasks = tasksByChapter[ch._id] || [];
        chapterTasks.forEach((task) => {
            totalWorkedSeconds += task.totalSeconds || 0;

            if (task.analyst?._id) {
                const id = task.analyst._id.toString();
                if (!analystWorkMap[id]) analystWorkMap[id] = 0;
                analystWorkMap[id] += task.totalSeconds || 0;
            }
        });
    });

    const allTasks = Object.values(tasksByChapter).flat();
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.completed).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const analystTimes = Object.entries(analystWorkMap)
        .map(([analystId, sec]) => {
            const taskAnalyst = allTasks.find((t) => t.analyst?._id?.toString() === analystId)?.analyst;
            if (!taskAnalyst) return null;
            return `${getInitials(taskAnalyst.name)} - ${formatTime(sec)}`;
        })
        .filter(Boolean);

    const addWatermarkToAllPages = (pdf) => {
        const pageCount = pdf.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const text = "CONFIDENTIAL";
        const fontSize = 80;
        const angle = 45;

        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.saveGraphicsState();

            pdf.setFont("helvetica");
            pdf.setFontSize(fontSize);
            pdf.setTextColor(180, 180, 180);
            pdf.setGState(new pdf.GState({ opacity: 0.2 }));

            const textWidth = (pdf.getStringUnitWidth(text) * fontSize) / pdf.internal.scaleFactor;
            const x = pageWidth / 2 + textWidth * 0.18;
            const y = pageHeight / 2 + fontSize * 0.95;

            pdf.text(text, x, y, { align: "center", angle });
            pdf.restoreGraphicsState();
        }
    };

    const waitForImages = async (root) => {
        const imgs = Array.from(root.querySelectorAll("img"));

        await Promise.all(
            imgs.map(
                (img) =>
                    new Promise((resolve) => {
                        // already loaded
                        if (img.complete && img.naturalWidth > 0) return resolve();

                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                    })
            )
        );
    };


    const handleExportPDF = async () => {
        try {
            if (!projectId) {
                toast.error("Project not selected");
                return;
            }

            const editorData = category?.editorData;
            if (!editorData) {
                toast.error("Editor data not found");
                return;
            }

            // 1) Extract keys
            const keys = extractTokensFromEditorData(editorData);

            // 2) Fetch shortcode values
            const shortcodeMap = keys.length
                ? (await fetchProjectShortcodes({ projectId, keys }).unwrap())?.data || {}
                : {};

            // 3) EditorJS -> HTML
            const finalHtml = editorDataToHtml(editorData, shortcodeMap);
            setExportHtml(finalHtml);

            // ✅ wait for DOM update
            await new Promise((r) => setTimeout(r, 50));

            const exportEl = document.getElementById("export-report");
            if (!exportEl) {
                toast.error("Export content not found");
                return;
            }

            // ✅ wait for images to load
            await waitForImages(exportEl);

            // ✅ canvas
            const canvas = await html2canvas(exportEl, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                allowTaint: true,
                imageTimeout: 15000,
                windowWidth: exportEl.scrollWidth,
                windowHeight: exportEl.scrollHeight,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            addWatermarkToAllPages(pdf);
            pdf.save(`project-${projectId}-report.pdf`);
        } catch (e) {
            console.error(e);
            toast.error("PDF export failed");
        }
    };


    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* ================= EXPORTABLE CONTENT ================= */}
            <div
                id="export-report"
                style={{
                    position: "absolute",
                    top: 0,
                    left: "-9999px",
                    width: "210mm",
                    background: "white",
                }}
            >
                {/* ✅ This is what gets captured by html2canvas */}
                <div className="report-root" dangerouslySetInnerHTML={{ __html: exportHtml }} />
            </div>

            <Details
                isFinalizedLocal={isFinalizedLocal}
                setShowReviewPopup={setShowReviewPopup}
                handleFinalize={handleFinalize}
                isObservation={isObservation}
                setShowEditingPopup={setShowEditingPopup}
                progress={progress}
                completedTasks={completedTasks}
                totalTasks={totalTasks}
                editMode={editMode}
                handleToggleEdit={handleToggleEdit}
                formatTime={formatTime}
                totalWorkedSeconds={totalWorkedSeconds}
                analystTimes={analystTimes}
                responsible={responsible}
                getInitials={getInitials}
                assigned={assigned}
                legendColors={legendColors}
                onExportPDF={handleExportPDF}
                projectId={projectId}
                project={project}
                status={pro}
            />

            <div className="task-container" style={{ padding: "16px 24px", marginTop: "12px" }}>
                <h3> Capitole </h3>
            </div>

            <Chapter
                data={chapterData}
                tasksByChapter={tasksByChapter}
                setTasksByChapter={setTasksByChapter}
                getInitials={getInitials}
                isFinalizedLocal={isFinalizedLocal}
                editMode={editMode}
                formatTime={formatTime}
                refetchProgress={refetchProgress}
                setActiveChapterId={setActiveChapterId}
                setShowTaskForm={setShowTaskForm}
                refetchChapters={refetchChapters}
                projectId={projectId}
            />

            <div className="task-container">
                {/* BOTTOM TASK FORM */}
                {showTaskForm && (user?.role === "admin" || user?.role === "manager") && (
                    <div className="task-form-container">
                        <div className="task-form">
                            <h3>Adauga Task Nou</h3>

                            <input
                                type="text"
                                className="task-input"
                                placeholder="Introdu numele taskului"
                                value={newTaskName}
                                onChange={(e) => setNewTaskName(e.target.value)}
                            />

                            <div className="task-form-buttons">
                                <button
                                    className="task-cancel-btn"
                                    onClick={() => {
                                        setShowTaskForm(false);
                                        setNewTaskName("");
                                    }}
                                >
                                    Anuleaza
                                </button>

                                <button className="task-submit-btn" onClick={() => handleCreateTask(activeChapterId)}>
                                    Adauga
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showReviewPopup && (
                    <ReviewPopUp
                        onClose={() => setShowReviewPopup(false)}
                        onAddObservation={handleAddObservation}
                        observation={Observation?.data}
                    />
                )}

                {showEditingPopup && (
                    <ReviewPopUp
                        onClose={() => setShowReviewPopup(false)}
                        onAddObservation={handleAddObservation}
                        observation={Observation?.data || []}
                    />
                )}

                {showPleaseWait && (
                    <PleaseWaitPopUp
                        message="Vă rugăm să așteptați..."
                        subText="Se procesează finalizarea task-ului."
                    />
                )}

                {(user?.role === "admin" || user?.role === "manager") && (
                    <ChapterCreation mode={editMode} observe={isFinalizedLocal} projectId={projectId} createChapter={createChapter} />
                )}
            </div>

            <Outlet />
        </div>
    );
};

export default ProjectTasks;
