const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the promotions to you!' + '\n');
})
.post((req, res, next) => {
    res.end('Will add the promotion ' + req.body.name + ' with details: ' + req.body.description + '\n');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions' + '\n');
})
.delete((req, res, next) => {
    res.end('Deleting all the promotions!' + '\n');
});

promotionRouter.route('/:promotionId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send details of the promotion: ' + req.params.promotionId + ' to you!' + '\n');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promotionId + '\n');
})
.put((req, res, next) => {
    res.write('Updating the promotion: ' + req.params.promotionId + '\n');
    res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description + '\n');
})
.delete((req, res, next) => {
    res.end('Deleting promotion: ' + req.params.promotionId + '\n');
});

module.exports = promotionRouter;