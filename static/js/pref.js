 document.addEventListener('keydown', function(event) { 
if ((event.keyCode === 13 || event.which === 13) && !event.shiftKey) 
{ document.getElementById('send').click(); event.preventDefault(); } 
});

let scrolling = false;

const div = document.getElementById('messages');
div.addEventListener('DOMNodeInserted', () => {
  if (!scrolling) {
    scrolling = true;
    setTimeout(() => {
      div.scrollTo({ top: div.scrollHeight, behavior: 'smooth' });
      scrolling = false;
    }, 500);
  }
});

function cleanDynamicDiv() {
  var dynamicDiv = document.getElementById("messages");
  dynamicDiv.innerHTML = "";
}
document.querySelector(".mobile-sidebar").addEventListener("click", (event) => {
  const sidebar = document.querySelector(".conversations");

  if (sidebar.classList.contains("shown")) {
    sidebar.classList.remove("shown");
    event.target.classList.remove("rotated");
  } else {
    sidebar.classList.add("shown");
    event.target.classList.add("rotated");
  }
});

var myDiv = document.getElementById("pR");
myDiv.addEventListener("click", function() {
  location.reload();
});

var toggleSwitch = document.getElementById("toggle-switch");
  toggleSwitch.addEventListener("change", function() { 
  if (toggleSwitch.checked) { 
    document.getElementById("dark").checked = true;
    var oldlink = document.getElementsByTagName("link").item(1);
    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", "static/css/dracula.min.css");
    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
  } else { 
    document.getElementById("light").checked = true;
    var oldlink = document.getElementsByTagName("link").item(1);
    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", "static/css/googlecode.min.css");
    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
  } 
});

if (localStorage.getItem('isFunctionCalled') === 'true') {
  console.log('Function Called');
} else {
  console.log('Call Function');
		window.onload = function() {
  var div = document.getElementById("messages");
  div.innerHTML = `<div style="margin: auto; width: 50%; align-items: center;"><div class="user">
                <img src="static/img/opnai.png" style="display: block; max-width: 100%;"><p>&nbsp;</p>
		</div>
                <div class="content"> 
                    <p><b>Hi!</b></p>
		    <p>&nbsp;</p>
		    <p>I am OpenAI ChatGPT bot.</p>
		    <p>&nbsp;</p>
		    <p>Happy to answer your questions.</p>
                </div></div>`;
  setTimeout(function() {
    div.innerHTML = "";
  }, 3000);
}
  localStorage.setItem('isFunctionCalled', 'true');
}
