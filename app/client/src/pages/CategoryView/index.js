import './CategoryView.css'
import { useState } from "react";
import Header from './Components/Header'
import AddButton from "./Components/AddButton/AddButton";
import CategoryViewform from "./Components/CategoryViewform/CategoryViewform";
import {useParams} from "react-router-dom";
import { useGetCategoryByIdQuery } from "../../services/categoryApi";

const CategoryView = () => {
    const {id:CategoryId} =useParams();
    const { data:categoryData }=useGetCategoryByIdQuery(CategoryId,{
        skip:!CategoryId
    })
    const category=categoryData?.data || [];
    const [showForm, setShowForm] = useState(false);
    return(
        <div className="CategoryView">
            <Header category={category} />
            {showForm &&
           <CategoryViewform/>
            }
            <AddButton setShowForm={setShowForm}/>
        </div>
    );
}
export default CategoryView;