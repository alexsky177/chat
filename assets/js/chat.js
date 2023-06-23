const query = (obj) => Object.keys(obj) .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k])) .join("&");
const markdown = window.markdownit();
const message_box = document.getElementById(`messages`);
const message_input = document.getElementById(`message-input`);
const box_conversations = document.querySelector(`.top`);
const spinner = box_conversations.querySelector(".spinner");
const stop_generating = document.querySelector(`.stop_generating`);
const send_button = document.querySelector(`#send-button`);
let prompt_lock = false;
const messageHistory = [];

var model = "gpt-3.5-turbo-16k";
var temperatureString = "0.6°";
var cleanedString = temperatureString.replace(/[^0-9\.]/g, '');
var temperature = parseFloat(cleanedString);

// Add event listeners
document.addEventListener("DOMContentLoaded", function() {
	var modelSelect = document.getElementById(`model`);
	var temperatureSelect = document.getElementById(`temperature`);

	modelSelect.addEventListener("change", function() {
		model = modelSelect.options[modelSelect.selectedIndex].value;
		console.log('Model value changed to: ' + model);
	});

	temperatureSelect.addEventListener("change", function() {
		temperatureString = temperatureSelect.options[temperatureSelect.selectedIndex].value;
		cleanedString = temperatureString.replace(/[^0-9\.]/g, '');
		temperature = parseFloat(cleanedString);
		console.log('Temperature value changed to: ' + temperature);
	});
});

hljs.addPlugin(new CopyButtonPlugin());

function resizeTextarea(textarea) {
	textarea.style.height = '80px';
	textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

const format = (text) => {
	return text.replace(/(?:\r\n|\r|\n)/g, "<br>");
};

message_input.addEventListener("blur", () => {
	window.scrollTo(0, 0);
});

const delete_conversations = async () => {
    const confirmed = confirm("Are you sure you want to delete all conversations?");
    if (confirmed) {
        localStorage.clear();
        await new_conversation();
    }
};

const handle_ask = async () => {
	message_input.style.height = `80px`;
	message_input.focus();

	window.scrollTo(0, 0);
	let message = message_input.value;

	if (message.length > 0) {
		message_input.value = ``;
		await ask_gpt(message);
	}
};

const remove_cancel_button = async () => {
	stop_generating.classList.add(`stop_generating-hiding`);

	setTimeout(() => {
		stop_generating.classList.remove(`stop_generating-hiding`);
		stop_generating.classList.add(`stop_generating-hidden`);
	}, 300);
};

const ask_gpt = async (message) => {
	try {
		message_input.value = ``;
		message_input.innerHTML = ``;
		message_input.innerText = ``;

		add_conversation(window.conversation_id, message.substr(0, 20));
		window.scrollTo(0, 0);
		window.controller = new AbortController();

		prompt_lock = true;
		window.text = ``;
		window.token = message_id();

		stop_generating.classList.remove(`stop_generating-hidden`);

		message_box.innerHTML += `
            <div class="message">
                <div class="user">
                    ${user_image}
                    <i class="fa-regular fa-phone-arrow-up-right"></i>
                </div>
                <div class="content" id="user_${token}"> 
                    ${format(message)}
                </div>
            </div>
        `;
        
        document.querySelectorAll('code:not(p code):not(li code)').forEach((el) => {
		hljs.highlightElement(el);
		el.classList.add('processed');
        });

		message_box.scrollTo({
				top: message_box.scrollHeight,
				behavior: "smooth"
			});
		window.scrollTo(0, 0);
		await new Promise((r) => setTimeout(r, 500));
		window.scrollTo(0, 0);

		message_box.innerHTML += `
            <div class="message">
                <div class="user">
                    ${gpt_image} <i class="fa-regular fa-phone-arrow-down-left"></i>
                </div>
                <div class="content" id="gpt_${window.token}">
                    <div id="cursor"></div>
                </div>
            </div>
        `;

		message_box.scrollTo({
				top: message_box.scrollHeight,
				behavior: "smooth"
			});
		window.scrollTo(0, 0);
		await new Promise((r) => setTimeout(r, 1000));
		window.scrollTo(0, 0);
        
        messageHistory.push(message);

       const postData = {
       model: model,
       temperature: temperature,
       stream: true,
       messages: []
       }; 

       let isFirstMessage = true;

       for (const message of messageHistory) {
       postData.messages.push({ role: "user", content: message });

       if (isFirstMessage) {
       postData.messages.push({ role: "system", content: `${system_message}` });
       isFirstMessage = false;
         }
       } 
       

       const response = await fetch(API_URL, {
       signal: window.controller.signal,
       conversation_id: window.conversation_id,    
       method: "POST",   
       headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${strIndex}`
       },
       body: JSON.stringify(postData)
       })
		console.log('Connected API');
		// Read the response as a stream of data
		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");
      while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      // Massage and parse the chunk of data
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      const parsedLines = lines
        .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
        .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
        .map((line) => JSON.parse(line)); // Parse the JSON string

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        // Update the UI with the new content
        if (content) {
		text += content;
           }
        }
			document.getElementById(`gpt_${window.token}`).innerHTML =
				markdown.render(text);
			document.querySelectorAll('code:not(p code):not(li code)').forEach((el) => {
				hljs.highlightElement(el);
				el.classList.add('processed');
			});

			window.scrollTo(0, 0);
			message_box.scrollTo({
				top: message_box.scrollHeight,
				behavior: "auto"
			});
            
        }
        
        if (
      text.includes(
        `instead. Maintaining this website and API costs a lot of money`
      )
      ) {
      document.getElementById(`gpt_${window.token}`).innerHTML =
        "An error occured, please reload / refresh cache and try again.";
      }

		add_message(window.conversation_id, "user", message);
		add_message(window.conversation_id, "assistant", text);

		message_box.scrollTop = message_box.scrollHeight;
		await remove_cancel_button();
		prompt_lock = false;

		await load_conversations(20, 0);
		window.scrollTo(0, 0);
	} catch (e) {
		add_message(window.conversation_id, "user", message);

		message_box.scrollTop = message_box.scrollHeight;
		await remove_cancel_button();
		prompt_lock = false;

		await load_conversations(20, 0);
        
        console.log(e);

		let cursorDiv = document.getElementById(`cursor`);
		if (cursorDiv) cursorDiv.parentNode.removeChild(cursorDiv);
        
      if (e.name != `AbortError`) {
      let error_message = `Oops ! Something went wrong, please try again later. Check error in console.`;

      document.getElementById(`gpt_${window.token}`).innerHTML = error_message;
      add_message(window.conversation_id, "assistant", error_message);
    } else {
      document.getElementById(`gpt_${window.token}`).innerHTML += ` [aborted]`;
      add_message(window.conversation_id, "assistant", text + ` [aborted]`);
    }

    window.scrollTo(0, 0);
  }
};
const clear_conversations = async () => {
	const elements = box_conversations.childNodes;
	let index = elements.length;

	if (index > 0) {
		while (index--) {
			const element = elements[index];
			if (
				element.nodeType === Node.ELEMENT_NODE &&
				element.tagName.toLowerCase() !== `button`
			) {
				box_conversations.removeChild(element);
			}
		}
	}
};

const clear_conversation = async () => {
	let messages = message_box.getElementsByTagName(`div`);

	while (messages.length > 0) {
		message_box.removeChild(messages[0]);
	}
};

const show_option = async (conversation_id) => {
	const conv = document.getElementById(`conv-${conversation_id}`);
	const yes = document.getElementById(`yes-${conversation_id}`);
	const not = document.getElementById(`not-${conversation_id}`);

	conv.style.display = "none";
	yes.style.display = "block";
	not.style.display = "block";
}

const hide_option = async (conversation_id) => {
	const conv = document.getElementById(`conv-${conversation_id}`);
	const yes = document.getElementById(`yes-${conversation_id}`);
	const not = document.getElementById(`not-${conversation_id}`);

	conv.style.display = "block";
	yes.style.display = "none";
	not.style.display = "none";
}

const delete_conversation = async (conversation_id) => {
	localStorage.removeItem(`conversation:${conversation_id}`);

	const conversation = document.getElementById(`convo-${conversation_id}`);
	conversation.remove();

	if (window.conversation_id == conversation_id) {
		await new_conversation();
	}

	await load_conversations(20, 0, true);
};

const set_conversation = async (conversation_id) => {
	history.pushState({}, null, `${path}/${conversation_id}`);
	window.conversation_id = conversation_id;

	await clear_conversation();
	await load_conversation(conversation_id);
	await load_conversations(20, 0, true);
};

const new_conversation = async () => {
	history.pushState({}, null, `${path}/`);
	window.conversation_id = uuid();

	await clear_conversation();
	await load_conversations(20, 0, true);
};

const load_conversation = async (conversation_id) => {
	let conversation = await JSON.parse(
		localStorage.getItem(`conversation:${conversation_id}`)
	);
	console.log(conversation, conversation_id);

	for (item of conversation.items) {
		message_box.innerHTML += `
            <div class="message">
                <div class="user">
                    ${item.role == "assistant" ? gpt_image : user_image}
                    ${
                      item.role == "assistant"
                        ? `<i class="fa-regular fa-phone-arrow-down-left"></i>`
                        : `<i class="fa-regular fa-phone-arrow-up-right"></i>`
                    }
                </div>
                <div class="content">
                    ${
                      item.role == "assistant"
                        ? markdown.render(item.content)
                        : item.content
                    }
                </div>
            </div>
        `;
	}

	document.querySelectorAll('code:not(p code):not(li code)').forEach((el) => {
		hljs.highlightElement(el);
		el.classList.add('processed');
	});

	message_box.scrollTo({
		top: message_box.scrollHeight,
		behavior: "smooth"
	});

	setTimeout(() => {
		message_box.scrollTop = message_box.scrollHeight;
	}, 500);
};

const get_conversation = async (conversation_id) => {
	let conversation = await JSON.parse(
		localStorage.getItem(`conversation:${conversation_id}`)
	);
	return conversation.items;
};

const add_conversation = async (conversation_id, title) => {
	if (localStorage.getItem(`conversation:${conversation_id}`) == null) {
		localStorage.setItem(
			`conversation:${conversation_id}`,
			JSON.stringify({
				id: conversation_id,
				title: title,
				items: [],
			})
		);
	}
};

const add_message = async (conversation_id, role, content) => {
	before_adding = JSON.parse(
		localStorage.getItem(`conversation:${conversation_id}`)
	);

	before_adding.items.push({
		role: role,
		content: content,
	});

	localStorage.setItem(
		`conversation:${conversation_id}`,
		JSON.stringify(before_adding)
	); // update conversation
};

const load_conversations = async (limit, offset, loader) => {
	//console.log(loader);
	//if (loader === undefined) box_conversations.appendChild(spinner);

	let conversations = [];
	for (let i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).startsWith("conversation:")) {
			let conversation = localStorage.getItem(localStorage.key(i));
			conversations.push(JSON.parse(conversation));
		}
	}

	//if (loader === undefined) spinner.parentNode.removeChild(spinner)
	await clear_conversations();

	for (conversation of conversations) {
		box_conversations.innerHTML += `
    <div class="convo" id="convo-${conversation.id}">
      <div class="left" onclick="set_conversation('${conversation.id}')">
          <i class="fa-regular fa-comments"></i>
          <span class="convo-title">${conversation.title}</span>
      </div>
      <i onclick="show_option('${conversation.id}')" class="fa-regular fa-trash" id="conv-${conversation.id}"></i>
      <i onclick="delete_conversation('${conversation.id}')" class="fa-regular fa-check" id="yes-${conversation.id}" style="display:none;"></i>
      <i onclick="hide_option('${conversation.id}')" class="fa-regular fa-x" id="not-${conversation.id}" style="display:none;"></i>
    </div>
    `;
	}

	document.querySelectorAll('code:not(p code):not(li code)').forEach((el) => {
		hljs.highlightElement(el);
		el.classList.add('processed');
	});
};

document.getElementById(`cancelButton`).addEventListener(`click`, async () => {
	window.controller.abort();
	console.log(`aborted ${window.conversation_id}`);
});

function h2a(str1) {
	var hex = str1.toString();
	var str = "";

	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}

	return str;
}

const uuid = () => {
	return `xxxxxxxx-xxxx-4xxx-yxxx-${Date.now().toString(16)}`.replace(
		/[xy]/g,
		function(c) {
			var r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		}
	);
};

const message_id = () => {
	random_bytes = (Math.floor(Math.random() * 1338377565) + 2956589730).toString(
		2
	);
	unix = Math.floor(Date.now() / 1000).toString(2);

	return BigInt(`0b${unix}${random_bytes}`).toString();
};

window.onload = async () => {
	load_settings_localstorage();

	conversations = 0;
	for (let i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).startsWith("conversation:")) {
			conversations += 1;
		}
	}

	if (conversations == 0) localStorage.clear();

	await setTimeout(() => {
		load_conversations(20, 0);
	}, 1);

	message_input.addEventListener(`keydown`, async (evt) => {
		if (prompt_lock) return;
		if (evt.keyCode === 13 && !evt.shiftKey) {
			evt.preventDefault();
			console.log('pressed enter');
			await handle_ask();
		} else {
			message_input.style.removeProperty("height");
			message_input.style.height = message_input.scrollHeight + 4 + "px";
		}
	});

	send_button.addEventListener(`click`, async () => {
		console.log("clicked send");
		if (prompt_lock) return;
		await handle_ask();
	});

	register_settings_localstorage();
};

document.querySelector(".mobile-sidebar").addEventListener("click", (event) => {
	const sidebar = document.querySelector(".conversations");

	if (sidebar.classList.contains("shown")) {
		sidebar.classList.remove("shown");
		event.target.classList.remove("rotated");
	} else {
		sidebar.classList.add("shown");
		event.target.classList.add("rotated");
	}

	window.scrollTo(0, 0);
});

const register_settings_localstorage = async () => {
	settings_ids = ["model", "temperature"];
	settings_elements = settings_ids.map((id) => document.getElementById(id));
	settings_elements.map((element) =>
		element.addEventListener(`change`, async (event) => {
			switch (event.target.type) {
				case "checkbox":
					localStorage.setItem(event.target.id, event.target.checked);
					break;
				case "select-one":
					localStorage.setItem(event.target.id, event.target.selectedIndex);
					break;
				default:
					console.warn("Unresolved element type");
			}
		})
	);
};

const load_settings_localstorage = async () => {
	settings_ids = ["model", "temperature"];
	settings_elements = settings_ids.map((id) => document.getElementById(id));
	settings_elements.map((element) => {
		if (localStorage.getItem(element.id)) {
			switch (element.type) {
				case "checkbox":
					element.checked = localStorage.getItem(element.id) === "true";
					break;
				case "select-one":
					element.selectedIndex = parseInt(localStorage.getItem(element.id));
					break;
				default:
					console.warn("Unresolved element type");
			}
		}
	});
};

function toggleTheme() {
  var element = document.documentElement;
  element.classList.toggle("dark");
  var sunIcon = document.getElementById("sun-icon");
  var moonIcon = document.getElementById("moon-icon");

  if (element.classList.contains("dark")) {
    sunIcon.style.display = "none";
    moonIcon.style.display = "inline-block";
    var oldlink = document.getElementsByTagName("link").item(1);
    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", "assets/css/dracula.min.css");
    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
    localStorage.setItem("theme", "dark"); // Save theme state as "dark"
  } else {
    sunIcon.style.display = "inline-block";
    moonIcon.style.display = "none";
    var oldlink = document.getElementsByTagName("link").item(1);
    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", "assets/css/googlecode.min.css");
    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
    localStorage.setItem("theme", "light"); // Save theme state as "light"
  }
}

// Set the initial theme
var theme = localStorage.getItem("theme");
if (theme === "dark") {
  toggleTheme();
}
