import API from './api';
import Cookies from 'universal-cookie';
const GameService = {
    fetchCategoriesAndGames: async () => {
        return await API.get('/games', {headers: {'authorization': `Bearer ${new Cookies().get('token')}`}})
        .then((res) => {
            return res;
        })
    },
    fetchGameIdByName: async (data) =>{
        return API.get(`/game/${data}`,{headers: {'authorization': `Bearer ${new Cookies().get('token')}`}})
        .then((res) => {
            return res;
            
        })
        .catch(err =>{
            console.log("Error getting the diary", err);
            throw err;
        })
    },
    getHighestScores: async() => {
        return API.get('/highestScores', {headers: {'authorization': `Bearer ${new Cookies().get('token')}`}})
        .then((res) => {
            return res;
        })
    
    },

    getLastGames: async() => {
        return API.get('/lastGames', {headers: {'authorization': `Bearer ${new Cookies().get('token')}`}})
        .then((res) => {
            return res;
        })
    }
}

export default GameService;