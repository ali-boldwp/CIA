import { useState } from "react";
import "./style.css";
import Header from "../../../../../CategoryView/Components/Header";
import AddButton from "../Component/AddButton/AddButton";
import TaskViewFoam from "../Component/TaskViewFoam/TaskViewFoam";

const Index = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="CategoryView">
            <Header />

            {showForm && <TaskViewFoam />}

            <AddButton setShowForm={setShowForm} />
        </div>
    );
};

export default Index;
