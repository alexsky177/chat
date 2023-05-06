const send = document.getElementById("message-input");

input.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendMessage();
    }
});
  const div = document.querySelector('#messages');
  div.addEventListener('DOMNodeInserted', () => {
  div.scrollTo({ top: div.scrollHeight, behavior: 'smooth' });
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

  window.scrollTo(0, 0);
});
