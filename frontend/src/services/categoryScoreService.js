import API from './api';
import Cookies from 'universal-cookie';
const CategoryScoreService = {
    insertCategoryScore: async (data) => {
        return await API.post('/insertDailyCategoryScore', data, {headers: {'authorization': `Bearer ${new Cookies().get('token')}`}})
        .then((res) => {
            return res;
        })
    },
    getCategoriesEvolutions: async() => {
        return API.get('/categoriesEvolutions',{headers: {'authorization': `Bearer ${new Cookies().get('token')}`}})
        .then((res) => {
            return res;
            
        })
        .catch(err =>{
            console.log("Error getting the evolution", err);
            throw err;
        })
    }
}

export default CategoryScoreService;