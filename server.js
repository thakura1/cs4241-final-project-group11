// Basic Server Setup
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/level_builder', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'level_builder.html'));
})

app.get('/community', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'community.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
})

// start
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});