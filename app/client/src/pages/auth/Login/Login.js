import * as React from 'react';
import Box from '@mui/material/Box';
import useStyles from "./Styles";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from "react";

import { useForm } from "react-hook-form";

import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';

const Login = () => {

    const classes = useStyles();
    const [loading, setLoading] = useState(false);

    // -------------------------
    //   react-hook-form setup
    // -------------------------
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {

        console.log("FORM SUBMIT:", data);
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            alert("Login Success!");
        }, 1500);

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
                        disabled={loading}
                        sx={{ marginTop: "40px" }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Login"}
                    </Button>

                    {/* Social buttons */}
                    <div className="social">
                        <div className="go"><i className="fab fa-google"></i> Google</div>
                        <div className="fb"><i className="fab fa-facebook"></i> Facebook</div>
                    </div>

                </form>
            </div>
        </Box>
    )
}

export default Login;
