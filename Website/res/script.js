const getElement = (selector) => document.querySelector(selector);

const insertData = (selector, data) => {
    document.querySelectorAll(selector).forEach(element => element.innerHTML = data)
}

// Insert data into the HTML elements
insertData("#question", `Q${currentQuestionId + 1}. ${question['question']}`);
insertData("#answer1", question['options'][0]);
insertData("#answer2", question['options'][1]);
insertData("#answer3", question['options'][2]);
insertData("#answer4", question['options'][3]);
insertData("#explanation", question['answer-context']);
insertData(".correct-answer", question['options'][question['answer']]);

// Hide proceed-area
getElement("#proceed-area").style.display = "none";

// Fill the learn-more links.
getElement("#learn-more-links").innerHTML = question['keywords'].map(keyword => `<a target="_blank" href="https://en.wikipedia.org/w/index.php?title=Special:Search&search=${keyword}" target="_blank">${keyword}</a>`).join(", ");

// Pick the next question.
{
    const pickRandomQuestion = () => Math.floor(Math.random() * numQuestions);

    const previousQuestionId = (currentQuestionId - 1) % numQuestions;
    const nextQuestionId = (currentQuestionId + 1) % numQuestions;
    const randomQuestionId = (() => {
        let tries = 0;
        for(let candidateId = pickRandomQuestion(); ++tries < 10; candidateId = pickRandomQuestion())
        {
            if(candidateId !== currentQuestionId) {
                return candidateId;
            }
        }
        return nextQuestionId;
    })();

    const setButton = (selector, questionId) => getElement(selector).href = `${questionId}.html`;
    setButton("#previous-question-button", previousQuestionId);
    setButton("#next-question-button", nextQuestionId);
    setButton("#random-question-button", randomQuestionId);
}



// Check answer
getElement("#answer-form").addEventListener("submit", (event) => {
    // Stop navigation.
    event.preventDefault();

    // Disable the button.
    getElement("#check-button").disabled = true;
    getElement("#check-button").style.display = "none";

    // Hide one of the result outcomes.
    const selectedAnswer = Number(document.querySelector('input[name="answer"]:checked').value);
    const isCorrect = selectedAnswer === question['answer'];
    getElement(!isCorrect ? "#result-correct" : "#result-incorrect").style.display = "none";

    // Show the result area.
    getElement("#proceed-area").style.display = "block";

    // Disable the form.
    document.querySelectorAll("#answer-form input").forEach(element => element.disabled = true);

});