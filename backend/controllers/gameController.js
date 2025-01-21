const Game = require('../models').Game;
const Category = require('../models').Category;
const Score = require('../models').Score;

exports.fetchCategoriesAndGames = async(request,response) => {

    let games = await Category.findAll({
        include: [
            {
                model: Game,
                required: true,
            },
        ],
    });

    return response.send(games);

};

exports.getGameIdByName = async(request,response) => {
    let {name} = request.params;

    let gameID = await Game.findOne({
        where:{
            name:name
        },
        attributes:['id'],
    })
    return response.send(gameID);
};

exports.get5LastGames = async(request,response) => {
    const userId = request.user.id;

    let last5games = await Score.findAll({
        where:{
            userId:userId
        },
        include: [
            {
                model: Game,
                required: true,
            },
        ],
        limit:5,
        order:[["createdAt", "DESC"]]
    })

    return response.send(last5games);

};
 
exports.get5HighestScores = async(request,response) => {
    const userId = request.user.id;

    let highest5Scores = await Score.findAll({
        where:{
            userId:userId
        },
        include: [
            {
                model: Game,
                required: true,
            },
        ],
        limit:5,
        order:[["score", "DESC"]]
    })
return response.send(highest5Scores);


}