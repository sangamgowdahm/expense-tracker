import React ,{useContext, useState} from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import {Link, useNavigate} from 'react-router-dom'
import Input from "../../components/inputs/Input"
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'



const login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState(null);

const {updateUser}=useContext(UserContext);

const navigate =useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  if (!validateEmail(email)) {
    setError('Please enter a valid email address');
    return;
  }
  if (!password) {
    setError('Please enter your password');
    return;
  }

  setError("");


  // login api call 

  try{
    const response= await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password
    });

    const { token ,user } = response.data;

    if(token) {
      localStorage.setItem('token', token);
      updateUser(user);
      navigate('/dashboard');
    }
  }catch(error){
    if (error.response && error.response.data) {
      setError(error.response.data.message || 'Login failed. Please try again.');
    } else {
      setError('An unexpected error occurred. Please try again later.');
    }
  }
}

  return (
    <AuthLayout>
      <div className='lg:w-[70%]h-3/4 md:h-full flex-col justify-center'>
      <h3 className='text-xl font-semibold text-block'>Welcome Back</h3>
      <p className='text-sm text-gray-500 mt-[5px] mb-6' >
        Please login to your account</p>

        <form onSubmit={handleLogin}>
          <Input
          value={email}
          onChange={({target}) => setEmail(target.value)}
          type="text"
          placeholder="sangam@gmail.com"
          label="Email Address"
          />

           <Input
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="Password"
          /> 
        
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button
        type='submit'
        className='btn-primary'>LOGIN</button>
    <p className='text-[13px] text-slate-800 mt-3' >
      Dont have account?{' '}
      <Link className='font-medium text-primary underline' to='/signUp'>
      SignUp
      </Link>
    </p>



       
        </form>
      </div>
    </AuthLayout>
  )
}

export default login
