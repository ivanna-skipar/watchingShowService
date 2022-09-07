const Router = require('express');
const router = new Router();

const strimingController = require('../controller/striming.controller');

const { check } = require('express-validator');

router.post('/addShow', [
    check('show_name', "Enter a show name.").notEmpty(),
    check('genre', "There are only 'comedy', 'horror', 'sitcom' and 'reality' genres.").notEmpty(),
    check('release_date', "Enter a release date (yyyy/mm/dd).").isDate(),
    check('streamingService_name', "Enter a Streaming Service name").notEmpty(),
], strimingController.addShow);

router.put('/watch/:show_name', strimingController.updateShow);

router.post('/subscribe/:streaming_name', [
    check('streaming_name', "Enter streaming name.").notEmpty(),
    check('user_id', "Use only numbers.").isNumeric(),
    check('user_id', "Enter user ID.").notEmpty()
], strimingController.subscribe);

router.get('/mostViewedByYear/:year', strimingController.mostViewedByYear);
router.get('/mostViewedByGenre/:genre', strimingController.mostViewedByGenre);

router.get('/recomendation', strimingController.recomendation);
router.get('/recomendation/:genre', strimingController.recomendationGenre);

router.get('/duration/:show_name', strimingController.duration);

module.exports = router;