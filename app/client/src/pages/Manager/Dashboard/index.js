import Header from "../../../layouts/Component/Header"
import CalendarList from "../Components/CalenderList"
import Projects from "../Components/Project"
import StatusSection from "../Components/StatusSection"
import Team from "../Components/Team/Team"
import '../style.css'

const ManagerDashboard = () => {
    return (
        <div className="container">
            <Header/>
            <StatusSection/>
            <Projects/>
            <Team/>
            <div className="CalenderMain">
                <div className="Calender">
                    <CalendarList/>
                </div>
            </div>
        </div>
    )
}
export default ManagerDashboard