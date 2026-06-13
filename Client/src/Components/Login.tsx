// @ts-nocheck
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from "../Utils/axios"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { login } from '../redux/reducer/userSlice';
import {  useNavigate } from 'react-router-dom';


const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post('/login', data);
            console.log(response.data.isuser);
            localStorage.setItem('access_token_user', response.data.accessToken);
                        dispatch(login({
                            id: response.data.isuser.userId,
                            name: response.data.isuser.userName,
                            email: response.data.isuser.userEmail,
                            access_token: response.data.accessToken,

                        }));
                        navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login failure, e.g., show error message
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        try {
            const { credential } = response;
            const userData = jwtDecode(credential);

            console.log('User data:', userData);

            const data = { email: userData.email };

            try {
                const response = await axios.post('/googlelogin', data);
                console.log(response.data);
                localStorage.setItem('access_token_user', response.data.accessToken);
                dispatch(login({
                    id: response.data.isuser.userId,
                    name: response.data.isuser.userName,
                    email: response.data.isuser.userEmail,
                    access_token: response.data.accessToken,

                }));
                navigate('/');
            } catch (error) {
                console.error('Login failed:', error);
                // Handle login failure, e.g., show error message
            } 

            // Handle successful Google login
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    const handleGoogleLoginError = (error) => {
        console.error('Google login error:', error);
    };

    return (
        <GoogleOAuthProvider clientId="125895211787-eq3ivugc3jn1qetk7qp8rt0smu21p4am.apps.googleusercontent.com">
            <main className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 sm:px-4">
                <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
                    <div className="text-center">
                        {/* <img src="https://floatui.com/logo.svg" width={150} className="mx-auto" alt="Logo" /> */}
                        <div className="mt-5 space-y-2">
                            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
                            <p>Don't have an account? <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</a></p>
                        </div>
                    </div>
                    <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="font-medium">Email</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.email ? 'border-red-500' : 'focus:border-indigo-600'} shadow-sm rounded-lg`}
                                />
                                <p className="text-red-500 text-sm">{errors.email?.message}</p>
                            </div>
                            <div>
                                <label className="font-medium">Password</label>
                                <div className="relative">
                                    <input
                                        type={isPasswordVisible ? "text" : "password"}
                                        {...register('password')}
                                        className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border ${errors.password ? 'border-red-500' : 'focus:border-indigo-600'} shadow-sm rounded-lg`}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        {isPasswordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                                    </div>
                                </div>
                                <p className="text-red-500 text-sm">{errors.password?.message}</p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                        </form>
                        <div className="mt-5 w-full flex  justify-center items-center">

                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginError}
                                useOneTap
                                size="large"
                                text="continue_with"
                            // No need for className as the wrapping div handles the width
                            />

                        </div>

                    </div>
                </div>
            </main>
        </GoogleOAuthProvider>
    );
};

export default Login;
