<h1>ChatGPT - JavaScript clone</h1>
<blockquote><p>Version ChatGPT 3.5 turbo, 3.5 turbo 0301.<br>
 <em>Version GPT 4 has not been tested yet.</em></p></blockquote>
<img src="https://github.com/alexsky177/chatgpt/blob/main/screen_dark.png?raw=true" alt="chatgpt"/>
<p>&#10149; Download ZIP or use git command.</p> 
<p>&#10149; Get your OpenAi key - https://platform.openai.com/account/api-keys</p>
<p>&#10149; Open config.js and fill  <code>const strIndex = "YOUR_API_KEY";</code></p>
<p>&#10149; If you want to change path - <code>const path = "/chat";</code> - change it. For root use <code>const path = "";</code></p>
<p>&#10149; <code>// const root = ".";</code>  This parameter need if you use app in the root or localhost - delete slashes.</p>
<p>&#10149; Make path <code>/chat</code> or any other on your web server.</p>
<p>&#10149; Upload files to this directory.</p>
<p>&#10149; Type in the browser your address <code>https://your-website.com/chat/</code> and enjoy.</p>
<p>&#10149; Also you can use Obfuscator to hide your api key for security reason.<br>
https://codebeautify.org/javascript-obfuscator</p>
<p>Used frontpage html, js and css from this project (with some mods)<br>
https://github.com/xtekky/chatgpt-clone</p>
<p>Used Javascript Openai api request<br>
https://www.builder.io/blog/stream-ai-javascript</p>
<p>All functions are preserved, except for the web search - instead, a change in theme from dark to light has been made. Added temperature change function. Added context. So GPT remember your last 5 questions.</p>
<h2>Run on localhost</h2>
<p>This program runs on a laptop or desktop computer locally from a folder.</p>
<h3>How to install localhost</h3>
<p>Read this stackoverflow solution<br>
https://stackoverflow.com/questions/38497334/how-to-run-html-file-on-localhost</p>
<p>You can use Node.js or Python server.</p>
<p>How to install app on Pyton:</p>
<ol>
<li>Install Pyton - https://www.python.org</li>
<li>Сreate a directory <code>chat</code>.</li>
 <li>Change const path in config.js to <code>path = "";</code>.</li>
 <li>Change const root in config.js to <code>root = ".";</code> ( just delete <code>//</code>).</li>
<li>Put index.html and assets files here.</li>
</ol>
<div>
On the Windows command line or in the Mac terminal, type <pre><code>cd chat</code></pre> then<pre><code>python -m http.server</code></pre></div>
<ul>
 <li> Open in browser <code>http://192.168.1.52:8000/</code></li>
 <li> Also you can use <code>http://127.0.0.1:8000/</code></li>
 <li>Or this address <code>http:/localhost:8000/</code></li>
 </ul>
<p> Use app on your local computer.</p>
<img src="https://github.com/alexsky177/chatgpt/blob/main/screen_light.png?raw=true" alt="chatgpt"/>
<p><em>Last update - added convertations.<br> 
Removed all php files.<br>
Changed path for assets files.</em></p>
