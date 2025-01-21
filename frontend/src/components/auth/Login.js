import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import loginImage from '../../assets/images/loginImage.svg';
import AuthService from '../../services/authService';
import './Auth.scss';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let navigate = useNavigate();

    const submitForm = e => {
        e.preventDefault();
        AuthService.login({email,password})
        .then(res => {
            if(res.status == 200){
                navigate('/');
            }
        })
        .catch((err) => console.log(err));
    }

    return (
        <div className="container align-self-center pt-5 pb-5 h-100">
            <div className="col-sm-12 pt-4 p-5 login-form-center-margin">
                <h1 className="mt-4 mb-5 login-title">Login</h1>
            </div>
            <form className="login-form-style p-5" onSubmit={submitForm}>
                <div className="row login-form-container">
                    <div className="login-fields col-md-3">
                        <div className="mb-3 mt-3">
                            <label className="label ">Email</label>
                            <input className="form-control" aria-label="Email" aria-describedby="basic-addon1" value={email} onChange={e => setEmail(e.target.value)}/>
                        </div>
                        <div className="mb-3 mt-3">
                            <label class="label">Password</label>
                            <input type='password' className="form-control" aria-label="Password" aria-describedby="basic-addon1" value={password} onChange={e => setPassword(e.target.value)}/>
                        </div>

                        <div className="login-link">
                            <button type="submit" className=" button btn btn-color p-2 mb-3">
                                Login
                            </button>
                            <div className='to-register'>
                                Don't you have an account? <Link to="/register">Register</Link>
                            </div>
                        </div>
                    
                    </div>
                    
   
                    <div className="col-md-5 p-0">
                        <img className='login-image' src = {loginImage} alt = 'Login'/>    
                    </div>
    
                </div>
    

    
              </form>
        </div>
      )
}

export default Login
