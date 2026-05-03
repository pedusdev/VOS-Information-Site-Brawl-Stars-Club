const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/ask-ia', async (req, res) => {
    const { pregunta } = req.body;
    // Render nos dará esta variable automáticamente
    const API_KEY = process.env.GROQ_API_KEY; 

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: pregunta }]
            })
        });
        const data = await response.json();
        res.json({ respuesta: data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: "Error en la IA" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend en puerto ${PORT}`));
