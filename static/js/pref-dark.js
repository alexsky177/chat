   document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13 || event.which === 13) {
    document.getElementById('send').click();
  }
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

document.getElementById('switch-light').addEventListener('change', function() {
  if (this.checked) {
    window.location.href = './';
  }
});

