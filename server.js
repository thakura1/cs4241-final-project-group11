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
      email: request.oidc.user?.email,
      nickname: request.oidc.user?.nickname,
      given_name: request.oidc.user?.given_name,
      family_name: request.oidc.user?.family_name
    }
  })
})

// Full user data endpoint for authenticated users
app.get("/api/user-data", requiresAuth(), (request, response) => {
  response.json({
    authenticated: true,
    user: {
      sub: request.oidc.user?.sub,
      name: request.oidc.user?.name,
      email: request.oidc.user?.email,
      nickname: request.oidc.user?.nickname,
      given_name: request.oidc.user?.given_name,
      family_name: request.oidc.user?.family_name
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
let scoresCollection = null

async function run() {
  try {
    // Connect the client
    await client.connect();

    // Get collection
    levelCollection = client.db("snakeDatabase").collection("levels");
    scoresCollection = client.db("snakeDatabase").collection("scores");

    // Test connection
    await client.db("snakeDatabase").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Some routes depend on the database connection
    setupRoutes();
    
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

app.get('/community', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'community.html'));
})

app.get('/login', (req, res) => {
    res.oidc.login();
})

app.get('/logout', (req, res) => {
    res.oidc.logout();
})

// Got an error for some routes because the database was not connected before
// the routes were set up. I moved the routes to a function to be called after 
// the database is connected.
function setupRoutes() {
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

    // Submit a score for a level
    app.post("/scores", requiresAuth(), async (req, res) => {
        const { levelId, score } = req.body;
        
        // Use server-side Auth0 data directly
        const finalUsername = req.oidc.user?.nickname || 
                             req.oidc.user?.name || 
                             req.oidc.user?.email || 
                             'Anonymous';
        
        const scoreData = {
            levelId: new ObjectId(levelId),
            userId: req.oidc.user.sub,
            userName: finalUsername,
            score: score,
            timestamp: new Date()
        };
        
        try {
            await scoresCollection.insertOne(scoreData);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (error) {
            console.error("Error submitting score:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: "Failed to submit score" }));
        }
    })

    // Get top scores for a specific level
    app.get("/scores/:levelId", async (req, res) => {
        try {
            const levelId = new ObjectId(req.params.levelId);
            const topScores = await scoresCollection
                .find({ levelId: levelId })
                .sort({ score: -1 })
                .limit(3)
                .toArray();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(topScores));
        } catch (error) {
            console.error("Error fetching scores:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Failed to fetch scores" }));
        }
    })
}

run().catch(console.dir);

// start
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});