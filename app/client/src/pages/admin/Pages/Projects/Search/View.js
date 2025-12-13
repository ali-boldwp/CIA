import {useEffect, useState} from "react";
import ProjectList from "../../../../Components/Project/List";
import {useParams} from "react-router-dom";

const ProjectSearch = ({ data }) => {

    const params = useParams();

    const { keyword } = useParams();

    const [ projects, setProjects ] = useState([]);



    useEffect( () => {

        if ( data ) {

            // console.log( data.data )

            setProjects( data.data );

        }

    }, [ data ]);

    return (
        <>
            <h3> Rezultatele căutării pentru: { keyword } </h3>
            <ProjectList data={ projects } />
        </>
    );

}

export default ProjectSearch;