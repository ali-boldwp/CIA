import ProjectList from "../../../../Components/Project/List";
import {useEffect, useState} from "react";
import {useGetProjectsQuery} from "../../../../../services/projectApi";

import Layout from "../../../../../layouts";
import Header from "../../../Components/Header";

const ProjectsList = () => {

    const [ projects, setProjects ] = useState([]);

    const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery({ });

    useEffect( () => {

        if ( projectsData ) {

            // console.log( projectsData.data )

            setProjects( projectsData.data );

        }

    }, [ projectsData ]);

    return(
        <>
            <Layout
                header={
                    {
                        createProject: false,
                        search: false,
                        back: true,
                        title: <>Proiecte active în derulare <span className="count" style={{ fontSize: '12px' }}> {projects.length} proiecte</span> </>,
                        content: <Header createProject={ true } />
                    }
                }
                loading={ projectsLoading }
                content={ <ProjectList data={ projects } /> }
            />

        </>
    )

}

export default ProjectsList;