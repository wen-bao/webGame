<?php
//	
	//echo "I'm php!\n";
	if(!isset($_POST["user"]) && !isset($_POST["score"]) && !isset($_POST["ballnum"])) {
		//echo "null";
		include "404.php";
		return;
	}
	$user = $_POST["user"];
	$score = $_POST["score"];
	$ballnum = $_POST["ballnum"];
    $newdata = array("user"=>$user, "score"=>$score, "ballnum"=>$ballnum);

	$jsonstr = file_get_contents("hero.json");
	$data = json_decode($jsonstr, true);
	array_push($data, $newdata);
	
	$data = my_sort($data, 'score', SORT_DESC, SORT_NUMERIC);
	//$data = arr_uniq($data,'user');

	while(1) {
		$len = count($data);

		if($len > 100) {
			array_pop($data);
		} else {
			break;
		}
	}

	
//	var_dump($data);
	
	$jsonstr = json_encode($data);
    if($jsonstr != "false") file_put_contents("hero.json", $jsonstr);
    
 	//echo print_r($data);
 	//echo $data[0]->user;
 	

function my_sort($arrays,$sort_key,$sort_order=SORT_ASC,$sort_type=SORT_NUMERIC ){  
    if(is_array($arrays)){  
        foreach ($arrays as $array){  
            if(is_array($array)){  
                $key_arrays[] = $array[$sort_key];  
            }else{  
                return false;  
            }  
        }  
    }else{  
        return false;  
    } 
    array_multisort($key_arrays,$sort_order,$sort_type,$arrays);  
    return $arrays;  
} 
    
function arr_uniq($arr,$key) {
    $key_arr = [];
    foreach ($arr as $k => $v) {
        if (in_array($v[$key],$key_arr)) {
            unset($arr[$k]);
        } else {
            $key_arr[] = $v[$key];
        }
    }
    sort($arr);
    return $arr;
}
