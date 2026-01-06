import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useHeartbeatQuery } from '../services/authApi';

const FIVE_MINUTES = 5 * 60 * 1000;

const AuthHeartbeat = () => {
    const user = useSelector((state) => state.auth.user);

    const { data } = useHeartbeatQuery(undefined, {
        skip: !user,
        pollingInterval: FIVE_MINUTES,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    // Fallback: if backend ever stops returning an access token we don't want to leave a stale cookie lingering
    useEffect(() => {
        if (!user) {
            Cookies.remove('accessToken');
        }
    }, [user]);

    return null;
};

export default AuthHeartbeat;
