import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLayoutByRole } from "./roleLayouts";

const RoleBasedRoot = () => {
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.auth); // assume you have loading flag

    useEffect(() => {
        // Still fetching user → show nothing or spinner
        if (loading) return;

        // Not logged in → go login
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, loading, navigate]);

    // Show nothing while deciding
    if (loading || !user) { console.log( "No nm user", user ); return null;}

    // This is the magic line
    return getLayoutByRole(user.role);
};

export default RoleBasedRoot;