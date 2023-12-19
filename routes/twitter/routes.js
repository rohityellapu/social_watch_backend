// post api to get client token and secret
// const {client} = require('../../connect/PgAdmin');
const {Router} = require('express');

// controller
const controller = require('./controller');


const router = Router();


router.post("/", controller.postTweet);
router.post("/tweetstore", controller.postDataInMongoDb);  
router.post("/gettweet", controller.getDataFromMongoDb);

module.exports = router;
