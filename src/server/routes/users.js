const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middlewares/authenticate');  // Ajusta la ruta según sea necesario

const prisma = new PrismaClient();

router.post('/getUserProfileUrl', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ profileUrl: user.profile_picture_url });
    } catch (error) {
        console.error('Error fetching user profile URL:', error);
        res.status(500).json({ error: 'Error fetching user profile URL' });
    }
});

module.exports = router;
