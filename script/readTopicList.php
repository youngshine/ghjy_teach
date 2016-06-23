<?php
// 从topic题库读取当堂知识点课某个学生的自适应level练习题，批量加入topic-teach表，加上学生字段
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;
	
	$zsdID = $arr->zsdID;
	$level = $arr->level;

	$query = " select * from `ghjy_topic` 
		where zsdID=$zsdID and level=$level ";
    
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