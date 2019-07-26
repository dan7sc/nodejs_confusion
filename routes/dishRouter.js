const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the dishes to you!' + '\n');
})
.post((req, res, next) => {
    res.end('Will add the dish ' + req.body.name + ' with details: ' + req.body.description + '\n');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes' + '\n');
})
.delete((req, res, next) => {
    res.end('Deleting all the dishes!' + '\n');
});

dishRouter.route('/:dishId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send details of the dish: ' + req.params.dishId + ' to you!' + '\n');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId + '\n');
})
.put((req, res, next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description + '\n');
})
.delete((req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId + '\n');
});

module.exports = dishRouter;
