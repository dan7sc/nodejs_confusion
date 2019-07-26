const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the leaders to you!' + '\n');
})
.post((req, res, next) => {
    res.end('Will add the leader ' + req.body.name + ' with details: ' + req.body.description + '\n');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders' + '\n');
})
.delete((req, res, next) => {
    res.end('Deleting all the leaders!' + '\n');
});

leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!' + '\n');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId + '\n');
})
.put((req, res, next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description + '\n');
})
.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId + '\n');
});

module.exports = leaderRouter;
