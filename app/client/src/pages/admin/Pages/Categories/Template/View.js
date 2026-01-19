import Header from "./Components/Header"
import Sidebar from "./Components/Sidebar";
import Content from "./Content"

import ChapterPopup from "./Popup/Chapter";
import TaskPopup from "./Popup/Task";
import FieldPopup from "./Popup/Field";
import TitlePopup from "./Popup/Title";
import TablePopup from "./Popup/Table";
import TableRecordsPopup from "./Popup/TableRecords";





import styles from "./style.module.css";
import { useMemo, useRef, useState, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import HeaderTool from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";
import ShortcodeTool from "./EditorTools/ShortcodeTool";
import { toast } from "react-toastify";
import { useUpdateCategoryMutation } from "../../../../../services/categoryApi";

const View = ({ data, categoryId, onChapterCreated }) => {

    // Chapter popup sate
    const [newChapterPopup, setNewChapterPopup] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);


    // Task popup State
    const [newTaskPopup, setNewTaskPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Field popup state
    const [newFieldPopup, setNewFieldPopup] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    // Title PopUp

    const [titlePopup, setTitlePopup] = useState(false);

    // Table Column popup state

    const [newColumnPopup, setNewColumnPopup] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState(null);


    // 🔹 Table Records popup state
    const [recordPopup, setRecordPopup] = useState(false);
    const [recordData, setRecordData] = useState(null);


    // For Set Data According to drag and drop

    const [localData, setLocalData] = useState(null);
    const [documentData, setDocumentData] = useState(null);
    const [savingDocument, setSavingDocument] = useState(false);
    const editorRef = useRef(null);
    const editorHolderId = useMemo(
        () => `category-template-editor-${categoryId || "new"}`,
        [categoryId]
    );
    const [updateCategory] = useUpdateCategoryMutation();

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const getInitialDocumentData = (content) => {
        if (!content) {
            return {
                time: Date.now(),
                blocks: [{ type: "paragraph", data: { text: "" } }],
                version: "2.30.0",
            };
        }

        if (typeof content === "string") {
            try {
                const parsed = JSON.parse(content);
                if (parsed?.blocks) return parsed;
            } catch (error) {
                console.warn("Document content is not JSON, using plain text.", error);
            }

            return {
                time: Date.now(),
                blocks: [{ type: "paragraph", data: { text: content } }],
                version: "2.30.0",
            };
        }

        if (content?.blocks) return content;

        return {
            time: Date.now(),
            blocks: [{ type: "paragraph", data: { text: "" } }],
            version: "2.30.0",
        };
    };

    useEffect(() => {
        if (!localData) return;

        const initialData = getInitialDocumentData(data?.content);
        setDocumentData(initialData);

        if (editorRef.current) {
            editorRef.current.destroy();
            editorRef.current = null;
        }

        editorRef.current = new EditorJS({
            holder: editorHolderId,
            data: initialData,
            placeholder: "Start typing your document...",
            tools: {
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                },
                header: {
                    class: HeaderTool,
                    inlineToolbar: true,
                    config: {
                        levels: [2, 3, 4],
                        defaultLevel: 2,
                    },
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                },
                table: {
                    class: Table,
                    inlineToolbar: true,
                },
                shortcode: {
                    class: ShortcodeTool,
                },
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            uploadByFile: (file) => {
                                return new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        resolve({
                                            success: 1,
                                            file: {
                                                url: reader.result,
                                            },
                                        });
                                    };
                                    reader.onerror = () => reject(reader.error);
                                    reader.readAsDataURL(file);
                                });
                            },
                        },
                    },
                },
            },
            onChange: async () => {
                if (!editorRef.current) return;
                const latestData = await editorRef.current.save();
                setDocumentData(latestData);
            },
        });

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, [data?.content, editorHolderId, localData]);

    const handleDocumentSave = async () => {
        if (!categoryId) {
            toast.error("Category ID missing");
            return;
        }

        setSavingDocument(true);

        try {
            const latestData = editorRef.current
                ? await editorRef.current.save()
                : documentData;

            await toast.promise(
                updateCategory({
                    id: categoryId,
                    title: localData?.title || data?.title || "",
                    content: JSON.stringify(latestData || {}),
                }).unwrap(),
                {
                    pending: "Se salvează...",
                    success: "Document actualizat cu succes",
                    error: "Actualizarea a eșuat",
                }
            );

            if (typeof onChapterCreated === "function") onChapterCreated();
        } catch (e) {
            console.error("Document save error:", e);
        } finally {
            setSavingDocument(false);
        }
    };

    if (!localData) return null;




    return (
        <>
            <div className={ styles.container }>
                <Header title={localData.name} />

                <div className={ styles.content }>
                    <Sidebar
                        data={localData}
                        setData={setLocalData}
                        openChapterNew={() => {
                            setSelectedChapter(null);
                            setNewChapterPopup(true);
                        }}
                        onEditChapter={(ch) => {
                            setSelectedChapter(ch);
                            setNewChapterPopup(true);
                        }}


                        openTaskNew={(chapter) => {
                            setSelectedTask({ chapterId: chapter._id });
                            setNewTaskPopup(true);
                        }}
                        onEditTask={(task, chapter) => {
                            setSelectedTask({
                                uid: task._id,
                                name: task.name,
                                content: task.content || "",
                                chapterId: chapter._id,
                                taskId: task._id,
                            });
                            setNewTaskPopup(true);
                        }}


                        openFieldNew={(task, chapter) => {
                            setSelectedField({
                                chapterId: chapter._id,
                                taskId: task._id,
                            });
                            setNewFieldPopup(true);
                        }}
                        onEditField={(field, task, chapter) => {
                            setSelectedField({
                                uid: field._id,
                                name: field.name,
                                slug: field.slug,
                                type: field.type,
                                chapterId: chapter._id,
                                taskId: task._id,
                            });
                            setNewFieldPopup(true);
                        }}

                        openColumnNew={(field, task, chapter) => {
                            setSelectedColumn({
                                chapterId: chapter._id,
                                taskId: task._id,
                                tableField: field,
                            });
                            setNewColumnPopup(true);
                        }}

                        onEditColumn={(column, field, task, chapter) => {
                            setSelectedColumn({
                                chapterId: chapter._id,
                                taskId: task._id,
                                tableField: field,
                                column: {
                                    uid: column._id,
                                    name: column.name,
                                    slug: column.slug,
                                    type: column.type || "text",
                                },
                            });
                            setNewColumnPopup(true);
                        }}

                        openTableRecords={(field, task, chapter) => {
                            setRecordData({
                                tableField: field,
                                taskId: task._id,
                            });
                            setRecordPopup(true);
                        }}


                    />



                    <div className={ styles.contentTemplate }>
                        <Content
                            data={localData}
                            onTitleClick={() => setTitlePopup(true)}
                        />

                        <div className={styles.editorSection}>
                            <div className={styles.editorHeader}>
                                <h2 className={styles.editorTitle}>Document Editor</h2>
                                <button
                                    className={styles.editorSaveBtn}
                                    onClick={handleDocumentSave}
                                    disabled={savingDocument}
                                >
                                    {savingDocument ? "Se salvează..." : "Salvează document"}
                                </button>
                            </div>

                            <div className={styles.editorWrap}>
                                <div
                                    id={editorHolderId}
                                    className={styles.editorHolder}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {newChapterPopup && (
                <ChapterPopup
                    open={newChapterPopup}
                    onClose={setNewChapterPopup}
                    categoryId={categoryId}
                    chapter={selectedChapter}
                    onCreated={onChapterCreated}
                />
            )}


                {newTaskPopup && (
                    <TaskPopup
                        open={newTaskPopup}
                        onClose={setNewTaskPopup}
                        chapterId={selectedTask?.chapterId}
                        task={selectedTask}
                        categoryId={categoryId}
                        onCreated={onChapterCreated}
                    />
                )}

            {newFieldPopup && (
                <FieldPopup
                    open={newFieldPopup}
                    onClose={setNewFieldPopup}
                    chapterId={selectedField?.chapterId}
                    taskId={selectedField?.taskId}
                    field={selectedField}
                    onCreated={onChapterCreated} // refetch
                />
            )}

            {newColumnPopup && (
                <TablePopup
                    open={newColumnPopup}
                    onClose={setNewColumnPopup}
                    chapterId={selectedColumn?.chapterId}
                    taskId={selectedColumn?.taskId}
                    tableField={selectedColumn?.tableField}
                    column={selectedColumn?.column || null}
                    onCreated={onChapterCreated}
                />


            )}



            {titlePopup && (
                <TitlePopup
                    open={titlePopup}
                    onClose={setTitlePopup}
                    categoryId={categoryId}
                    titleData={{
                        title: data?.title || "",
                        content: data?.content || "",
                    }}
                    onUpdated={onChapterCreated}
                />
            )}

            {recordPopup && (
                <TableRecordsPopup
                    open={recordPopup}
                    onClose={setRecordPopup}
                    tableField={recordData?.tableField}
                    taskId={recordData?.taskId}
                    onCreated={onChapterCreated}
                />
            )}









        </>
    )

}

export default View;
