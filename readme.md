<h1>ChatGPT - JavaScript clone</h1>
<blockquote><p>Version ChatGPT 3.5 turbo, 3.5 turbo 0301.<br>
 <em>Version GPT 4 has not been tested yet.</em></p></blockquote>
<img src="https://github.com/alexsky177/chatgpt/blob/main/screen_dark.png?raw=true" alt="chatgpt"/>
<p>&#10149; Download ZIP or use git command.</p> 
<p>&#10149; Get your OpenAi key - https://platform.openai.com/account/api-keys</p>
<p>&#10149; Put your OpenAI AI API key in file <code>assets/js/chat.js</code> - line 10 <code>const strIndex = "YOUR_API_KEY";</code></p>
<p>&#10149; Make path <code>/chat</code> on your web server.</p>
<p>&#10149; Upload files to this directory.</p>
<p>&#10149; Type in the browser your address <code>https://your-website.com/chat/</code> and enjoy.</p>
<p>&#9733; If you want run this script from another path (not chat) - change <code>chat</code> to your path in line 302, 311, 485 chat.js file.</p>
<p>Also you can use Obfuscator to hide your api key for security reason.<br>
https://codebeautify.org/javascript-obfuscator</p>
<p>Used frontpage html, js and css from this project (with some mods)<br>
https://github.com/xtekky/chatgpt-clone</p>
<p>Used Javascript Openai api request<br>
https://www.builder.io/blog/stream-ai-javascript</p>
<p>All functions are preserved, except for the web search - instead, a change in theme from dark to light has been made. Added temperature change function.</p>
<h2>Run on localhost</h2>
<p>This program runs on a laptop or desktop computer locally from a folder.</p>
<h3>How to install localhost</h3>
<p>Read this stackoverflow solution<br>
https://stackoverflow.com/questions/38497334/how-to-run-html-file-on-localhost</p>
<ol>
<li>Install Pyton - https://www.python.org</li>
<li>Сreate a directory <code>chat</code></li>
<li>Put index.html and assets files here</li>
</ol>
<div>
On the Windows command line or in the Mac terminal, type <pre><code>cd chat</code></pre> then<pre><code>python3 -m http.server</code></pre></div>
<ul>
 <li> Open in browser <code>http://localhost:8000</code></li>
 </ul>
<p> Use app on your local computer.</p>
<img src="https://github.com/alexsky177/chatgpt/blob/main/screen_light.png?raw=true" alt="chatgpt"/>
<p><em>Last update - added convertations.<br> 
Removed all php files.<br>
Changed path for assets files.</em></p>
