const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field"),
tryAgainBtn = document.querySelector(".try-again"),
timeTag = document.querySelector(".time span b"),
mistakeTag = document.querySelector(".mistake span"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span");
const highScore =  document.querySelector('.high-score span')
let wpm;


let timer,
maxTime = 60,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;




function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";

    //convert the string into an array of characters then create an span tag of every single character and add the all span tag to the typingtext element while iterating thru the array 
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
    });
    
    if(localStorage.highScoreNumber){
        highScore.innerText = localStorage.highScoreNumber;
    } else {
        highScore.innerText = 0
    }

    // add the active classname to the first word 
    typingText.querySelectorAll("span")[0].classList.add("active");
    //attach event listeners to make input field focused if user press any key or click on the the typing text area
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    //
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--;
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if(characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    }
     else {
        clearInterval(timer);
        inpField.value = "";
    
    }   
}

function initTimer() {
    if(timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
    }    
}

function resetGame() {
    loadParagraph();
    clearInterval(timer);
    const currentScore = parseInt(wpmTag.innerText);
    let highScoreNumber = localStorage.getItem('highScoreNumber');
    highScoreNumber = highScoreNumber ? parseInt(highScoreNumber) : 0;
    if (currentScore > highScoreNumber) {
        highScoreNumber = currentScore;
        localStorage.setItem('highScoreNumber', highScoreNumber);
        highScore.innerText = highScoreNumber;
    }
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
}

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);