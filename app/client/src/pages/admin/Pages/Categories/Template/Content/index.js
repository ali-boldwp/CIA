import Title from "./Title"
import Chapter from "./Chapter"

import styles from "./style.module.css"

const Content = ({ data }) => {

    return (
        <div className={ styles.container }>
            <Title
                title={ data.title }
            />
            {
                data.chapters.map((chapter, ci) => {
                    return (
                        <Chapter
                            data={ chapter }
                        />
                    )
                })
            }
        </div>
    );

}

export default Content;