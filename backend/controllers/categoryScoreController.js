const Score = require('../models').Score;
const Game = require('../models').Game;
const CategoryScores = require('../models').CategoryScores;
const Category = require('../models').Category;
const config = require('../config/app');
const {Op, Sequelize } = require("sequelize");

exports.insertCategoryScore = async(request,response) => {

    let recordCreated = 0;
    const userId = request.user.id;
    let categories = await Category.findAll({
        include: [
            {
                model: CategoryScores,
                where:{
                    createdAt: {
                        [Op.gte]: new Date().setUTCHours(0, 0, 0, 0),
                        [Op.lt]: new Date()
                    },
                    userId: userId
                },
                required: false,

            },
            {
                model:Game,
                required:true,
                include:[
                    {
                        model:Score,
                        required:true,
                        where:{
                            userId: userId
                        }
                    },
                ]
            },
            
        ],
    })
    // return response.send(categories);
    for(const category of categories){


        if(category.CategoryScores.length == 0){
            recordCreated = 1;
            let categoryScore = 0;
            let sum = 0;
            let maximumScoresInCategory = await Score.findAll({
                attributes: [
                  [Sequelize.fn('MAX', Sequelize.col('score')), 'maxScore'],
                  'gameId',
                  'userId'
                ],
                include: [
                  {
                    model: Game,
                    attributes: ['name'],
                    required:true,
                    include: [
                      {
                        model: Category,
                        attributes: ['name', 'id'],
                        where: { id: category.id }
                      }
                    ]
                  }
                ],
                where: {
                  userId: userId
                },
                group: ['gameId', 'userId', 'Game.id', 'Game->Category.id']
              });

              for(const score of maximumScoresInCategory){
                sum = parseInt(sum + score.dataValues.maxScore);

              }

              let createdCategoryScore = await CategoryScores.create({
                userId: userId,
                score: sum/maximumScoresInCategory.length,
                categoryId: category.id                
            })  
            
        }
    }


    if(recordCreated){
        return response.status(201).json({message: `Records created for today, ${new Date()}`});
    }

    return response.status(200).json({message: "Records for today already existing"});

};

exports.getCategoriesEvolutions = async(request,response) => {

    const userId = request.user.id;

    let categoryScores = await CategoryScores.findAll({
        where:{
            userId:userId
        },
        include: [
            {
                model: Category,
                required: true,
            },  
        ],
        order:[["createdAt", "ASC"]]
    });

    const groupedByCategoryId = Object.values(categoryScores.reduce((acc, obj) => {

        if (!acc[obj.categoryId]) {
            acc[obj.categoryId] = [];
        }

        acc[obj.categoryId].push(obj);
        
        return acc;
    }, {}));
      
    // return response.send(groupedByCategoryId);

    let carouselContent = [];
    for(categoryScores of groupedByCategoryId){ 
        let labels = categoryScores.map(obj =>{
            let newDate = new Date(obj.createdAt);
            return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
              
        });
        let data = categoryScores.map(obj=>obj.score);

        let chartData = {
            labels: labels,
            datasets:[
                {
                    label: `${categoryScores[0].Category.name} evolution`,
                    data: data,
                    fill:false,
                    borderColor:'blue',
                    tension:0.4
                }
            ]
        }
        carouselContent.push(chartData);
    }

    return response.send(carouselContent);




}