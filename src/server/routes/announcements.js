const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/announcements', async (req, res) => {
    try {
        const announcements = await prisma.announcements.findMany();

        if (announcements.length === 0) {
            // Si no hay anuncios, devuelve un mensaje o un valor predeterminado
            return res.json([{
                id: 0,
                title: "No hay anuncios disponibles",
                image_url: "https://via.placeholder.com/300x200?text=Sin+Anuncios",
                date: null,
                created_at: null,
            }]);
        }

        res.json(announcements);
    } catch (error) {
        console.error("Error al obtener anuncios:", error);
        res.status(500).json({ error: "Error al obtener anuncios" });
    }
});

module.exports = router;
