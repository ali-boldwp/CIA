import ProjectList from "../../../../Components/Project/List";
import { useEffect, useState } from "react";
import { useGetProjectsQuery } from "../../../../../services/projectApi";
import { useGetMeQuery } from "../../../../../services/userApi";
import { useSearchParams } from "react-router-dom";

import Layout from "../../../../../layouts";
import Header from "../../../Components/Header";

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const { isLoading } = useGetMeQuery();
    const [searchParams] = useSearchParams();

    // UI → Mongo mapping
    const uiStatus = searchParams.get("status") || "Active";
    const mongoStatus = uiStatus === "Finished" ? "finished" : "approved";

    const {
        data: projectsData,
        isLoading: projectsLoading,
        refetch,
    } = useGetProjectsQuery({ status: mongoStatus });

    useEffect(() => {
        if (projectsData) {
            setProjects(projectsData.data);
        }
    }, [projectsData]);

    return (
        <Layout
            header={{
                createProject: false,
                search: false,
                back: true,
                title: (
                    <>
                        {uiStatus === "Finished"
                            ? "Proiecte finalizate"
                            : "Proiecte active în derulare"}{" "}
                        <span className="count" style={{ fontSize: "12px" }}>
              {projects.length} proiecte
            </span>
                    </>
                ),
                content: <Header createProject={true} />,
            }}
            loading={isLoading || projectsLoading}
            content={
                <ProjectList
                    data={projects}
                    refetchProjects={refetch}
                />
            }
        />
    );
};

export default ProjectsList;
