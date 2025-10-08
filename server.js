// Basic Server Setup
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

// Lightweight auth status endpoint for client-side UI toggling
app.get("/api/auth-status", (request, response) => {
  const isAuthenticated = !!(request.oidc && request.oidc.isAuthenticated())
  if (!isAuthenticated) {
    return response.json({ authenticated: false })
  }
  response.json({
    authenticated: true,
    user: {
      sub: request.oidc.user?.sub,
      name: request.oidc.user?.name,
      email: request.oidc.user?.email
    }
  })
})

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

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


app.post("/level", requiresAuth(), async (req, res) => {
    let body = req.body;
    
    // Add user information to the level data
    const levelData = {
        title: body.title,
        layout: body.layout,
        createdBy: req.oidc.user.sub // Auth0 user subid
    };
    
    const pushedLevel = await levelCollection.insertOne(levelData);
    res.writeHead( 200, { 'Content-Type': 'application/json' })
    res.end( )
})

app.get("/levels", async (req, res) => {
    const levels = await levelCollection.find({}).toArray();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end( JSON.stringify(levels));
})

app.get("/levels/:id", async (req, res) => {
    const level = await levelCollection.find({_id: new ObjectId(req.params.id)}).toArray();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end( JSON.stringify(level[0]));
})

run().catch(console.dir);

app.get('/community', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'community.html'));
})

app.get('/login', (req, res) => {
    res.oidc.login();
})

app.get('/logout', (req, res) => {
    res.oidc.logout();
})

// start
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});