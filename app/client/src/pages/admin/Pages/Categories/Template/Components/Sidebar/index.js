import styles from "./style.module.css";
import {DragDropContext, Draggable, Droppable,} from "@hello-pangea/dnd";
import {useState} from "react";

const Sidebar = ({ data: _data, openChapterNew }) => {

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
                                                      <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="15px" height="15px" viewBox="0 0 32 32" id="Layer_1" data-name="Layer 1"><path d="M18.85,6.41c.15,.21,.38,.33,.62,.33,.14,0,.29-.04,.42-.13,.34-.23,.43-.7,.2-1.04l-1.08-1.59c-.23-.34-.7-.43-1.04-.2-.34,.23-.43,.7-.2,1.04l1.08,1.59Z"/><path d="M7.17,11.75c.09,.03,.18,.05,.27,.05,.3,0,.59-.18,.7-.48l.73-1.91c.15-.39-.04-.82-.43-.97-.38-.15-.82,.04-.97,.43l-.73,1.91c-.15,.39,.04,.82,.43,.97Z"/><path d="M24.68,18.13c-.41-.04-.78,.25-.83,.66l-.2,1.81c-.04,.41,.25,.78,.67,.83,.03,0,.05,0,.08,0,.38,0,.7-.28,.75-.67l.2-1.81c.04-.41-.25-.78-.67-.83Z"/><path d="M12.35,24.31l-1.66,.39c-.4,.09-.65,.5-.56,.9,.08,.35,.39,.58,.73,.58,.06,0,.12,0,.17-.02l1.66-.39c.4-.09,.65-.5,.56-.9-.1-.4-.51-.65-.9-.56Z"/><path d="M30.73,16.27c0-.09,.01-.18,.01-.27C30.75,7.87,24.13,1.25,16,1.25S1.72,7.43,1.29,15.19c-.04,.09-.07,.19-.07,.3,0,.08,.02,.16,.04,.24,0,.09-.01,.18-.01,.27,0,8.13,6.62,14.75,14.75,14.75s14.28-6.18,14.71-13.94c.04-.09,.07-.19,.07-.3,0-.08-.02-.16-.04-.24ZM16,2.75c6.94,0,12.64,5.36,13.19,12.16-.18-.09-.37-.16-.62-.16-.74,0-1.12,.53-1.33,.81-.03,.04-.07,.1-.1,.14-.03-.04-.07-.1-.1-.14-.2-.28-.58-.81-1.32-.81s-1.12,.53-1.32,.81c-.03,.04-.07,.1-.1,.14-.03-.04-.07-.1-.1-.14-.13-.18-.34-.45-.66-.63-.52-3.7-3.69-6.55-7.53-6.55s-7.04,2.88-7.54,6.6c-.2-.13-.44-.24-.76-.24-.74,0-1.12,.53-1.33,.81-.03,.04-.07,.1-.1,.14-.03-.04-.07-.1-.1-.14-.2-.28-.58-.81-1.32-.81s-1.12,.53-1.32,.81c-.03,.04-.07,.1-.1,.14-.03-.04-.07-.1-.1-.14-.11-.15-.28-.38-.52-.55C3.31,8.17,9.03,2.75,16,2.75Zm6.12,13.25c0,3.37-2.74,6.12-6.12,6.12-3.19,0-5.82-2.46-6.09-5.59,0,0,0,0,0-.01,0,0,0-.02,0-.03-.01-.16-.02-.32-.02-.48,0-3.37,2.74-6.11,6.11-6.11,3.19,0,5.82,2.46,6.09,5.59,0,0,0,.01,0,.02,0,.01,0,.02,0,.03,.01,.16,.02,.32,.02,.48Zm-6.12,13.25c-6.94,0-12.64-5.36-13.19-12.16,.17,.09,.37,.16,.62,.16,.74,0,1.12-.53,1.32-.82,.03-.04,.07-.09,.1-.14,.03,.04,.07,.1,.1,.14,.2,.28,.58,.81,1.32,.81s1.12-.53,1.32-.81c.03-.04,.07-.1,.1-.14,.03,.04,.07,.1,.1,.14,.13,.18,.34,.45,.66,.63,.52,3.7,3.69,6.55,7.53,6.55s7.04-2.88,7.54-6.6c.2,.13,.44,.24,.75,.24,.74,0,1.12-.53,1.32-.82,.03-.04,.07-.09,.1-.14,.03,.04,.07,.1,.1,.14,.2,.28,.58,.81,1.32,.81s1.12-.53,1.33-.81c.03-.04,.07-.1,.1-.14,.03,.04,.07,.1,.1,.14,.11,.15,.28,.38,.52,.55-.51,6.85-6.23,12.26-13.2,12.26Z"/></svg>
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
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24">
                                                                                      <g fill="none" fill-rule="evenodd">
                                                                                        <path fill="#000000" fill-rule="nonzero" d="M10,4.5 C10,4.77614237 9.77614237,5 9.5,5 C9.22385763,5 9,4.77614237 9,4.5 C9,3.67157288 9.67157288,3 10.5,3 L13.5,3 C14.3284271,3 15,3.67157288 15,4.5 C15,4.77614237 14.7761424,5 14.5,5 C14.2238576,5 14,4.77614237 14,4.5 C14,4.22385763 13.7761424,4 13.5,4 L10.5,4 C10.2238576,4 10,4.22385763 10,4.5 Z M6.5,4 C6.77614237,4 7,4.22385763 7,4.5 C7,4.77614237 6.77614237,5 6.5,5 C5.67157288,5 5,5.67157288 5,6.5 L5,18.5 C5,19.3284271 5.67157288,20 6.5,20 L17.5,20 C18.3284271,20 19,19.3284271 19,18.5 L19,6.5 C19,5.67157288 18.3284271,5 17.5,5 C17.2238576,5 17,4.77614237 17,4.5 C17,4.22385763 17.2238576,4 17.5,4 C18.8807119,4 20,5.11928813 20,6.5 L20,18.5 C20,19.8807119 18.8807119,21 17.5,21 L6.5,21 C5.11928813,21 4,19.8807119 4,18.5 L4,6.5 C4,5.11928813 5.11928813,4 6.5,4 Z"/>
                                                                                        <path fill="#000000" fill-rule="nonzero" d="M15.1464466,9.14644661 C15.3417088,8.95118446 15.6582912,8.95118446 15.8535534,9.14644661 C16.0488155,9.34170876 16.0488155,9.65829124 15.8535534,9.85355339 L10.8535534,14.8535534 C10.6582912,15.0488155 10.3417088,15.0488155 10.1464466,14.8535534 L8.14644661,12.8535534 C7.95118446,12.6582912 7.95118446,12.3417088 8.14644661,12.1464466 C8.34170876,11.9511845 8.65829124,11.9511845 8.85355339,12.1464466 L10.5,13.7928932 L15.1464466,9.14644661 Z"/>
                                                                                      </g>
                                                                                    </svg>
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
                                                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="15px" height="15px" viewBox="0 0 24 24">
                                                                                                                  <path d="M7,7 L7,12 L8.5,12 C8.77614237,12 9,12.2238576 9,12.5 C9,12.7761424 8.77614237,13 8.5,13 L4.5,13 C4.22385763,13 4,12.7761424 4,12.5 C4,12.2238576 4.22385763,12 4.5,12 L6,12 L6,7 L4,7 L4,7.5 C4,7.77614237 3.77614237,8 3.5,8 C3.22385763,8 3,7.77614237 3,7.5 L3,6.5 C3,6.22385763 3.22385763,6 3.5,6 L9.5,6 C9.77614237,6 10,6.22385763 10,6.5 L10,7.5 C10,7.77614237 9.77614237,8 9.5,8 C9.22385763,8 9,7.77614237 9,7.5 L9,7 L7,7 Z M12.5,7 C12.2238576,7 12,6.77614237 12,6.5 C12,6.22385763 12.2238576,6 12.5,6 L18.5,6 C19.8807119,6 21,7.11928813 21,8.5 L21,16.5 C21,17.8807119 19.8807119,19 18.5,19 L6.5,19 C5.11928813,19 4,17.8807119 4,16.5 L4,15.5 C4,15.2238576 4.22385763,15 4.5,15 C4.77614237,15 5,15.2238576 5,15.5 L5,16.5 C5,17.3284271 5.67157288,18 6.5,18 L18.5,18 C19.3284271,18 20,17.3284271 20,16.5 L20,8.5 C20,7.67157288 19.3284271,7 18.5,7 L12.5,7 Z"/>
                                                                                                                </svg>
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
                                    <li onClick={ () => openChapterNew( true ) }> Add New Chapter </li>
                                </ul>)}
                        </Droppable>


                    </li>
                </ul>
            </DragDropContext>
        </div>);
};

export default Sidebar;
