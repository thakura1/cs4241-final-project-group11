// Basic Server Setup
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const { MongoClient, ServerApiVersion } = require('mongodb');
const { auth } = require('express-openid-connect');
require("dotenv").config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.AUTH_BASEURL,
  clientID: process.env.AUTH_CLIENTID,
  issuerBaseURL: process.env.AUTH_ISSUERBASEURL
};

app.use(auth(config));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

const { requiresAuth } = require('express-openid-connect');

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

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

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/level_builder', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'level_builder.html'));
})

run().catch(console.dir);

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});

