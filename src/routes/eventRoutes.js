const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { createEvent, deleteEvent, awardEvent } = require('../services/eventService');

const router = express.Router();


router.post('/', requireRole('admin'), async (req, res) => {
    console.log('Received request to create event with body:', req.body);
    await createEvent(req.body);
    res.redirect('/dashboard');
});


router.post('/:id/delete', requireRole('admin'), async (req, res) => {
    await deleteEvent(req.params.id);
    res.redirect('/dashboard');
});


router.post('/:id/award', requireRole('admin'), async (req, res) => {
    const eventId = req.params.id;
    const reward = parseInt(req.body.reward, 10);
    if (isNaN(reward) || reward < 0) {
        return res.status(400).send('Invalid reward value');
    } else {
        await awardEvent(eventId, reward);
        res.redirect('/dashboard');
    }
});

module.exports = router;




