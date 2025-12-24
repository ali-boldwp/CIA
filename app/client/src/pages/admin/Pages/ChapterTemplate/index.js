import Layout from "../../../../layouts"
import ChapterContent from "../../../ChapterTemplate"

const ChapterTemplate = () => {
    return(
    <Layout
        loading={false}
        content={<ChapterContent/>}
    />
    );
}

export default ChapterTemplate;