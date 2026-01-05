import ProjectList from "../../../../Components/Project/List";
import { useEffect, useState } from "react";
import { useGetProjectsQuery } from "../../../../../services/projectApi";
import { useGetMeQuery } from "../../../../../services/userApi";
import { useLocation, useSearchParams } from "react-router-dom";

import Layout from "../../../../../layouts";
import Header from "../../../Components/Header";

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const { isLoading } = useGetMeQuery();

    const location = useLocation();
    const [searchParams] = useSearchParams();

    // ✅ status logic sirf /project par
    const isStatusPage = location.pathname === "/project";

    const uiStatus = searchParams.get("status") || "Active";
    const mongoStatus = uiStatus === "Finished" ? "finished" : "approved";

    const queryArgs = isStatusPage ? { status: mongoStatus } : {};

    const {
        data: projectsData,
        isLoading: projectsLoading,
        refetch,
    } = useGetProjectsQuery(queryArgs);

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
                        Proiecte{" "}
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
