import styles from "./style.module.css";
import {DragDropContext, Draggable, Droppable,} from "@hello-pangea/dnd";
import {useState} from "react";

const Sidebar = ({ data: _data }) => {

    const [ data, setData ] = useState( _data );

    const onDragEnd = (result) => {

        if (!result.destination) return;

        const {source, destination, type} = result;

        const newData = {...data};

        if (type === "CHAPTER") {
            const arr = Array.from(newData.chapters);
            const [moved] = arr.splice(source.index, 1);
            arr.splice(destination.index, 0, moved);
            newData.chapters = arr;
            return setData(newData);
        }

        if (type.startsWith("TASK")) {
            const chapIdx = Number(type.split("-")[1]);
            const arr = Array.from(newData.chapters[chapIdx].tasks);
            const [moved] = arr.splice(source.index, 1);
            arr.splice(destination.index, 0, moved);
            newData.chapters[chapIdx].tasks = arr;
            return setData(newData);
        }

        if (type.startsWith("FIELD")) {
            const [_, chapIdx, taskIdx] = type.split("-");
            const arr = Array.from(newData.chapters[chapIdx].tasks[taskIdx].foamFields);
            const [moved] = arr.splice(source.index, 1);
            arr.splice(destination.index, 0, moved);
            newData.chapters[chapIdx].tasks[taskIdx].foamFields = arr;
            return setData(newData);
        }

    };

    return (<div className={styles.wrapper}>
            <DragDropContext onDragEnd={onDragEnd}>
                <ul>
                    <li>
                        <span>{data.name}</span>

                        {/* CHAPTERS LIST */}
                        <Droppable droppableId="chapters" type="CHAPTER">
                            {(prov) => (
                                <ul ref={prov.innerRef} {...prov.droppableProps}>
                                    {data.chapters.map((chapter, ci) => (
                                        <Draggable
                                            key={chapter._id}
                                            draggableId={chapter._id}
                                            index={ci}
                                        >
                                            {(prov) => (
                                                <li ref={prov.innerRef} {...prov.draggableProps}>
                                                  <span {...prov.dragHandleProps}>
                                                    {chapter.name}
                                                  </span>

                                                    {/* TASKS LIST */}
                                                    <Droppable
                                                        droppableId={`tasks-${ci}`}
                                                        type={`TASK-${ci}`}
                                                    >
                                                        {(prov) => (
                                                            <ul ref={prov.innerRef} {...prov.droppableProps}>
                                                                {chapter.tasks.map((task, ti) => (
                                                                    <Draggable
                                                                        key={task._id}
                                                                        draggableId={task._id}
                                                                        index={ti}
                                                                    >
                                                                        {(prov) => (
                                                                            <li
                                                                                ref={prov.innerRef}
                                                                                {...prov.draggableProps}
                                                                            >
                                                                                <span {...prov.dragHandleProps}>
                                                                                  {task.name}
                                                                                </span>

                                                                                {/* FOAMFIELDS LIST */}
                                                                                <Droppable
                                                                                    droppableId={`fields-${ci}-${ti}`}
                                                                                    type={`FIELD-${ci}-${ti}`}
                                                                                >
                                                                                    {(prov) => (
                                                                                        <ul
                                                                                            ref={prov.innerRef}
                                                                                            {...prov.droppableProps}
                                                                                        >
                                                                                            {task.foamFields.map((field, fi) => (
                                                                                                <Draggable
                                                                                                    key={field._id}
                                                                                                    draggableId={field._id}
                                                                                                    index={fi}
                                                                                                >
                                                                                                    {(prov) => (
                                                                                                        <li
                                                                                                            ref={prov.innerRef}
                                                                                                            {...prov.draggableProps}
                                                                                                        >
                                                                                                            <span
                                                                                                                {...prov.dragHandleProps}
                                                                                                            >
                                                                                                              {field.name}
                                                                                                            </span>
                                                                                                        </li>)}
                                                                                                </Draggable>))}
                                                                                            {prov.placeholder}
                                                                                        </ul>)}
                                                                                </Droppable>

                                                                            </li>)}
                                                                    </Draggable>))}
                                                                {prov.placeholder}
                                                            </ul>)}
                                                    </Droppable>

                                                    {/* your extra static nodes still here */}

                                                </li>)}
                                        </Draggable>))}
                                    {prov.placeholder}
                                    <li> Add New Chapter </li>
                                </ul>)}
                        </Droppable>


                    </li>
                </ul>
            </DragDropContext>
        </div>);
};

export default Sidebar;
