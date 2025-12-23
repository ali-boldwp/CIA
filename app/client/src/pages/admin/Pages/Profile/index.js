import Layout from "../../../../layouts"
import Header from "../../Components/Header"
import ProfileContent from "../../../Profile"

const Profile = () => {



    return (
        <Layout
            loading={ false }
            header={{
                search: false,
                back: true,
                content: <Header />
            }}
            content={
                <ProfileContent />
            }
        />
    );

}

export default Profile;