import API from './api';
import Cookies from 'universal-cookie';
import {jwtDecode} from 'jwt-decode';
import {useNavigate} from 'react-router-dom';


const cookies = new Cookies();

const AuthService = {
    
    login: (data) => {
        return API.post('/login', data)
        .then((response) => {
            cookies.set('token', response.data.token, {path: '/', expires: new Date(jwtDecode(response.data.token).exp*1000)});
            return response;

        })
        .catch(err => {
            console.log('Auth service err', err);
           
        })
        
    },
    register : (data) => {
        return API.post('/register', data)
        .then((response) => {
            cookies.set('token', response.data.token, {path: '/', expires: new Date(jwtDecode(response.data.token).exp*1000)});
            return response;
        })
        .catch(err => {
            console.log('Auth service err', err);
 
        })
    },
    logout: () => {
        cookies.remove('token');
    }
}

export default AuthService;