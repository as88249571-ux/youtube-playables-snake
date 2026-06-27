// ==========================================
// 0. YOUTUBE PLAYABLES - FIRST FRAME READY
// ==========================================
// जैसे ही स्क्रिप्ट लोड हो, यह सिग्नल तुरंत जाना चाहिए
if (typeof ytgame !== 'undefined') {
    ytgame.game.firstFrameReady(); 
    console.log("YouTube SDK: First Frame Ready");
}

// ==========================================
// 1. GAME CONSTANTS & VARIABLES
// ==========================================
let inputDir = { x: 0, y: 0 }; 
const foodsound = new Audio('food.mp3');
const gameoversound = new Audio('gameover.mp3');
const movesound = new Audio('move.mp3');
const musicsound = new Audio('music.mp3');
let speed = 6; // साँप की स्पीड
let score = 0;
let lastpainttime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

let isGamePaused = false; // YouTube पॉज़ स्टेट ट्रैक करने के लिए वेरिएबल

// ==========================================
// 2. GAME FUNCTIONS
// ==========================================
function main(ctime) {
    window.requestAnimationFrame(main);
    
    // अगर YouTube पर गेम पॉज़ है, तो फ्रेम अपडेट न करें
    if (isGamePaused) {
        return; 
    }

    if ((ctime - lastpainttime) / 1000 < 1 / speed) {
        return;
    }
    lastpainttime = ctime;
    gameEngine();
}

function iscollide(snake) {
    // अगर साँप खुद से टकरा जाए
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // अगर साँप दीवार से टकरा जाए
    if (snake[0].x > 18 || snake[0].x <= 0 || snake[0].y > 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (iscollide(snakeArr)) {
        gameoversound.play();
        musicsound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key or touch arrow to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        musicsound.play();
        score = 0;
    }

    // अगर साँप ने खाना खा लिया है
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodsound.play();
        score += 1;
        score.innerHTML = "score: " + score;
        let a = 2;
        let b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()), 
            y: Math.round(a + (b - a) * Math.random())
        };
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
    }

    // साँप को आगे बढ़ाना (Moving the snake)
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    
    // जब साँप चल रहा हो तभी साउंड प्ले हो
    if(inputDir.x !== 0 || inputDir.y !== 0){
        movesound.play();
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    const board = document.getElementById('board');
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // खाने को स्क्रीन पर दिखाना
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// ==========================================
// 3. MAIN LOGIC & INITIALIZATION
// ==========================================
// गेम लूप शुरू करना
window.requestAnimationFrame(main);

// जैसे ही पूरा गेम स्क्रीन पर लोड हो जाए, YouTube को गेम रेडी का सिग्नल दें
if (typeof ytgame !== 'undefined') {
    ytgame.game.gameReady();
    console.log("YouTube SDK: Game Ready");
}

// ==========================================
// 4. CONTROLS (KEYBOARD & MOBILE)
// ==========================================

// क) कीबोर्ड कंट्रोल्स (फॉर PC डेस्कटॉप)
window.addEventListener('keydown', e => {
    if (isGamePaused) return; // पॉज़ होने पर कीबोर्ड काम न करे
    
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) { inputDir.x = 0; inputDir.y = -1; }
            break;

        case "ArrowDown":
            if (inputDir.y !== -1) { inputDir.x = 0; inputDir.y = 1; }
            break;

        case "ArrowLeft":
            if (inputDir.x !== 1) { inputDir.x = -1; inputDir.y = 0; }
            break;

        case "ArrowRight":
            if (inputDir.x !== -1) { inputDir.x = 1; inputDir.y = 0; }
            break;

        default:
            break;
    }
});

// ख) ऑन-स्क्रीन मोबाइल बटन्स कंट्रोल्स (फॉर स्मार्टफोन)
document.getElementById("btn-up").addEventListener("click", () => {
    if (isGamePaused) return;
    if (inputDir.y !== 1) { inputDir.x = 0; inputDir.y = -1; }
});

document.getElementById("btn-down").addEventListener("click", () => {
    if (isGamePaused) return;
    if (inputDir.y !== -1) { inputDir.x = 0; inputDir.y = 1; }
});

document.getElementById("btn-left").addEventListener("click", () => {
    if (isGamePaused) return;
    if (inputDir.x !== 1) { inputDir.x = -1; inputDir.y = 0; }
});

document.getElementById("btn-right").addEventListener("click", () => {
    if (isGamePaused) return;
    if (inputDir.x !== -1) { inputDir.x = 1; inputDir.y = 0; }
});

// ==========================================
// 5. YOUTUBE PLAYABLES SYSTEM EVENTS
// ==========================================
if (typeof ytgame !== 'undefined') {
    // जब यूजर गेम बैकग्राउंड में डाले या यूट्यूब ऐप मिनिमाइज़ करे
    ytgame.system.onPause(() => {
        isGamePaused = true; 
        musicsound.pause(); // बैकग्राउंड म्यूजिक बंद करें
        console.log("YouTube System: Game Paused");
    });

    // जब यूजर वापस गेम स्क्रीन पर आए
    ytgame.system.onResume(() => {
        isGamePaused = false;
        musicsound.play(); // बैकग्राउंड म्यूजिक दोबारा शुरू करें
        console.log("YouTube System: Game Resumed");
    });
}

function subscribeToChannel() {
  
    // ध्यान रहे कि अंत में ?sub_confirmation=1 ज़रूर लगा रहे ताकि डायरेक्ट सब्सक्राइब का पॉप-अप आए
    const channelUrl = 'https://www.youtube.com/@webdevloper-r5w';
    
    if (typeof ytgame !== 'undefined' && ytgame.engagement) {
        ytgame.engagement.openYTContent({
            url: channelUrl
        });
    } else {
        window.open(channelUrl, '_blank');
    }
}
