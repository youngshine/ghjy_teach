<?php
/** 2016-3-13
 * 随机抓取一个低难度1的考题，没有数据表，前端临时保存
 * 考题采用客观选择题目objective_flag, objective_answer
 * 考题，不能和练习题一样
 * 如何随机select以免重复?? 偏移量offset
*/
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;
	// 题目按3个科目分3个表，题目对应知识点多个list zsd in(list)
	$zsdID = $arr->zsdID;
	$subjectID = $arr->subjectID;
	$level = $arr->level;
	$studentstudyID = $arr->studentstudyID;
	
	if($subjectID==1){
		$table = 'sx_xiaochu_exam_question';
	}elseif($subjectID==2){
		$table = 'wl_chu_exam_question';
	}else{
		$table = 'hx_chu_exam_question';
	} 
	 
	// 该学生的该知识点的已经练习题目不能再出现 gid not in ($zsdID in (zsdID_list))
	$query = "SELECT * from `$table` 
		Where zsdID_list=$zsdID And level=$level And objective_flag=1 
		ORDER BY rand() 
		LIMIT 1";
    $result = mysql_query($query) 
		or die("Invalid query: readTopicList by one" . mysql_error());
	$row = mysql_fetch_array($result) 
		or die("Invalid query: readTopictest2" . mysql_error());
	//print_r($row);
	$query_array = array();
	$query_array[0] = $row;
	//$query_array = $row;
	
	$res->success = true;
	$res->message = "随机？？抓取一个对应考题 order by rand()";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>