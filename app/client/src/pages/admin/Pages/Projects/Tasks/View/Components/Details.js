import React, {useState} from 'react';
import { useGetCreateProjectByIdQuery } from "../../../../../../../services/projectApi";
import {useGetTaskByIdQuery,useGetChapterByIdQuery} from "../../../../../../../services/taskApi";
import './Detail.css'

const Details = ({projectId, taskId}) => {
    const [tasksByChapter, setTasksByChapter] = useState({});
    const { data:projectData}=useGetCreateProjectByIdQuery(projectId,{
        skip:!projectId
    })
    const { data:taskData } = useGetTaskByIdQuery(taskId,{
        skip:!taskId
    })
    const task=taskData?.data || [];
    const chapterID=task.chapterId;
    const { data:chapterData }=useGetChapterByIdQuery(chapterID,{
        skip:!chapterID
    })
    const project=projectData?.data || [];
    const chapter=chapterData?.data ||[];

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return "0h00m";

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);

        return `${h}h ${m.toString().padStart(2, "0")}m`;
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

    chapter.forEach(ch => {
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

    const analystTimes = Object.entries(analystWorkMap)
        .map(([analystId, sec]) => {
            const taskAnalyst = allTasks.find(
                t => t.analyst?._id?.toString() === analystId
            )?.analyst;

            if (!taskAnalyst) return null;

            return `${getInitials(taskAnalyst.name)} - ${formatTime(sec)}`;
        })
        .filter(Boolean);
    return (
        <div className="mainDetail">
          <div className="fullDetail">
        <div>
            project : {project.projectName}
        </div>
            <div>
                task : {task.name}
            </div>
            <div>chapter: {chapter.name}</div>
          </div>
            <div className="time-box">
                <p className="time-title">REZUMAT TIMP LUCRU</p>

                <p className="time-info">
                    Timp total lucrat:
                    <strong> {formatTime(totalWorkedSeconds)} </strong>
                    · Estimare ramas:
                    <strong> 00h 00m</strong>
                </p>

                <p className="analyst-times">
                    {analystTimes.length ? analystTimes.join(" | ") : "-"}
                </p>


            </div>
        </div>
    );
};

export default Details;