let levels;

window.onload = async () => {
    levels = await fetch("/levels", {
        method: "GET",
    })

    const levelsStr = await levels.text();
    const levelsJSON = JSON.parse(levelsStr);

    let levelString = "";
    
    // Process each level and fetch its scores
    for (const level of levelsJSON) {
        // Fetch top scores for this level
        let topScores = [];
        try {
            const scoresResponse = await fetch(`/scores/${level._id}`, {
                method: "GET",
            });
            const scoresStr = await scoresResponse.text();
            topScores = JSON.parse(scoresStr);
        } catch (error) {
            console.error(`Error fetching scores for level ${level._id}:`, error);
        }
        
        // Create leaderboard HTML
        let leaderboardHTML = "";
        if (topScores.length > 0) {
            leaderboardHTML = `
                <div class="leaderboard">
                    <h4>Top Scores:</h4>
                    <ol class="score-list">
            `;
            topScores.forEach((score, index) => {
                const rank = `${index + 1}.`;
                leaderboardHTML += `
                    <li class="score-item">
                        <span class="rank">${rank}</span>
                        <span class="player-name">${score.userName}</span>
                        <span class="score-value">${score.score}</span>
                    </li>
                `;
            });
            leaderboardHTML += `
                    </ol>
                </div>
            `;
        } else {
            leaderboardHTML = `
                <div class="leaderboard">
                    <p class="no-scores">No scores yet</p>
                </div>
            `;
        }
        
        levelString += `
            <div class="level-card">
                <h2>${level.title}</h2>
                <a href="/?id=${level._id}" class="play-button">Play</a>
                ${leaderboardHTML}
            </div>
        `;
    }
    
    document.getElementById("community-levels").innerHTML = levelString;
}