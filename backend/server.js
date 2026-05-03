// backend/server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/ask-ia', async (req, res) => {
    const { pregunta } = req.body;
    const API_KEY = process.env.API_GROQ;

    if (!pregunta) {
        return res.status(400).json({ error: 'Pregunta vacía' });
    }

    if (!API_KEY) {
        console.error('❌ API_GROQ no configurada');
        return res.status(500).json({ error: 'Servidor no configurado' });
    }

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
                    { 
                        role: "system", 
                        content: "Eres el bot del club VOS de Brawl Stars. El club tiene 1,355,022 copas, 29/30 miembros, requiere 40k copas. Se requiere actividad y Discord/WhatsApp. Responde amigable y conciso."
                    },
                    { role: "user", content: pregunta }
                ],
                temperature: 0.7,
                max_tokens: 250
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Groq error:', error);
            return res.status(500).json({ error: 'Error con la IA' });
        }

        const data = await response.json();
        res.json({ respuesta: data.choices[0].message.content });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'VOS Bot funcionando ✓' });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor en puerto ${PORT}`);
});
