const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({'user': req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({'user': req.user._id})
    .then((favorite) => {
        if (favorite[0] === undefined) {
            Favorites.create({})
            .then((favorite) => {
                favorite.user = req.user._id;
                req.body.forEach((element) => {
                    favorite.dishes.push(element);
                });
                favorite.save();
                console.log('Created: ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            });
        }
        else {
            let hasDish = false;
            req.body.forEach((element) => {
                favorite[0].dishes.forEach((dish) => {
                    if (dish == element._id) {
                        hasDish = true;
                    }
                });
                if (!hasDish) {
                    favorite[0].dishes.push(element);
                }
            });
            favorite[0].save();
            console.log('Updated: ', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites' + '\n');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({'user': req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let hasDish = false;
    Favorites.find({'user': req.user._id})
    .then((favorite) => {
        if (favorite[0] === undefined) {
            Favorites.create({})
            .then((favorite) => {
                favorite.user = req.user._id;
                favorite.dishes.push(req.params.dishId);
                favorite.save();
                console.log('Created: ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            });
        }
        else {
            favorite[0].dishes.forEach((dish) => {
                if (dish == req.params.dishId) {
                    hasDish = true;
                }
            });
            if (hasDish) {
                err = new Error('Favorite dish ' + req.params.dishId + ' already exist.');
                err.status = 404;
                return next(err);
            }
            else {
                favorite[0].user = req.user._id;
                favorite[0].dishes.push(req.params.dishId);
                favorite[0].save();
                console.log('Updated: ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/' + req.params.dishId + '\n');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({'user': req.user._id})
    .then((favorite) => {
        console.log(favorite);
        let index = favorite[0].dishes.indexOf(req.params.dishId);
        if (index > -1) {
            favorite[0].dishes.splice(index, 1);
            favorite[0].save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }
        else {
            err = new Error('Favorite dish ' + req.params.dishId + ' does not exist.');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;
