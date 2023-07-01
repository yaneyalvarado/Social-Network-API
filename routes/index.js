const router = require('express').Router();

// import all API routes from './api' in routes 
const apiRoutes = require('./api');

// add prefix of '/api' to all api routes imported
router.use('/api', apiRoutes);

router.unsubscribe((req, res) => res.send('Error'));

module.exports = router;