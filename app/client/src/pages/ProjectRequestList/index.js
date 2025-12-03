import "./style.css";
import { useState } from "react";
import {Link} from "react-router-dom";
import ProjectRow from "./ProjectRow";
import { useGetProjectRequestsQuery } from "../../services/projectApi";

const ProjectRequestList = () => {

    const { data ,isLoading }=useGetProjectRequestsQuery();
    const project=data?.data || [];
    const projectRequest=project.filter((p)=>p.status=== "requested")

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("deadline");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [languageFilter, setLanguageFilter] = useState("all");

    const filtered = projectRequest
        .filter((p) => {
            // Search
            const searchText = search.toLowerCase();
            return (
                p.projectName?.toLowerCase().includes(searchText) ||
                p.projectSubject?.toLowerCase().includes(searchText) ||
                p.clientContactPerson?.toLowerCase().includes(searchText)
            );
        })
        .filter((p) => {
            // Priority Filter
            if (priorityFilter === "all") return true;
            return p.priority?.toLowerCase() === priorityFilter.toLowerCase();
        })
        .filter((p) => {
            // Language Filter
            if (languageFilter === "all") return true;
            return p.deliverableLanguage?.toLowerCase() === languageFilter.toLowerCase();
        })
        .sort((a, b) => {
            // Sorting
            if (sortBy === "deadline") {
                return new Date(a.deadline) - new Date(b.deadline);
            }
            if (sortBy === "name") {
                return a.projectName.localeCompare(b.projectName);
            }
            return 0;
        });

    const isFiltering =
        search.trim() !== "" ||
        priorityFilter !== "all" ||
        languageFilter !== "all" ||
        sortBy !== "deadline";

    const finalData = isFiltering ? filtered : projectRequest;

    return (
       <div className="RequestList">
           <div className="top-header-box">
               <Link to="/manager/dashboard" className="back-gradient-btn">
                   ← Înapoi la Dashboard
               </Link>

               <h2 className="header-title">
                   Solicitări proiect — <span>De revizuit</span>
               </h2>
           </div>

           <div className="filter-header-box">

               {/* Search Bar */}
               <div className="search-box1">
                   <span className="search-icon">🔍</span>
                   <input
                       type="text"
                       placeholder="Caută: persoană / tip / subiect"
                       className="search-input1"
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                   />
               </div>

               {/* Dropdown Filters */}
               <div className="filters">

                   <select
                       className="filter-select"
                       value={sortBy}
                       onChange={(e) => setSortBy(e.target.value)}
                   >
                       <option value="deadline">După deadline</option>
                       <option value="name">După nume</option>
                   </select>

                   <select
                       className="filter-select"
                       value={priorityFilter}
                       onChange={(e) => setPriorityFilter(e.target.value)}
                   >
                       <option value="all">Toate prioritățile</option>
                       <option value="Urgent">Urgent</option>
                       <option value="Normal">Normal</option>
                       <option value="Confidențial">Confidențial</option>
                   </select>

                   <select
                       className="filter-select"
                       value={languageFilter}
                       onChange={(e) => setLanguageFilter(e.target.value)}
                   >
                       <option value="all">Toate limbile</option>
                       <option value="RO">Română</option>
                       <option value="EN">Engleză</option>
                   </select>
               </div>
           </div>
           <ProjectRow projects={finalData} />

       </div>
    );
};

export default ProjectRequestList;
