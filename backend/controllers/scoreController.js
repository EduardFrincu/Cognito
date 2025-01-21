const Score = require('../models').Score;

const config = require('../config/app');

exports.insertScore = async(request,response) => {

    const gameId  = request.body.gameId;
    const score = request.body.score;
    const userId = request.user.id;

    try {
        const scoreRecord = await Score.create({
            userId: userId,
            gameId: gameId,
            score: score
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message
        });
    }

    return response.status(201).json({
        message: 'Score record created'
    });


};