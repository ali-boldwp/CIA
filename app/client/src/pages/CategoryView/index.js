import './CategoryView.css'
import { useState } from "react";
import Header from './Components/Header'
import AddButton from "./Components/AddButton/AddButton";
import CategoryViewform from "./Components/CategoryViewform/CategoryViewform";
const CategoryView = () => {
    const [showForm, setShowForm] = useState(false);
    return(
        <div className="CategoryView">
            <Header/>
            {showForm &&
           <CategoryViewform/>
            }
            <AddButton setShowForm={setShowForm}/>
        </div>
    );
}
export default CategoryView;