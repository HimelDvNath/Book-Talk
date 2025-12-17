import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";
import { updateProfile } from "firebase/auth";
const SignUp = () => {
    const [seePassword, setSeePassword] = useState(false);
    const navigate = useNavigate();
    const {createUser} = useContext(AuthContext);
    const handleFrom = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const formData = Object.fromEntries(form);

        // data send to the server
        try {
            const userCredential = await createUser(formData.email, formData.password);
            const user = userCredential.user;
            const name = formData.firstName + " " + formData.lastName;
            // update profile
            await updateProfile(user, {
                displayName: name || "",
            });

            await fetch("http://localhost:5000/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }).then(res=>res.json()).then(data=>{
                if(data.success){
                    alert('Registration Successfully')
                    e.reset;
                    navigate('/');
                }else{
                    alert('Something went wrong!! Try again')
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <div className='hero bg-base-200 min-h-screen'>
            <div className='hero-content flex-col'>
                <div className='text-center lg:text-left'>
                    <h1 className='text-4xl font-bold'>Registration now!</h1>
                </div>
                <div className='card bg-base-100 min-w-sm shrink-0 shadow-2xl'>
                    <div className='card-body '>
                        <form onSubmit={handleFrom} className='fieldset'>
                            <label className='label'>First Name</label>
                            <input
                                type='text'
                                name='firstName'
                                className='input min-w-full outline-none'
                                placeholder='First Name'
                                required
                            />
                            <label className='label'>Last Name</label>
                            <input
                                type='text'
                                name='lastName'
                                className='input min-w-full outline-none'
                                placeholder='Last Name'
                                required
                            />
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
                                className='absolute top-68 right-10 cursor-pointer'>
                                {seePassword ? (
                                    <FaEyeSlash size={20} />
                                ) : (
                                    <FaRegEye color='' size={20} />
                                )}
                            </div>
                            <div>
                                <Link to='/signin' className='link link-hover'>
                                    Already have an account?
                                </Link>
                            </div>
                            <button className='btn btn-neutral mt-4'>
                                SignUp
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
