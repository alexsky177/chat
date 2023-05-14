Version ChatGPT 3.5 turbo

Need PHP version 7 or 8.

1) Download and unzip arhiv. 
2) Upload to web server via ftp client.
3) Change open AI API key in file "chat.php". 
 
   $chat = new ChatGPT([
   'api_key' => 'Your open ai api key ',
]);

If you want change text on the splash screen at first startup (it is shown to the user only once):

3) go to path static/js/pref.js,
4) change text in lines 57-61.


Go to index.html by browser and enjoy.


Used frontpage html and css from this project
https://github.com/xtekky/chatgpt-clone


Used php classes from this project
https://github.com/qiayue/php-openai-gpt-stream-chat-api-webui


Work same as python version xtekky, but no have 1 function (web search)

Button web search changed to Light or Dark theme.

You can see interface on screenshots files:

<img src="https://github.com/alexsky177/chatgpt/blob/main/screen_light.jpg?raw=true" alt="chatgpt php"/>
<img src="https://github.com/alexsky177/chatgpt/blob/main/screen_dark.jpg?raw=true" alt="chatgpt php"/>
