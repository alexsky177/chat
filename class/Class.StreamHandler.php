<?php

class StreamHandler {

    private $data_buffer;//Caching, there is a possibility that a data is cut into two parts, can not parse the json, so you need to cache the upper half
    private $counter;//Data reception counter
    private $qmd5;//Issue md5
    private $chars;//Array of characters, used to cache characters to be detected when sensitive word detection is enabled
    private $punctuation;//Pause symbol
    private $dfa = NULL;
    private $check_sensitive = FALSE;

    public function __construct($params) {
        $this->buffer = '';
        $this->counter = 0;
        $this->qmd5 = $params['qmd5'] ?? time();
        $this->chars = [];
        $this->lines = [];
        $this->punctuation = ['，', '。', '；', '？', '！', '……'];
    }

    public function set_dfa(&$dfa){
        $this->dfa = $dfa;
        if(!empty($this->dfa) && $this->dfa->is_available()){
            $this->check_sensitive = TRUE;
        }
    }

    public function callback($ch, $data) {
        $this->counter += 1;
        file_put_contents('./log/data.'.$this->qmd5.'.log', $this->counter.'=='.$data.PHP_EOL.'--------------------'.PHP_EOL, FILE_APPEND);

        $result = json_decode($data, TRUE);
        if(is_array($result)){
        	$this->end('openai bad request：'.json_encode($result));
        	return strlen($data);
        }

        /*
            This step is only for the openai interface
            Each time the callback function is triggered, there will be multiple pieces of data in it, which need to be split
            If $data is received at a certain time, it looks like this：
           {"id":"chatcmpl-6wimHHBt4hKFHEpFnNT2ryUeuRRJC","object":"chat.completion.chunk","created":1679453169,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"role":"assistant"},"index":0,"finish_reason":null}]}\n\ndata: 
           {"id":"chatcmpl-6wimHHBt4hKFHEpFnNT2ryUeuRRJC","object":"chat.completion.chunk","created":1679453169,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"follow"},"index":0,"finish_reason":null}]}\n\ndata: 
           {"id":"chatcmpl-6wimHHBt4hKFHEpFnNT2ryUeuRRJC","object":"chat.completion.chunk","created":1679453169,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"Yes"},"index":0,"finish_reason":null}]}\n\ndata: 
           {"id":"chatcmpl-6wimHHBt4hKFHEpFnNT2ryUeuRRJC","object":"chat.completion.chunk","created":1679453169,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"Use"},"index":0,"finish_reason":null}]}
            The last two are generally like this：
            data: {"id":"chatcmpl-6wimHHBt4hKFHEpFnNT2ryUeuRRJC","object":"chat.completion.chunk","created":1679453169,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{},"index":0,"finish_reason":"stop"}]}\n\ndata: [DONE]

            According to the above data format of openai, the segmentation steps are as follows：
        */

        // 0、Splice the data in the last buffer with the current data
        $buffer = $this->data_buffer.$data;
        
        //After stitching, clear the buffered string
        $this->data_buffer = '';

        // 1、Replace all 'data: {' with '{' and 'data: [' with '['
        $buffer = str_replace('data: {', '{', $buffer);
        $buffer = str_replace('data: [', '[', $buffer);

        // 2、Replace all '}\n\n{' with '}[br]{', '}\n\n[' with '}[br]['
        $buffer = str_replace("}\n\n{", '}[br]{', $buffer);
        $buffer = str_replace("}\n\n[", '}[br][', $buffer);

        // 3、Splitting into multi-line arrays with '[br]'
        $lines = explode('[br]', $buffer);

        // 4、Loop through each line and determine if the last line is a complete json
        $line_c = count($lines);
        foreach($lines as $li=>$line){
            if(trim($line) == '[DONE]'){
                //End of data transfer
                $this->data_buffer = '';
                $this->counter = 0;
                $this->sensitive_check();
                $this->end();
                break;
            }
            $line_data = json_decode(trim($line), TRUE);
            if( !is_array($line_data) || !isset($line_data['choices']) || !isset($line_data['choices'][0]) ){
                if($li == ($line_c - 1)){
                    //If it is the last line
                    $this->data_buffer = $line;
                    break;
                }
                //If it is an intermediate line that cannot be parsed by json, it is written to the error log
                file_put_contents('./log/error.'.$this->qmd5.'.log', json_encode(['i'=>$this->counter, 'line'=>$line, 'li'=>$li], JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT).PHP_EOL.PHP_EOL, FILE_APPEND);
                continue;
            }

            if( isset($line_data['choices'][0]['delta']) && isset($line_data['choices'][0]['delta']['content']) ){
            	$this->sensitive_check($line_data['choices'][0]['delta']['content']);
            }
        }

        return strlen($data);
    }

    private function sensitive_check($content = NULL){
        // If no sensitive words are detected, they are returned directly to the front-end
        if(!$this->check_sensitive){
            $this->write($content);
            return;
        }
    	//Each content is checked to see if it contains a newline or a stop sign, and if so, it becomes a newline
        if(!$this->has_pause($content)){
            $this->chars[] = $content;
            return;
        }
        $this->chars[] = $content;
        $content = implode('', $this->chars);
        if($this->dfa->containsSensitiveWords($content)){
            $content = $this->dfa->replaceWords($content);
            $this->write($content);
        }else{
            foreach($this->chars as $char){
                $this->write($char);
            }
        }
        $this->chars = [];
    }

    private function has_pause($content){
        if($content == NULL){
            return TRUE;
        }
        $has_p = false;
        if(is_numeric(strripos(json_encode($content), '\n'))){
            $has_p = true;
        }else{
            foreach($this->punctuation as $p){
                if( is_numeric(strripos($content, $p)) ){
                    $has_p = true;
                    break;
                }
            }
        }
        return $has_p;
    }

    private function write($content = NULL, $flush=TRUE){
        if($content != NULL){
            echo 'data: '.json_encode(['time'=>date('Y-m-d H:i:s'), 'content'=>$content], JSON_UNESCAPED_UNICODE).PHP_EOL.PHP_EOL;
        }        

        if($flush){
            flush();
        }
    }

    public function end($content = NULL){
        if(!empty($content)){
            $this->write($content, FALSE);
        }

    	echo 'retry: 86400000'.PHP_EOL;
    	echo 'event: close'.PHP_EOL;
    	echo 'data: Connection closed'.PHP_EOL.PHP_EOL;
    	flush();

    }
}
