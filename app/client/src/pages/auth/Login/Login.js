import * as React from 'react';
import Box from '@mui/material/Box';
import useStyles from "./Styles";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { setUser } from '../../../features/auth/authSlice';
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";


import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import { useLoginMutation } from '../../../services/authApi';
import {toast} from "react-toastify";

const Login = () => {

    const classes = useStyles();
    const navigate = useNavigate();

    // 🔥 RTK Query hook
    const [login, { data, error, isLoading, isSuccess }] = useLoginMutation();
    const dispatch=useDispatch();
    // -------------------------
    //   react-hook-form setup
    // -------------------------
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (formData) => {
        try {
            const response = await login({
                email: formData.email,
                password: formData.password
            }).unwrap();

            const loggedUser = response.data.user;
            const token = response.data.accessToken;

            // Save user to Redux + localStorage
            dispatch(setUser(loggedUser));
            localStorage.setItem("user", JSON.stringify(loggedUser));
            localStorage.setItem("token", token);

            // 🔥🔥 SESSION CHECK — Console me print hoga
            console.log("SESSION - User:", loggedUser);
            console.log("SESSION - Token:", token);

            // 🔥 LocalStorage check
            console.log("LOCALSTORAGE USER:", JSON.parse(localStorage.getItem("user")));
            console.log("LOCALSTORAGE TOKEN:", localStorage.getItem("token"));

            toast.success("Autentificare reușită")

            navigate("/manager/dashboard");

        } catch (err) {
            console.error("LOGIN ERROR:", err);
        }
    };



    return (
        <Box
            component="span"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
            }}
        >
            <div className={classes.loginWrap}>

                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <h3>Login</h3>
                        <p> Don't have account? <a href={'#'}> Register Now</a> </p>
                    </div>

                    {/* Username / Email */}
                    <FormControl sx={{ width: '100%', marginTop: '30px' }}>
                        <OutlinedInput
                            placeholder="Username or Email"
                            className={classes.input}
                            {...register("email", {
                                required: "Email is required",
                                minLength: { value: 3, message: "Too short" }
                            })}
                        />
                        <FormHelperText sx={{ color: "red" }}>
                            {errors.email?.message}
                        </FormHelperText>
                    </FormControl>

                    {/* Password */}
                    <FormControl sx={{ width: '100%', marginTop: '30px' }}>
                        <OutlinedInput
                            type="password"
                            placeholder="Password"
                            className={classes.input}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Min 6 characters" }
                            })}
                        />
                        <FormHelperText sx={{ color: "red" }}>
                            {errors.password?.message}
                        </FormHelperText>
                    </FormControl>

                    {/* Submit button */}
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{ marginTop: "40px" }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Login"}
                    </Button>

                    {/* Show API error */}
                    {error && (
                        <p style={{ color: "red", marginTop: "10px" }}>
                            {error?.data?.message || "Login failed"}
                        </p>
                    )}

                </form>
            </div>
        </Box>
    )
}

export default Login;
