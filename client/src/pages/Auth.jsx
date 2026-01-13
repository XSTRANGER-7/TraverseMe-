
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'; // Correct import syntax
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

function Auth() {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? '/login' : '/register';

        try {
            const response = await axios.post("http://localhost:7000" + url, formData);

            if (isLogin) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/');
            } else {
                setFormData({ name: '', email: '', password: '' });
                setIsLogin(true);
                navigate('/auth');
            }
        } catch (error) {
            console.error('Error during email login/register:', error.response?.data || error.message);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const decodedUser = jwtDecode(credentialResponse.credential);
            const response = await axios.post('http://localhost:7000/auth/google', {
                name: decodedUser.name,
                email: decodedUser.email,
                photo: decodedUser.picture,
            });

            const { token, user } = response.data;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/');
            }
        } catch (error) {
            console.error('Error during Google login:', error.response?.data || error.message);
        }
    };

    const toggleLoginPage = () => {
        setIsLogin((prevIsLogin) => !prevIsLogin);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 m-6 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                <h1 className="text-2xl font-semibold text-center mb-4">
                    {isLogin ? 'Login' : 'Register'}
                </h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            onChange={handleChange}
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button
                    type="button"
                    onClick={toggleLoginPage}
                    className="text-sm text-blue-500 mt-4 hover:underline block text-center"
                >
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>
                <div className="mt-4">
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => console.error('Google login failed')}
                    />
                </div>
            </div>
        </div>
    );
}

export default Auth;
