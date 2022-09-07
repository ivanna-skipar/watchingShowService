const db = require('../db');
const { validationResult } = require('express-validator');


class StrimingController {
    async addShow(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Add show error", errors });
        }
        const { show_name, genre, release_date, streamingService_name } = req.body;
        const showByName = await db.query('SELECT * FROM SHOWS WHERE show_name=$1', [show_name]);
        if (showByName.rows[0]) {
            return res.status(400).json({message: `Show with name ${show_name} already exist`})
        }
        const streamingByName = await db.query('SELECT streamingService_id FROM STREAMING_SERVICE WHERE streaming_name=$1', [streamingService_name]);
        let streamingService_id;
        if (!streamingByName.rows[0]) {
            return res.status(400).json({ message: `STREAMING SERVICE with name ${streamingService_name} does not exist` })
        } else {
            streamingService_id = Object.values(streamingByName.rows[0])[0];
        }
        const newShow = await db.query('INSERT INTO SHOWS (show_name, genre, release_date, streamingService_id) values ($1, $2, $3, $4) RETURNING *', [show_name, genre, release_date, streamingService_id]);
        res.json(newShow.rows[0]);
    }

    async updateShow(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Update show error", errors });
        }
        const show_name = req.params.show_name;
        const showByName = await db.query('SELECT viewsByShowName FROM SHOWS WHERE show_name=$1', [show_name]);
        let views;
        if (!showByName.rows[0]) {
            return res.status(400).json({ message: `There is no show with name ${show_name}` })
        } else {
            views = Object.values(showByName.rows[0])[0];
        }
        const updateShow = await db.query('UPDATE SHOWS SET viewsByShowName=$1 WHERE show_name=$2 RETURNING *', [ views+1, show_name]);
        res.json(updateShow.rows[0])
    }

    async subscribe(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Subscribing error", errors });
        }
        const { user_id } = req.body;
        const streaming_name = req.params.streaming_name;

        const streamingByName = await db.query('SELECT streamingService_id FROM STREAMING_SERVICE WHERE streaming_name=$1', [streaming_name]);
        let streamingService_id;
        if (!streamingByName.rows[0]) {
            return res.status(400).json({ message: `STREAMING SERVICE with name ${streaming_name} does not exist and you can not subscribe` })
            } else {
            streamingService_id = Object.values(streamingByName.rows[0])[0];
            const subscribe = await db.query('SELECT * FROM SUBSCRIPTION WHERE user_id=$1 AND streamingService_id=$2', [user_id, streamingService_id]);
            if (subscribe.rows[0]) {
                return res.status(400).json({message: `You are already subscribed to the ${streaming_name} channel`})
            } 
        }
        const newSubscribtion = await db.query('INSERT INTO SUBSCRIPTION (user_id, streamingService_id) values ($1, $2) RETURNING *', [user_id, streamingService_id]);
        res.json(newSubscribtion.rows[0]);
    }

    async mostViewedByYear(req, res) {
        const year = req.params.year;
        const mostViewedByYear = await db.query(`SELECT * from shows WHERE date_part('year', release_date)=$1 order by viewsByShowName DESC LIMIT 10;`, [year]);
        if (!mostViewedByYear.rows[0]) {
            return res.status(400).json({ message: `There are no show released in ${year} year` })
        }
        res.json(mostViewedByYear.rows)        
    }

    async mostViewedByGenre(req, res) {
        const genre = req.params.genre;
        const mostViewedByGenre = await db.query('SELECT * from shows WHERE genre=$1 ORDER BY viewsByShowName DESC LIMIT 10;', [genre]);
        if (!mostViewedByGenre.rows[0]) {
            return res.status(400).json({ message: `There are no show in ${genre} genre` })
        }
        res.json(mostViewedByGenre.rows)        
    }

    async recomendation(req, res) {
        const year = new Date().getFullYear();
        const recomendationByYear = await db.query(`SELECT * from shows WHERE date_part('year', release_date)=$1 ORDER BY viewsByShowName DESC LIMIT 10;`, [year]);
        if (!recomendationByYear.rows[0]) {
            return res.status(400).json({ message: `There are no show released in ${year} year` })
        }
        let rand = Math.floor(Math.random() * 10);
        res.json(recomendationByYear.rows[rand])        
    }

    async recomendationGenre(req, res) {
        const genre = req.params.genre;
        const recomendationByGenre = await db.query(`SELECT * from shows WHERE genre=$1 ORDER BY viewsByShowName DESC LIMIT 10;`, [genre]);
        if (!recomendationByGenre.rows[0]) {
            return res.status(400).json({ message: `There are no show in ${genre} genre` })
        }
        let rand = Math.floor(Math.random() * 10);
        res.json(recomendationByGenre.rows[rand])        
    }

    async duration(req, res) {
        const show_name = req.params.show_name;
        const showByName = await db.query('SELECT show_id FROM SHOWS WHERE show_name=$1', [show_name]);
        let show;
        if (!showByName.rows[0]) {
            return res.status(400).json({ message: `There is no show with name ${show_name}` })
        } else {
            show = Object.values(showByName.rows[0])[0];
        }
        const countDuration = await db.query(`SELECT sum(episode_duration) FROM episode WHERE show_id = $1;`, [ show]);
        
        res.json(countDuration.rows[0])        
    }    
}

module.exports = new StrimingController();