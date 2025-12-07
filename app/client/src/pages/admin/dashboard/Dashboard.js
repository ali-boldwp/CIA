import Stats from "../Components/Stats"
import { useGetProjectRequestsQuery, useGetProjectsQuery } from "../../../services/projectApi";
import {useEffect, useState} from "react";

import ProjectList from "../../Components/Project/List";

const Dashboard = () => {

    const [ stats, setStats ] = useState({
        projects: 5,
        hument: 5,
        analyst: {
            total: 10,
            free: 5
        },
        completed: 90,
        requested: {
            projects: 5,
            huments: 3
        },
        messages: 2
    });
    const [ projects, setProjects ] = useState([]);

    const { data: statsData, isLoading: statsLoading } = useGetProjectRequestsQuery();
    const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();

    useEffect( () => {

        if ( statsData ) {

            setStats( statsData.data );

        }

    }, [ statsData ]);

    useEffect( () => {

        if ( projectsData ) {

            // console.log( projectsData.data )

            setProjects( projectsData.data );

        }

    }, [ projectsData ]);

    if ( statsLoading || projectsLoading ) {

        return (
            <div className="spinner"></div>
        )

    }

    return (
        <>
            <Stats stats={ stats } />
            <ProjectList data={ projects } />
        </>

    )

}

export default Dashboard