const messagesContainer = document.getElementById(`messages`);
const input = document.getElementById(`message-input`);
const sendButton = document.getElementById(`send`);
var qaIdx = 98703480,answers={},answerContent='',answerWords=[];
var codeStart=false,lastWord='',lastLastWord='';
var typingTimer=null,typing=false,typingIdx=0,contentIdx=0,contentEnd=false;


const stop_generating = document.querySelector(`.stop_generating`);

const remove_cancel_button = async () => {
  stop_generating.classList.add(`stop_generating-hiding`);

  setTimeout(() => {
    stop_generating.classList.remove(`stop_generating-hiding`);
    stop_generating.classList.add(`stop_generating-hidden`);
  }, 300);
};

// markdown highlighting settings
marked.setOptions({
    highlight: function (code, language) {
        const validLanguage = hljs.getLanguage(language) ? language : 'javascript';
        return hljs.highlight(code, { language: validLanguage }).value;
    },
});

hljs.addPlugin(new CopyButtonPlugin());

// Automatically adjust the input box height when inputting or focusing
input.addEventListener('input', adjustInputHeight);
input.addEventListener('focus', adjustInputHeight);

// Automatically adjust input box height
function adjustInputHeight() {
    input.style.height = 'auto'; // Reset height to 80px (auto)
    input.style.height = (input.scrollHeight+2) + 'px';
}

function sendMessage() {
    const inputValue = input.value;
    if (!inputValue) {
        return;
    }
    const question = document.createElement('div');
    question.setAttribute('class', 'message');
    question.setAttribute('id', 'question-'+qaIdx);
    question.innerHTML = `
                <div class="user">
                    ${user_image}
                    <i class="fa-regular fa-phone-arrow-up-right"></i>
                </div>
                <div class="content" id="user_${qaIdx}"> 
                    ${marked.parse(inputValue)}
                </div>
        `;
    messagesContainer.appendChild(question);

    const answer = document.createElement('div');
    answer.setAttribute('class', 'message');
    answer.setAttribute('id', 'answer-'+qaIdx);
    answer.innerHTML = '<div id="cursor"></div>';
    messagesContainer.appendChild(answer);

    answers[qaIdx] = document.getElementById('answer-'+qaIdx);

    input.value = '';
    input.disabled = true;
    stop_generating.classList.remove(`stop_generating-hidden`);
    adjustInputHeight();

    typingTimer = setInterval(typingWords, 50);

    getAnswer(inputValue);
	
	var textarea = document.getElementById('message-input');
    var text = textarea.value;
    var highlighted = hljs.highlightAuto(text).value;
    textarea.value = highlighted;
}

function getAnswer(inputValue){
    inputValue = encodeURIComponent(inputValue.replace(/\+/g, '{[$add$]}'));
    const url = "./chat.php?q="+inputValue;
    const eventSource = new EventSource(url);

    eventSource.addEventListener("open", (event) => {
        console.log("Connection is made", JSON.stringify(event));
    });

    eventSource.addEventListener("message", (event) => {
        //console.log("Date recieved：", event);
        try {
            var result = JSON.parse(event.data);
            if(result.time && result.content ){
                answerWords.push(result.content);
                contentIdx += 1;
            }
        } catch (error) {
            console.log(error);
        }
    });
     
    const stopBtn = document.getElementById("cancelButton");
    stopBtn.addEventListener("click", () => {
    eventSource.close();
    contentEnd = true;
    clearInterval(typingTimer);
    answerContent = '';
    answerWords = [];
    answers = [];
    typingIdx = 0;
    contentIdx = 0;
    contentEnd = false;
    input.disabled = false;
    typing = false;
    document.getElementById(`gpt_${qaIdx}`).innerHTML += ` [aborted]`;
    qaIdx += 1;
    stop_generating.classList.add(`stop_generating-hidden`);
    console.log((new Date().getTime()), 'answer stopped');
    });
	 
    eventSource.addEventListener("error", (event) => {
        console.error("An error occurred：", JSON.stringify(event));
    });

    eventSource.addEventListener("close", (event) => {
        console.log("Connection closed", JSON.stringify(event.data));
        eventSource.close();
        contentEnd = true;
        console.log((new Date().getTime()), 'answer end');
    });
}

function typingWords(){
    if(contentEnd && contentIdx==typingIdx){
        clearInterval(typingTimer);
        answerContent = '';
        answerWords = [];
        answers = [];
        qaIdx += 1;
        typingIdx = 0;
        contentIdx = 0;
        contentEnd = false;
        lastWord = '';
        lastLastWord = '';
        input.disabled = false;	
		input.focus();
		stop_generating.classList.add(`stop_generating-hidden`);
        console.log((new Date().getTime()), 'typing end');
        return;
	}
    if(contentIdx<=typingIdx){
        return;
    }
    if(typing){
        return;
    }
	
    typing = true;
    
    if(!answers[qaIdx]){
        answers[qaIdx] = document.getElementById('answer-'+qaIdx);
    }

    const content = answerWords[typingIdx];
    if(content.indexOf('`') != -1){
        if(content.indexOf('```') != -1){
            codeStart = !codeStart;
        }else if(content.indexOf('``') != -1 && (lastWord + content).indexOf('```') != -1){
            codeStart = !codeStart;
        }else if(content.indexOf('`') != -1 && (lastLastWord + lastWord + content).indexOf('```') != -1){
            codeStart = !codeStart;
        }
    }
	
    lastLastWord = lastWord;
    lastWord = content;
	
    answerContent += content;
	
    answers[qaIdx].innerHTML = `
    <div class="user">
    ${gpt_image}
    <i class="fa-regular fa-phone-arrow-down-left"></i>
    </div>
    <div class="content" id="gpt_${qaIdx}">
     ${marked.parse(answerContent + (codeStart ? '\n\n```' : ''))}
    </div>
    `;
    typingIdx += 1;
    typing = false;
	
    document.querySelectorAll('code:not(p code):not(li code)').forEach((el) => {
  hljs.highlightElement(el);
});

}
