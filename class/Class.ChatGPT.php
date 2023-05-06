<?php

class ChatGPT {

    private $api_url = 'https://api.openai.com/v1/chat/completions';
	private $api_key = '';
	private $streamHandler;
	private $question;
    private $dfa = NULL;
    private $check_sensitive = FALSE;

	public function __construct($params) {
        $this->api_key = $params['api_key'] ?? '';
    }

    public function set_dfa(&$dfa){
        $this->dfa = $dfa;
        if(!empty($this->dfa) && $this->dfa->is_available()){
            $this->check_sensitive = TRUE;
        }
    }

    public function qa($params){
        $this->question = $params['question'];
        $this->streamHandler = new StreamHandler([
            'qmd5' => md5($this->question.''.time())
        ]);
        if($this->check_sensitive){
            $this->streamHandler->set_dfa($this->dfa);
        }


        if(empty($this->api_key)){
            $this->streamHandler->end('Api key не задан');
            return;
        }


        // Enabling banned word detection
        if($this->check_sensitive && $this->dfa->containsSensitiveWords($this->question)){
            $this->streamHandler->end('Your question is invalid，AI is tunable to answer');
            return;
        }

    	$messages = [
    	    [
    	        'role' => 'system',
    	        'content' => $params['system'] ?? '',
    	    ],
    	    [
    	        'role' => 'user',
    	        'content' => $this->question
    	    ]
    	];
		
        $model = isset($_POST['model']) ? $_POST['model'] : 'gpt-3.5-turbo';
        $temperature = isset($_POST['temperature']) ? $_POST['temperature'] : 0.6;

        $json = json_encode([
       'model' => $model,
       'messages' => $messages,
       'temperature' => $temperature,
       'stream' => true,
    ]);

    	$headers = array(
    	    "Content-Type: application/json",
    	    "Authorization: Bearer ".$this->api_key,
    	);

    	$this->openai($json, $headers);

    }

    private function openai($json, $headers){
    	$ch = curl_init();

    	curl_setopt($ch, CURLOPT_URL, $this->api_url);
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    	curl_setopt($ch, CURLOPT_HEADER, false);
    	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    	curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    	curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
    	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    	curl_setopt($ch, CURLOPT_WRITEFUNCTION, [$this->streamHandler, 'callback']);

    	$response = curl_exec($ch);

    	if (curl_errno($ch)) {
    	    file_put_contents('./log/curl.error.log', curl_error($ch).PHP_EOL.PHP_EOL, FILE_APPEND);
    	}

    	curl_close($ch);
    }

}

