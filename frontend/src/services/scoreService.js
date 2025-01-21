import API from './api';
import Cookies from 'universal-cookie';
const ScoreService = {
    insertScore: async (data) => {
        return await API.post('/insertScore', data, {headers: {'authorization': `Bearer ${new Cookies().get('token')}`}})
        .then((res) => {
            return res;
        })
    }
}

export default ScoreService;