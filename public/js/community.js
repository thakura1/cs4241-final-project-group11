let levels;

window.onload = async () => {
    levels = await fetch("/levels", {
        method: "GET",
    })

    const levelsStr = await levels.text();
    const levelsJSON = JSON.parse(levelsStr);

    let levelString = "";
    levelsJSON.forEach(level => {
        levelString+= `
            <div class="level-card">
                <h2>${level.title}</h2>
                <a href="/?id=${level._id}">Play</a>
            </div>
        `
    });
    document.getElementById("community-levels").innerHTML = levelString;
    
}