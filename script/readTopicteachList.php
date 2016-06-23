<?php
// 当前学生报读知识点的教学题目（与考试题目paired)，删除的curent=0不算
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;
	
	//$studentID = $arr->studentID;
	//$zsdID = $arr->zsdID;
	$studentstudyID = $arr->studentstudyID; //学生报读知识点：student+zsd
	$subjectID = $arr->subjectID; // 题目按学科分3个表
	
	if($subjectID==1){
		$table = 'sx_xiaochu_exam_question';
	}elseif($subjectID==2){
		$table = 'wl_chu_exam_question';
	}else{
		$table = 'hx_chu_exam_question';
	} 

	$query = " SELECT a.*,b.level,b.content,b.answer 
		FROM `ghjy_topic-teach` a 
		JOIN `$table` b on a.gid=b.gid 
		WHERE a.studentstudyID=$studentstudyID And a.current=1  
		ORDER BY a.created ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readTopicteachList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取当堂课教学练习题topic-teach成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>