import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate} from 'react-router-dom';
import loginImage from '../../assets/images/loginImage.svg';
import AuthService from '../../services/authService';

import './Auth.scss';

const Register = ({history}) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  let navigate = useNavigate();

  const  submitForm = e =>{
        e.preventDefault();
        AuthService.register({firstName,lastName, email, gender, password, age, phoneNumber}, history)
        .then(res => {
            if(res.status == 200){
                navigate('/');
            }
        });
    }


  return (
    <div className="container align-self-center pt-5 pb-5 h-100">
        <div className="col-sm-12 pt-4 p-5 login-form-center-margin">
            <h1 className="mt-4 mb-5 login-title">Register</h1>
        </div>
        <form className="login-form-style p-5" onSubmit={submitForm}>
            <div className="row register-form-container">
                <div className="col-md-3">
                    <div className="mb-3 mt-3">
                        <label className="label">Firstname</label>
                        <input className="form-control" aria-label="Firstname" aria-describedby="basic-addon1" value={firstName} onChange={event => setFirstName(event.target.value)}/>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="label ">Email</label>
                        <input className="form-control" aria-label="Email" aria-describedby="basic-addon1" value = {email} onChange={event => setEmail(event.target.value)}/>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="label ">Phone number</label>
                        <input className="form-control" aria-label="Phone" aria-describedby="basic-addon1" value = {phoneNumber} onChange={event => setPhoneNumber(event.target.value)}/>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="label">Password</label>
                        <input type='password' className="form-control" aria-label="Password" aria-describedby="basic-addon1" value = {password} onChange={event => setPassword(event.target.value)}/>
                    </div>
                
                </div>
                <div className="col-md-3">
                    <div className="mb-3 mt-3">
                        <label className="label">Lastname</label>
                        <input className="form-control" aria-label="Lastname" aria-describedby="basic-addon1" value={lastName} onChange={event => setLastName(event.target.value)}/>
                    </div>
                    <div className="mb-3 mt-3">
                        <label className="label ">Age</label>
                        <input className="form-control" aria-label="Age" aria-describedby="basic-addon1" value={age} onChange={event => setAge(event.target.value)}/>
                    </div>
                    <div className="mb-3 mt-5">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="male" onChange={event => setGender(event.target.value)}/>
                            <label className="form-check-label" htmlFor="inlineRadio1">M</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="female" onChange={event => setGender(event.target.value)}/>
                            <label className="form-check-label" htmlFor="inlineRadio2">F</label>
                        </div>
                    </div>
                    <div className="mb-3" style={{marginTop:'20px'}}>
                        <label className="label">Confirm password</label>
                        <input type='password' className="form-control" aria-label="Password" aria-describedby="basic-addon1"/>
                    </div>
               
                </div>
                <div className="col-md-5 p-0">
                    <img className='login-image' src = {loginImage} alt = 'Login'/>
                    
                </div>

            </div>

                <div className="register-link">
                    <button type="submit" className=" button btn btn-color p-2 mb-3">
                        Sign up
                    </button>
                    <div className='to-login'>
                        Already have an account? <Link to="/login">Login</Link>
                    </div>

                </div>

          </form>
    </div>
  )
}

export default Register
