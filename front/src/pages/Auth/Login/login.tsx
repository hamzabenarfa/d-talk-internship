import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux/actions/authActions';
import Header from '../../Home/Components/header';
import * as yup from 'yup';
import Toast     from 'react-hot-toast';
import { NavBar } from '@/pages/Home/Components/nav-bar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const schema = yup.object().shape({
        email: yup.string().email('Email n\'est pas valide').required('Email est requis'),
        password: yup.string().required('Mot de passe est requis')
    });

    const validateForm = async () => {
        try {
            await schema.validate({ email, password }, { abortEarly: false });
            setErrors('');
            return true;
        } catch (err) {
            const validationErrors = {};
            err.inner.forEach(error => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
            return false;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const isValid = await validateForm();
        if (!isValid) return;

        try {
            const response = await axios.post(
                'http://localhost:4000/auth/login',
                {
                    email,
                    password
                }
            );
            Toast.success('Connexion réussie');
            if (response.data) {
                dispatch(loginSuccess(response.data));
                switch (response.data.user.role) {
                    case 'ADMIN':
                        navigate('/admin/dashboard');
                        break;
                    case 'CANDIDAT':
                    case 'INTERN':
                        navigate('/etudiant');
                        break;
                    case 'PROF_SUPERVISOR':
                        navigate('/encadrant');
                        break;
                    default:
                        navigate('/');
                        break;
                }
            }
        } catch (error) {
            console.log("🚀 ~ handleLogin ~ error:", error)
            Toast.error(error.response?.data.error)
        }
    };

    return (
        <div className='flex flex-col '>
           <NavBar />
            <div className="bg-gray-100 min-h-screen flex items-center justify-between md:px-28">
                <img src="login-img.png" alt="" className="hidden md:block w-1/3" />
                <div className="m-2 max-w-md w-full space-y-8 p-8 shadow-md rounded-2xl bg-white">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Se connecter
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email</label>
                                <input 
                                    id="email-address"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    required
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Mot de passe</label>
                                <input 
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                            </div>
                        </div>
                        <div>
                            <button 
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Se connecter
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Vous n'avez pas de compte ? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Inscrivez-vous</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
