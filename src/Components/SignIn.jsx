import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";

const SignIn = () => {
    const [seePassword, setSeePassword] = useState(false);
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFrom = async(e) =>{
        e.preventDefault();
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form);
        try {
            await login(formData.email, formData.password).then(user=>
                navigate('/')
            );
        } catch (error) {
            alert(error.message);
        }
    }
    return (
        <div className='hero bg-base-200 min-h-screen'>
            <div className='hero-content flex-col'>
                <div className='text-center lg:text-left'>
                    <h1 className='text-4xl font-bold'>Login now!</h1>
                </div>
                <div className='card bg-base-100 min-w-sm shrink-0 shadow-2xl'>
                    <div className='card-body '>
                        <form onSubmit={handleFrom} className='fieldset'>
                            <label className='label'>Email</label>
                            <input
                                type='email'
                                name='email'
                                className='input min-w-full outline-none'
                                placeholder='Email'
                                required
                            />
                            <label className='label'>Password</label>
                            <input
                                type={seePassword ? "text" : "password"}
                                name='password'
                                className='input w-full outline-none'
                                placeholder='Password'
                                required
                            />
                            <div
                                onClick={() => setSeePassword(!seePassword)}
                                className='absolute top-33 right-10 cursor-pointer'>
                                {seePassword ? (
                                    <FaEyeSlash size={20} />
                                ) : (
                                    <FaRegEye color='' size={20} />
                                )}
                            </div>
                            <div>
                                <Link to='/signup' className='link link-hover'>
                                    Create an account?
                                </Link>
                            </div>
                            <button className='btn btn-neutral mt-4'>
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
