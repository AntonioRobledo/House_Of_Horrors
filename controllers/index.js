const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes.js');
/* const movieRoutes = require('./movieRoutes.js'); */

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
/* router.use('/', movieRoutes); */

module.exports = router;