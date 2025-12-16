import {Link} from "react-router-dom";

const Item = ({
    icon,
    title,
    value,
    link,
    linkTitle
              }) =>{

    return (
        <div className={ "stats-block" } >

            <div className={ "stats-block-head" }>

                { icon }

                <span className={ "stats-block-content-title" }> { title } </span>

            </div>

            <div className={ "stats-block-content" }>
                <div>

                    <span className={"stats-block-content-value"}> { value } </span>
                </div>
                { link && <Link to={ link }> { linkTitle } <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12H20M20 12L16 8M20 12L16 16" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg></Link> }
            </div>
        </div>
    )

}

export default Item;