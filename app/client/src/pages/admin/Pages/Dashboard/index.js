import Stats from "../../Components/Stats"
import { useGetProjectRequestsQuery, useGetProjectsQuery } from "../../../../services/projectApi";
import {useEffect, useState} from "react";

import { useGetStatsQuery } from "../../../../services/V1/statesApi";

import ProjectList from "../../../Components/Project/List";
import Team from "../../Components/Team/Team"
import CalenderList from "../../Components/CalenderList"

import Layout from "../../../../layouts";
import Header from "../../Components/Header";

const View = () => {

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

    const { data: statsData, isLoading: statsLoading } = useGetStatsQuery();
    const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery({ limit: 5 });

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

    return (
        <Layout
            loading={ statsLoading || projectsLoading }
            header={
                {
                    content: <Header createProject={ true } />
                }
            }
            content={
                <>
                    <Stats stats={ stats } />
                    <ProjectList data={ projects } header={true} />
                    <Team />
                    <CalenderList />
                </>
            }
        />

    )

}

export default View