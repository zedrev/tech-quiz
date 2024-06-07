let startCurrentIndex = 0;
let playerScore = 0;

function InitializeElements(root = document.getElementById("root")) {
    return {    
        contentBox: root,                   
        topicTextContent: root.querySelector("#topic-text"),
        questionTextContent: root.querySelector("#question-text"),
        answerField: root.querySelector("#answer-field"),
        answerList: root.querySelector("#answer-list"),
        submitField: root.querySelector("#submit-field"),
        submitButton: root.querySelector("#next-button"),
    }
}

function ResetAppState() {
    const { answerField, submitField, answerList } = InitializeElements();

    Array.from(answerField.children).forEach(child => {
        if (child.tagName === "IMG") {
            answerField.removeChild(child);
        }
    })

    answerField.classList.remove("scrollable-answer-field");
    
    submitField.style.display = "none";
    while(answerList.firstChild)
        answerList.removeChild(answerList.firstChild);
}

function AnswerConditionLogic(e) {
    const { answerList, submitField } = InitializeElements();
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";

    if (isCorrect) {
        selectedButton.classList.add("correct");
        playerScore++;
    } else selectedButton.classList.add("incorrect");

    Array.from(answerList.children).forEach(button => {
        button.disabled = true;
    });
    submitField.style.display = "block";
}

function HandleNextQuestion(root, data) {
    startCurrentIndex++;
    if (startCurrentIndex < data.length) InitializeQuestion(root, data);
    else InitializeScore(data);
}

function InitializeScore(data) {
    ResetAppState();
    const {
        contentBox, topicTextContent, questionTextContent, answerField, submitField, submitButton
    } = InitializeElements();

    topicTextContent.textContent = "Congratulations!";
    questionTextContent.textContent = `You scored ${playerScore} out of ${data.length} !`;
    contentBox.style.minHeight = "200px";
    
    let img = document.createElement("img");
    img.src = "./img/win-icon.png";
    img.style.width = "180px";

    answerField.appendChild(img);
    answerField.style.display = "grid";
    answerField.style.placeContent = "center";

    submitButton.textContent = "PLAY AGAIN";
    submitField.style.display = "block";
}

function InitializeQuestion(root = document.getElementById("root"), data) {
    ResetAppState();
    const {
        topicTextContent, questionTextContent, answerField, answerList
    } = InitializeElements(root);
    
    let currentIndex = data[startCurrentIndex];
    let currentTopic = currentIndex.topic;
    let currentNumber = startCurrentIndex + 1;
    let currentQuestion =  currentNumber + ". " + currentIndex.question;

    topicTextContent.textContent = currentTopic;
    questionTextContent.textContent = currentQuestion;

    if (currentIndex.answers.length > 3) {
        answerField.classList.add("scrollable-answer-field");
    }

    if (currentIndex.answers.some(answer => answer.text.length > 58)) {
        answerField.classList.add("scrollable-answer-field");
    }

    currentIndex.answers.forEach(answer => {
        
        const createdButton = document.createElement("button");
        createdButton.classList.add("answer-button");
        createdButton.textContent = answer.text;

        answerList.appendChild(createdButton);
        if (answer.correct) createdButton.dataset.correct = answer.correct;
        createdButton.addEventListener("click", AnswerConditionLogic);
    });
}

export function ErrorState(error) {
    const {
        topicTextContent, questionTextContent, answerField, submitButton
    } = InitializeElements();
    
    answerField.style.display = "none";
    topicTextContent.textContent = "An Error Occured :(";
    questionTextContent.textContent = error;
    submitButton.textContent = "RELOAD";

    submitButton.addEventListener("click", () => {
        location.reload();
    });
}


export function InitializeQuizApp(getRoot, getData) {

    let root = getRoot;
    let data = getData;

    const { answerField, submitButton } = InitializeElements(root);
    
    

    submitButton.addEventListener("click", function() {
        if (startCurrentIndex < data.length) HandleNextQuestion(root, data)
        else InitializeQuizApp(root, data);
    })

    startCurrentIndex = 0;
    playerScore = 0;

    InitializeQuestion(root, data);
    
}