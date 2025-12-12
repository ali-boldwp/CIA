import "./TaskPage.css"
import { useSelector } from "react-redux";
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
import { useGetCreateProjectByIdQuery , useGetAnalystsProgressQuery } from "../../../../../services/projectApi";
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





    const { data: analystsProgress , refetch: refetchProgress} = useGetAnalystsProgressQuery(projectId);

    const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();

    const {data:chapter}=useGetChapterByIdQuery(projectId, {
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
            const response = await createTask({
                name: newTaskName,
                chapterId,
            }).unwrap();
            refetchProgress();
            // Add task to UI immediately
            setTasksByChapter((prev) => ({
                ...prev,
                [chapterId]: [...(prev[chapterId] || []), response.data],
            }));

            // Close form
            setShowTaskForm(false);
            setNewTaskName("");
            toast("Task adăugat cu succes!");
        } catch (error) {
            toast.error("Eroare la adăugarea taskului!");
        }
    };
    const navigate=useNavigate();

    const goBack = () => {
        navigate("/");
    };

    const handleAddObservation = async (notes) => {
        if (!projectId) {
            toast.error("Project not selected");
            return;
        }
        if (!notes || !notes.trim()) {
            toast.error("Observația este goală");
            return;
        }

        try {
            setShowPleaseWait(true);
            const res = await createObservation({
                projectId,
                text: notes.trim(),
            }).unwrap();

            toast("Observație adăugată și proiect marcat ca observation");
            // optionally disable buttons / lock UI
            setAllBtn(true);

            // close popup or keep open depending on UX
            setShowReviewPopup(false);
        } catch (err) {
            console.error(err);
            toast.error("Nu s-a putut salva observația");
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

            toast.success(`Edit mode ${newValue ? "ON" : "OFF"}`);
        } catch (err) {
            toast.error("Failed to update edit mode");
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

        // UI Should Update Immediately
        setIsFinalizedLocal(true);

        setShowPleaseWait(true);
        setAllBtn(true);

        try {
            await finalizeTask({
                id: projectId,
                status: statusType,
            }).unwrap();

            toast("Project Revision!");

        } catch (err) {
            console.error(err);
            toast.error("Finalization error!");

            // Revert UI if backend fails
            setIsFinalizedLocal(false);

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
                    <ReviewPopUp onClose={() => setShowReviewPopup(false)} onAddObservation={handleAddObservation} />
                )}

                {showEditingPopup && (
                    <EditingPopUp final={()=>handleFinalize("revision")} data={Observation?.data || []} onClose={() => setShowEditingPopup(false)} />
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
        </div>
    );

}

export default ProjectTasks;