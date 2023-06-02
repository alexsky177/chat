<h1>ChatGPT - JavaScript clone</h1>
<hr>
<blockquote><p>Version ChatGPT 3.5 turbo, 3.5 turbo 0301.<br>
 <em>Version GPT 4 has not been tested yet.</em></p></blockquote>

1) Download and unzip arhiv. 
3) Put your OpenAI AI API key in file "assets/js/chat.js" - line 10. 
 
const strIndex = "YOUR_API_KEY";

Also you can use Obfuscator to hide your api key for security reason.
https://codebeautify.org/javascript-obfuscator#

5) Make path /chat on your web server.
6) Upload files to this directory.
7) Go to index.html by browser and enjoy.


Used frontpage html, js and css from this project (with some mods)
https://github.com/xtekky/chatgpt-clone

Used Javascript Openai api request
https://github.com/gopinav/ai/tree/main/examples/javascript-vanilla

Work same as python version xtekky, but no have functions web search and dev and other mods.

Button web search changed to Light or Dark theme.

You can run this app local on your home or job computer.
How to install localhost:
https://stackoverflow.com/questions/38497334/how-to-run-html-file-on-localhost
1) Install Pyton. https://www.python.org/
2) Make directory /chat
3) Put index.html and assets files here.
4) On Windows command line `cd chat`, then `python3 -m http.server`.
5) Open your browser http://localhost:8000
6) Use program on your local computer.

You can see interface on screenshots files:

<img src="https://github.com/alexsky177/chatgpt/blob/main/screen_light.png?raw=true" alt="chatgpt"/>
<img src="https://github.com/alexsky177/chatgpt/blob/main/screen_dark.png?raw=true" alt="chatgpt"/>

Last update - added converation. 
Removed all php files.
Changes path for assets files.
