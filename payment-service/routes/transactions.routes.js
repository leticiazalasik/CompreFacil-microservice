const tc = require('../controllers/transactions.controller');

const router = require('express').Router();

// chama a função do controller
router.post('/transacao',tc.processaTransacao)

module.exports = router;
