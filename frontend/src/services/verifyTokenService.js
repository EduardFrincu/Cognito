import API from './api'
import Cookies from 'universal-cookie';
import { redirect } from 'react-router-dom';
const VerifyTokenService =  {
    verify: async (navigate) => {
        return await API.get('/',{headers: {'authorization': `Bearer ${new Cookies().get('token')}`}})
            .then((res) => {
                return res.data

            })
            .catch(err => {
                // console.log('ERR' , err);
                navigate('/login')
                // throw err;
            })
            
    }
}
export default VerifyTokenService