import Layout from "../../../../../layouts/Template";
import View from "./View";
import { useParams } from "react-router-dom";
import {
    useGetCategoryByIdQuery,
    useGetChapterTemplatesByCategoryQuery
} from "../../../../../services/categoryApi";
import { useEffect, useState } from "react";
import BlockEditor from "./BlockEditor";

const Template = () => {
    const { id: categoryId } = useParams();

    const { data, isLoading, refetch } = useGetCategoryByIdQuery(categoryId, {
        skip: !categoryId
    });

    const { data: chapterData } = useGetChapterTemplatesByCategoryQuery(categoryId, {
        skip: !categoryId
    });

    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        if (chapterData?.data) {
            setChapters(
                chapterData.data.map((chapter) => ({
                    uid: chapter._id,
                    name: chapter.name,
                    content: chapter.content || "",
                    isCreated: true
                }))
            );
        }
    }, [chapterData]);

    return (
        <Layout
            loading={isLoading}
            content={
                <>
                    <View
                        data={data?.data}
                        categoryId={categoryId}
                        onChapterCreated={refetch}
                    />
                    <BlockEditor chapters={chapters} categoryId={categoryId} />
                </>
            }
        />
    );
};

export default Template;
