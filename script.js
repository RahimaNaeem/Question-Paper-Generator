const questionGenerator = document.getElementById('questionGenerator');
const questionsList = document.getElementById('questionsList');
const totalQuestionCount = document.getElementById('totalQuestionCount');
const totalMarks = document.getElementById('totalMarks');
let questions = JSON.parse(localStorage.getItem('questions')) || [];



// ---------------------------------------------------( SECTION:- QUESTION GENERATOR )---------------------------------------------------


/* ................................................................................. Update question DIV area, in accord to Q:Type ... */
function updateQuestionType() {
    const type = document.getElementById('questionType').value;
    const optionsDiv = document.getElementById('questionOptions');
    optionsDiv.innerHTML = '';

    if (type === 'mcq_single' || type === 'mcq_multiple') {
        addOptionFields(type, optionsDiv);
    } else if (type === 'scale_rating') {
        addScaleFields(optionsDiv);
    }
}




/* ................................................................................. INSIDE DIV: Add MCQ option fields (right when selected) ... */
function addOptionFields(type, container) {
    container.innerHTML = `
        <div id="optionsContainer" class="py-3">
            <div class="mb-2 d-flex align-items-center justify-content-center">
                <input type="${type === 'mcq_single' ? 'radio' : 'checkbox'}" class="form-check-input mb-1">
                <input type="text" class="form-control mx-3" placeholder="Insert option..." style="width: 36%;">
                <button type="button" class="btn btn-outline-danger remove-option-btn me-2 p-0"  onclick="removeOption(this)" style="width: 18px; height: 18px; display: flex; justify-content: center; align-items: center; border-radius: 50%;"><i class="bi bi-dash" style="font-size: 16px;"></i></button>
                <button type="button" class="btn btn-outline-success add-option-btn me-2 p-0" onclick="addOption(this)" style="width: 18px; height: 18px; display: flex; justify-content: center; align-items: center; border-radius: 50%;"><i class="bi bi-plus" style="font-size: 16px;"></i></button>
            </div>
        </div>
    `;
}




/* ................................................................................. INSIDE DIV: Add SCALE rating Fields ... */
function addScaleFields(container) {
    container.innerHTML = `
        <div class="mb-3 pt-3">
            <label for="lowestLabel" class="form-label">Lowest Label: </label>
            <input type="text" id="lowestLabel" class="form-control d-inline w-25">
        </div>
        <div class="mb-3">
            <label for="highestLabel" class="form-label">Highest Label: </label>
            <input type="text" id="highestLabel" class="form-control d-inline w-25">
        </div>
        <div class="mb-3 pb-3">
            <label for="scaleType" class="form-label">Scale Type: </label>
            <select id="scaleType" class="form-select d-inline w-25">
                <option value="5">1-5</option>
                <option value="10">1-10</option>
            </select>
        </div>
    `;
}




/* ................................................................................. INSIDE MCQ OPTIONs: Add new option + Remove option ... */

// Add new option
function addOption(button) {
    const type = document.getElementById('questionType').value;
    const parentDiv = button.parentElement;

    const newOption = `
        <div class="mb-2 d-flex align-items-center justify-content-center smallbtnsoptions">
            <input type="${type === 'mcq_single' ? 'radio' : 'checkbox'}" class="form-check-input mb-1">
            <input type="text" class="form-control mx-3" placeholder="Insert option..." style="width: 36%;">
            <button type="button" class="btn btn-outline-danger remove-option-btn me-2 p-0" onclick="removeOption(this)" style="width: 18px; height: 18px; display: flex; justify-content: center; align-items: center; border-radius: 50%;"><i class="bi bi-dash" style="font-size: 16px;"></i></button>
            <button type="button" class="btn btn-outline-success add-option-btn me-2 p-0" onclick="addOption(this)" style="width: 18px; height: 18px; display: flex; justify-content: center; align-items: center; border-radius: 50%;"><i class="bi bi-plus" style="font-size: 16px;"></i></button>
        </div>
    `;

    parentDiv.insertAdjacentHTML('afterend', newOption);
}

// Remove an option
function removeOption(button) {
    const container = document.getElementById('optionsContainer');
    if (container.children.length > 1) {
        button.parentElement.remove();
    }
}




/* .................................................................................   ADDING THE NEW QUESTION TO "LOCAL STORAGE" ... */
function addQuestion() {
    const questionText = document.getElementById('questionText').value;
    const questionType = document.getElementById('questionType').value;
    const marks = parseInt(document.getElementById('marks').value, 10);
    let options = [];

    if (questionText === "") {
        let insertModal = new bootstrap.Modal(document.getElementById("InsertAllFields"));
        insertModal.show();   
    } else {
        if (questionType === 'mcq_single' || questionType === 'mcq_multiple') {
            document.querySelectorAll('#optionsContainer .form-check-input').forEach((input) => {
                options.push({
                    text: input.nextElementSibling.value,
                    type: input.type
                });
            });
        } else if (questionType === 'scale_rating') {
            options = {
                scaleType: document.getElementById('scaleType').value,
                lowestLabel: document.getElementById('lowestLabel').value,
                highestLabel: document.getElementById('highestLabel').value
            };
        }
        
        questions.push({
            text: questionText,
            type: questionType,
            options: options,
            marks: marks
        });
        
        localStorage.setItem('questions', JSON.stringify(questions));
        renderQuestions();
        clearForm();
    }
}




/* ............................................. RENDERING AND DISPLAYING THE QUESTIONS(+their OPTIONS) TO "all added questions: SECTION" ... */

// renders question and creates its card to be displayed
function renderQuestions() {
    questionsList.innerHTML = '';
    let totalMarksValue = 0;

    questions.forEach((q, index) => {
        totalMarksValue += q.marks;
        questionsList.innerHTML += `
            <div class="card p-3 position-relative my-4" data-index="${index}">
                <div class="position-absolute top-0 end-0 p-1 mt-1">
                    <button type="button" class="btn btn-secondary me-1 px-1 py-0" id="upArrowMove-${index}" onclick="moveQuestion(${index}, 'up')"><i class="bi bi-arrow-up"></i></button>
                    <button type="button" class="btn btn-secondary me-1 px-1 py-0" id="downArrowMove-${index}" onclick="moveQuestion(${index}, 'down')"><i class="bi bi-arrow-down"></i></button>
                    <button type="button" class="btn btn-danger px-1 py-0 me-1" onclick="removeQuestion(${index})"><i class="bi bi-x"></i></button>
                </div>
                <h5 class="card-title bg-question py-3">Question ${index + 1}</h5>
                <p class="card-text mt-5 mb-2">${q.text}</p>
                <p class="card-text bg-warning-subtle rounded-pill text-center" style="width: 4.3rem; font-size: 14px;">Marks: ${q.marks}</p>
                ${renderOptions(q, index)}
            </div>
        `;
    });

    totalQuestionCount.innerText = questions.length;
    totalMarks.innerText = totalMarksValue;
    questions.forEach((_, index) => upDownStateOfCard(index));
}


// Renders options based on the question type and displays into the card
function renderOptions(question, index) {
    if (question.type === 'mcq_single' || question.type === 'mcq_multiple') {
        return question.options.map(option => `
            <div class="form-check">
                <input class="form-check-input" type="${option.type}">
                <label class="form-check-label">&nbsp; ${option.text}</label>
            </div>
        `).join('');
    } else if (question.type === 'scale_rating') {
        return `
            <div class="scale-labels">
                <span class="me-4">${question.options.lowestLabel}</span>
                ${Array.from({ length: question.options.scaleType }, (_, i) => `
                    <div class="form-check bg-light me-2 text-center rounded-pill">
                        <input class="form-check-input me-2" type="radio" name="scale-${index}" id="scale-${index}-${i+1}" value="${i+1}">
                        <label class="form-check-label me-2" for="scale-${index}-${i+1}">${i+1}</label>
                    </div>
                `).join('')}
                <span class="ms-3">${question.options.highestLabel}</span>
            </div>
        `;
    } else if (question.type === 'true_false') {
        return `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="trueFalse-${index}" id="true${index}" value="true">
                <label class="form-check-label" for="true${index}">&nbsp; True</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="trueFalse-${index}" id="false${index}" value="false">
                <label class="form-check-label" for="false${index}">&nbsp; False</label>
            </div>
        `;
    } else if (question.type === 'short_answer') {
        return `<input type="text" class="form-control" placeholder="Type your answer here...">`;
    } else if (question.type === 'long_answer') {
        return `<textarea class="form-control" rows="4" placeholder="Type your answer here..."></textarea>`;
    }
}

/* ................................................................................. CLEAR FORM QUESTION FIELDS ... */

function clearForm() {
    document.getElementById('questionForm').reset();
    document.getElementById('questionOptions').innerHTML = '';
}




// ------------------------------------( SECTION:- ALL ADDED QUESTIONS )------------------------------------------


// FUNCTION: Closes the QUESTION GENERATOR section
function toggleQuestionGenerator() {
    questionGenerator.classList.toggle('collapsed');
}

// FUNCTION: Modal appears --> Remove question by index
function removeQuestion(index) {
    let deleteModal = new bootstrap.Modal(document.getElementById("deleteQuestionCard"));
    deleteModal.show();
    let currentQ = questions[index];
    document.getElementById("questionStatement").innerHTML = `<mark>&nbsp;<h6 class="d-inline">Question ${index + 1}:</h6> ${currentQ.text}&nbsp;&nbsp;</mark>`;


    document.getElementById("confirmDelete").onclick = () => {
        questions.splice(index, 1);
        localStorage.setItem('questions', JSON.stringify(questions));
        renderQuestions();
        deleteModal.hide();
    };

    document.getElementById("closeDelete").onclick = () => {
        deleteModal.hide();
    }

}

// FUNCTION: Move question up or down in the list
function moveQuestion(index, direction) {

    if (direction === 'up' && index > 0) {
        [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
    } else if (direction === 'down' && index < questions.length - 1) {
        [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    }
    localStorage.setItem('questions', JSON.stringify(questions));
    renderQuestions();
}


// FUNCTION: Update state
function upDownStateOfCard(index) {
    const upButton = document.getElementById(`upArrowMove-${index}`);
    const downButton = document.getElementById(`downArrowMove-${index}`);

    // Disable "Move Up" button if at the top
    if (index === 0) {
        upButton.classList.add("disabled-button");
    } else {
        upButton.classList.remove("disabled-button");
    }

    // Disable "Move Down" button if at the bottom
    if (index === questions.length - 1) {
        downButton.classList.add("disabled-button");
    } else {
        downButton.classList.remove("disabled-button");
    }
    
}

// -------------------------------------------( LOAD LOCAL-STORAGE )------------------------------------------------
renderQuestions();

