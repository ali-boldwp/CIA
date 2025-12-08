import {useGetProjectsQuery} from "../../../../../services/projectApi";
import {useEffect, useState} from "react";
import ProjectList from "../../../../Components/Project/List";
import {useParams} from "react-router-dom";

const ProjectSearch = () => {

    const params = useParams();

    console.log( "Paramiter ", params )

    const { keyword } = useParams();

    const [ projects, setProjects ] = useState([]);

    // call RTK Query — include search param, and maybe paging if needed
    const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery({
        search: keyword || "",
        limit: 10
        // optionally, page: 1, limit: 20
    });

    useEffect( () => {

        if ( projectsData ) {

            // console.log( projectsData.data )

            setProjects( projectsData.data );

        }

    }, [ projectsData ]);

    if ( projectsLoading ) {

        return (
            <div className="spinner"></div>
        )

    }

    return (
        <>
            { keyword }
            <ProjectList data={ projects } />
        </>
    );

}

export default ProjectSearch;