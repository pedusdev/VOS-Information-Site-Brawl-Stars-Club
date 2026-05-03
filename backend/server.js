// 1. IMPORTACIONES (Traer las herramientas)
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

// 2. CONFIGURACIÓN (Aquí es donde se define "app")
const app = express(); // <--- ¡ESTA LÍNEA TIENE QUE IR ANTES QUE TODO LO DEMÁS!
app.use(cors());
app.use(express.json());

// 3. RUTAS (Lo que hace el servidor)

// Ruta para mostrar tu web (index.html)
app.get('/', (req, res) => {
    // Asegúrate de que el index.html esté en la misma carpeta que este server.js
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para la IA
app.post('/ask-ia', async (req, res) => {
    const { pregunta } = req.body;
    const API_KEY = process.env.API_GROQ; // Usa el nombre exacto que pusiste en Render

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
                    { role: "system", content: "Eres el bot de soporte de un club de Brawl Stars." },
                    { role: "user", content: pregunta }
                ]
            })
        });

        const data = await response.json();
        res.json({ respuesta: data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: "Error en la IA" });
    }
});

// 4. ENCENDER EL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor funcionando en el puerto ${PORT}`));
