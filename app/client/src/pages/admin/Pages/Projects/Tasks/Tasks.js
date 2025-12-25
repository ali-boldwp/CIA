import "./TaskPage.css"
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
    useCreateChapterMutation,
    useCreateTaskMutation,
    useGetChapterByIdQuery,
    useStartTaskMutation,
    usePauseTaskMutation,
    useResumeTaskMutation,
    useCompleteTaskMutation,
    useUpdateEditableMutation,
    useFinalizeTaskMutation,
    useCreateObservationMutation,
    useGetObservationsByProjectQuery,
} from "../../../../../services/taskApi";
import { useGetCreateProjectByIdQuery , useGetAnalystsProjectProgressQuery } from "../../../../../services/projectApi";
import {toast} from "react-toastify";
import {FiEdit2, FiTrash2} from "react-icons/fi";
import ChapterCreation from "../../../../taskPage/components/ChapterCreation";
import ReviewPopUp from "./Popup/ReviewPop/ReviewPopUp";
import EditingPopUp from "./Popup/EditingPopUp/EditingPopUp";
import PleaseWaitPopUp from "./Popup/PleaseWaitPopUp/PleaseWaitPopUp";
import Chapter from "./Components/Chapter";
import Details from "./Components/Details";




const ProjectTasks = ({
    projectData
}) => {

    const { user } = useSelector((state) => state.auth);

    const { id: projectId } = useParams();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [activeChapterId, setActiveChapterId] = useState(null);

    const [tasksByChapter, setTasksByChapter] = useState({});
    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [showEditingPopup, setShowEditingPopup] = useState(false);
    const [showPleaseWait, setShowPleaseWait] = useState(false);
    const [allBtn,setAllBtn]=useState(false);
    const [isFinalizedLocal, setIsFinalizedLocal] = useState(false);



    const [updateEditable] = useUpdateEditableMutation();
    const [finalizeTask, { isLoading: isFinalizing }] = useFinalizeTaskMutation();
    const [createObservation, { isLoading: isCreatingObservation }] = useCreateObservationMutation();
    const {data:Observation, isLoading: isObservationLoading } = useGetObservationsByProjectQuery(projectId, {
        skip: !projectId,
    });





    const { data: analystsProgress , refetch: refetchProgress} = useGetAnalystsProjectProgressQuery(projectId);

    const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
    const {data:pro}=useGetCreateProjectByIdQuery(projectId,{
        ship:!projectId
    })

    const {data:chapter, refetch: refetchChapters}=useGetChapterByIdQuery(projectId, {
        skip: !projectId,
    });
    const chapterData=chapter?.data || [];


    const legendColors = ["blue", "purple", "green", "red", "yellow", "pink"];

    // Fetch project info

    const project = projectData?.data;
    const isFinalized = project?.status === "revision" || project?.isFinalized;
    const isObservation = project?.status === "observation";



    const [createChapter] = useCreateChapterMutation();


    const analystId = project?.responsibleAnalyst?._id;
    const current = analystsProgress?.data?.find(
        (a) => a.analystId === analystId
    );
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
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const json = await res.json();

                result[ch._id] = json.data || [];
            }

            setTasksByChapter(result);
        };

        if (chapterData.length > 0) {
            fetchAll();
        }
    }, [chapterData]);


    const responsible = project?.responsibleAnalyst;
    const assigned = project?.assignedAnalysts || [];


    const [edit_Mode, setEdit_Mode] = useState(project?.isEditable ?? true);
    const [editMode, setEditMode] = useState( false );

    useEffect(() => {
        if (project) {
            setEditMode(project.isEditable);  // Always follow backend
        }
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

            // UI update
            setTasksByChapter((prev) => ({
                ...prev,
                [chapterId]: [...(prev[chapterId] || []), response.data],
            }));

            setShowTaskForm(false);
            setNewTaskName("");
        } catch (error) {
            console.error(error);
            // toast.promise already handled error
        }
    };

    const navigate=useNavigate();

    const goBack = () => {
        navigate("/");
    };

    const handleAddObservation = async (notes) => {
        if (!projectId) return toast.error("Project not selected");
        if (!notes || !notes.trim()) return toast.error("Observația este goală");

        setShowPleaseWait(true);

        try {
            await toast.promise(
                createObservation({
                    projectId,
                    text: notes.trim(),
                }).unwrap(),
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
            // toast.promise already handled error
        } finally {
            setShowPleaseWait(false);
        }
    };

    const handleToggleEdit = async () => {

        const newValue = !editMode;

        setEditMode(newValue);

        try {
            await updateEditable({
                projectId,
                isEditable: newValue
            }).unwrap();

            toast.success(`Modul de editare ${newValue ? "ACTIVAT" : "DEZACTIVAT"}`);
        } catch (err) {
            toast.error("Actualizarea modului de editare a eșuat");
            // setEditMode(!newValue); // revert if failed
        }
    };




    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return "0h00m";

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);

        return `${h}h ${m.toString().padStart(2, "0")}m`;
    };


    const handleFinalize = async (statusType) => {
        // UI immediate
        setIsFinalizedLocal(true);
        setShowPleaseWait(true);
        setAllBtn(true);

        try {
            await toast.promise(
                finalizeTask({
                    id: projectId,
                    status: statusType,
                }).unwrap(),
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

            // revert if backend fails
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

        return first + last;  // AP, BI, CM etc.
    };

    let totalWorkedSeconds = 0;
    let analystWorkMap = {};

    chapterData.forEach(ch => {
        const chapterTasks = tasksByChapter[ch._id] || [];

        chapterTasks.forEach(task => {
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
    const completedTasks = allTasks.filter(t => t.completed).length;
    const progress = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;


    const analystTimes = Object.entries(analystWorkMap)
        .map(([analystId, sec]) => {
            const taskAnalyst = allTasks.find(
                t => t.analyst?._id?.toString() === analystId
            )?.analyst;

            if (!taskAnalyst) return null;

            return `${getInitials(taskAnalyst.name)} - ${formatTime(sec)}`;
        })
        .filter(Boolean);

    // if (!projectId) return <p>No project selected.</p>;
    // if (isLoading) return <p>Loading project data...</p>;
    // if (isError) return <p>Error fetching project data!</p>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            <Details
                isFinalizedLocal={ isFinalizedLocal }
                setShowReviewPopup={ setShowReviewPopup }
                handleFinalize={ handleFinalize }
                isObservation={ isObservation }
                setShowEditingPopup={ setShowEditingPopup }
                progress={ progress }
                completedTasks={ completedTasks }
                totalTasks={ totalTasks }
                editMode={ editMode }
                handleToggleEdit={ handleToggleEdit }
                formatTime={ formatTime }
                totalWorkedSeconds={ totalWorkedSeconds }
                analystTimes={ analystTimes }
                responsible={ responsible }
                getInitials={ getInitials }
                assigned={ assigned }
                legendColors={ legendColors }
                projectId={ projectId }
                project={project}
                status={pro}
            />

            <div className="task-container" style={{ padding: "16px 24px", marginTop: '12px' }}>
                <h3> Capitole </h3>
            </div>

            <Chapter
                data={ chapterData }
                tasksByChapter={ tasksByChapter }
                setTasksByChapter={ setTasksByChapter }
                getInitials={ getInitials }
                isFinalizedLocal={ isFinalizedLocal }
                editMode={ editMode }
                formatTime={ formatTime }
                refetchProgress={ refetchProgress }
                setActiveChapterId={ setActiveChapterId }
                setShowTaskForm={ setShowTaskForm }
                refetchChapters={ refetchChapters }
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

                                <button
                                    className="task-submit-btn"
                                    onClick={() => handleCreateTask(activeChapterId)}
                                >
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

                {showPleaseWait  && (
                    <PleaseWaitPopUp
                        message="Vă rugăm să așteptați..."
                        subText="Se procesează finalizarea task-ului."
                    />
                )}

                {(user?.role === "admin" || user?.role === "manager") && (
                    <ChapterCreation
                        mode={editMode}
                        observe={isFinalizedLocal}
                        projectId={projectId}
                        createChapter={createChapter}
                    />
                )}

            </div>
            <Outlet/>
        </div>
    );

}

export default ProjectTasks;