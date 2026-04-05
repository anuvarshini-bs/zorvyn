const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { validateRecord } = require('../middleware/validators');
const { requireRole } = require('../middleware/roleCheck');

// Analysts and Admins can list records
router.get('/', requireRole(['Analyst', 'Admin']), recordController.listRecords);

// Only Admins can modify records
router.post('/', requireRole(['Admin']), validateRecord, recordController.createRecord);
router.put('/:id', requireRole(['Admin']), validateRecord, recordController.updateRecord);
router.delete('/:id', requireRole(['Admin']), recordController.deleteRecord);

module.exports = router;
