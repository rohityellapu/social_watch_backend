
// post api to get client token and secret
// const {client} = require('../../connect/PgAdmin');
const {Router} = require('express');

// controller
const controller = require('./controller');


const router = Router();

router.get('/', controller.getLogin);

router.post('/', controller.postLogin);

module.exports = router;





