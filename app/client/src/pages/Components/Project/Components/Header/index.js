import styles from "./style.module.css";

import moment from 'moment';

const Header = ({ data }) => {

    let status = data.status;

    /*if ( status == 'approved' ) {

        status = "În lucru";

    }*/

    return (
        <div className={ styles.wraper }>
            <h3> Proiect: <span>{ data?.projectName }</span> </h3>
            <div>
                <ul>
                    <li> Creat la: { moment( data.createdAt ).format('YYYY-MM-DD HH:mm') } </li>
                    <li> Start proiect: { moment( data.createdAt ).format('YYYY-MM-DD HH:mm') } </li>
                    <li class={ data.status }>
                        Status:
                        { status == 'approved' && "În lucru" }
                    </li>
                </ul>
            </div>
        </div>
    )

}

export default Header;