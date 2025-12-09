// This is the ONLY place you ever add a new role in the future
import AdminLayout from "../pages/admin/Admin";
import AnalystLayout from "../pages/Analyst/AnalystLayout";
import SalesLayout from "../pages/Sales/SalesLayout";

export const roleLayoutMap = {
    admin:   <AdminLayout />,
    manager: <AdminLayout />,
    analyst: <AnalystLayout />,
    sales:   <SalesLayout />,
    // Add new role in future → just one line here
    // superadmin: <SuperAdminLayout />,
    // guest:      <GuestLayout />,
};

// Optional: fallback if role is unknown or missing
export const getLayoutByRole = (role) => {

    console.log( "User role:", role )

    return roleLayoutMap[role] || <> You are not supposed to login! </>;
};