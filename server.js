// Basic Server Setup
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(express.json());

const uri = process.env.MONGO_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}); 

let levelCollection = null

async function run() {
  try {
    // Connect the client
    await client.connect();

    // Get collection
    levelCollection = client.db("snakeDatabase").collection("levels");

    // Test connection
    await client.db("snakeDatabase").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}

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


app.post("/level", async (req, res) => {
    let body = req.body;
    const pushedLevel = await levelCollection.insertOne(body);
    res.writeHead( 200, { 'Content-Type': 'application/json' })
    res.end( )
})


run().catch(console.dir);

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