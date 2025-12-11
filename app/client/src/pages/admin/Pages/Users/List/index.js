import Layout from "../../../../../layouts";
import List from "./List"

import { useGetAllUsersQuery ,useDeleteUserMutation } from "../../../../../services/userApi";

const UsersList = () => {

    // Fetch all users
    const { data: usersData, isLoading } = useGetAllUsersQuery();
    const [deleteUser] = useDeleteUserMutation();

    return (
        <Layout
            loading={ isLoading }
            header={{
                title: "Lista angajaților",
                search: false,
                back: true
            }}
            content={
                <List
                    deleteUser={deleteUser}
                    usersData={usersData}
                    isLoading={isLoading}
                />
            }
        />
    );

}

export default UsersList;