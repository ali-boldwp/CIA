import Layout from "../../../../layouts"
import Header from "../../Components/Header"
import ProfileContent from "../../../Profile"
import {useGetMeQuery} from "../../../../services/userApi";

const Profile = () => {

    const { data, isLoading: isFetching } = useGetMeQuery();

    return (
        <Layout
            loading={ isFetching }
            header={{
                search: false,
                back: true,
                content: <Header />
            }}
            content={
                <ProfileContent data={data}/>
            }
        />
    );

}

export default Profile;