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
            $this->streamHandler->end('The OpenAI API key has not been filled in yet');
            return;
        }


        // Activate detection and ask if the question contains sensitive words
        if($this->check_sensitive && $this->dfa->containsSensitiveWords($this->question)){
            $this->streamHandler->end('Your question is not appropriate, AI is unable to answer at the moment');
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

    	$json = json_encode([
    	    'model' => 'gpt-3.5-turbo',
    	    'messages' => $messages,
    	    'temperature' => 0.6,
	    'frequency_penalty' => 0,
	    'presence_penalty' => 0,
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
