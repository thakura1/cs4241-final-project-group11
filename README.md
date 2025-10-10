# Final Project Team 11

Team Members: Aditri Thakur, Colin Lemire, Ethan Shanbaum, Hrithika Ravishankar

Link: https://cs4241-final-project-group11-production.up.railway.app/


Description:

We craeted a website where users can play snake. The main game follows using arrow keys or WASD to move a tiny snake within a bounded box. Apples will appear in random sections of the area. The snake must eat these apples to grow. However, the snake can not hit any bounds of the area, any walls, or itself. The more fruits a player's snake eats (and thus the longer they survive), the more points a user gains and the harder the game gets (faster snake). The game also features fun colors and sound effects from Tailwind and Web Audio API.  
Additionally, there is a community aspect to our snake game. Users can login through their github accounts or an email to participate in the community! They can then create and upload their own game maps for others to play. Additionally they can try to get a highscore and get their username up on a map's leaderboard. 


Instructions: 

To play the game, use arrow keys or WASD to move the snake around the bounded box. Eat Aplles. Avoid bounds and walls. To replay, hit restart. 

To login, naviagte to the login page, you can either create an account with an email and password or use github to login. Once logged in, you can upload maps and attach your username to any community maps you highscore on. To logout, slect log out.

To build maps, log in. Then give your map a name and use the arrow keys or WASD to move around the boundary area. To place walls, hit eneter. To remove blocks, place the cursor over an exisiting wall and hit eneter. To clear the grid to start over, click clear grid. To upload your map, click upload. 

To play community games, naviagte to the community page and select play on the map you wish to try. If you get a highscore, you can view your username (or anonymous if not logged in) on the map. 


Technologies: 

- MongoDB: Stores user data (e.g., login info, high scores, and custom maps) in a NoSQL database
- Auth0: Secures user authentication through email or github and controls access to restricted features like uploading maps
- Javascript: Used for client-side and server-side programs
- Canvas API: Renders the game graphics and animations in the browser
- Web Audio API: Manages sound effect
- Tailwind: Provides styling for web application
- Express.js: Handles backend routing and API endpoints for game data, authentication, and map management
- Node.js: Provides the runtime environment that runs the backend logic and connects everything
- Railway: Used to host and deploy web application


Challenges:
- We had issues with accessing logging in through Github on Render, so we switched to Railway.
- We experienced challenges with resizing the canvas for all different screens, so we allowed scrollability.
- We also had minor hiccups with testing with different browsers, but were able to move past that. Chrome works, but typically other browsers like edge and firefox consistenly worked during development. 


Work Allocation:

- Aditri: Main Game, Deployment
- Colin: AuthO, Community Functionality, Highscores
- Ethan: Level Builder, MongoDB Set up, Community Functionality
- Hrithika: Pages, Tailwind Styling, Sound Effects


Accessibility:

On Lighthouse, our project recieved an 100 for accessibility. We stuck to high contrast and clear visuals using tailwind. Additionally we chose very reable fonts. For playing the game, we chose keyboard navigation, a common and accessible game mechanism for user ease. Additionally we provided two options (arrows or WASD) for user prefrence. We also ensured that the canvas resizes dynamically and added scrollability so the game remains playable and visually consistent across different devices with different screen sizes.


Technical Achievments:

Tech Achievement 1: We implemented OAuth authentication with Auth0, allowing users to log in using either GitHub or email. Auth0 integration required managing authentication tokens, handling user sessions, and connecting the login system with MongoDB to store user-specific data like custom maps and high scores.

Tech Achievement 2: We built our game upon Canvas API in JavaScript. This enabled us to have real-time snake movements, collision detection, fruit spawning, and difficulty scaling. Additionally, the canvas dynamically resizes for different devices and screen sizes to maintain gameplay.

Tech Achievement 3: We designed and implemented a map builder feature that lets logged-in users design, create, and upload their own maps to the database as JSON layouts. This involved integrating with MongoDB for storage. Our system then can render these maps on the game page.

Tech Achievement 4: We designed and implemented a dynamic leaderboard system that records and displays high scores for each map. Each score is stored in MongoDB and linked to the authenticated user’s account. This required validating users via Auth0 and updating the leaderboard in real time on the front end.


