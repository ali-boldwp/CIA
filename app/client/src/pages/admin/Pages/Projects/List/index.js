import ProjectList from "../../../../Components/Project/List";
import {useEffect, useState} from "react";
import {useGetProjectsQuery} from "../../../../../services/projectApi";

const ProjectsList = () => {

    const [ projects, setProjects ] = useState([]);

    const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery({ });

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

    return(
        <ProjectList data={ projects } />
    )

}

export default ProjectsList;