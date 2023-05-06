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