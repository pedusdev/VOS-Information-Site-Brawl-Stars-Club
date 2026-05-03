// backend/server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Si usas Node < 18
require('dotenv').config();

const app = express();
app.use(cors()); // Esto permite que tu web conecte con el servidor
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/ask-brawlbot', async (req, res) => {
    const { pregunta } = req.body;
    const API_KEY = process.env.GROQ_API_KEY; // Se configura en el panel de Render

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "Eres el bot de un club de Brawl Stars..." },
                    { role: "user", content: pregunta }
                ]
            })
        });

        const data = await response.json();
        res.json({ respuesta: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'Error con la IA' });
    }
});

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
