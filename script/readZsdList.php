<?php
// 读取教师授课的知识点,group by
// 新题目库，知识点分3个表，在数据库后端合并成zsd，索引subjectID+zsdID唯一
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	$teacherID = $arr->teacherID;
	
	// 创建临时表（自动清除？），合并知识点（表中zsdID+subjectID才唯一）
	/*
	$sql = "CREATE TEMPORARY TABLE temp_zsd   
		SELECT * FROM `ghjy_zsd-sx` Union 
		SELECT * FROM `ghjy_zsd-wl` Union
		SELECT * FROM `ghjy_zsd-hx`";   
	$result = mysql_query($sql); 
	*/
	$query = "SELECT a.*,b.zsdName,c.subjectName,d.gradeName  
		from `ghjy_student-study` a 
		JOIN `ghjy_zsd` b on (a.zsdID=b.zsdID and a.subjectID=b.subjectID) 
		JOIN `ghjy_subject` c On b.subjectID=c.subjectID 
		JOIN `ghjy_grade` d On b.gradeID=d.gradeID 
		Where a.teacherID = '$teacherID' 
		Group By a.subjectID,a.zsdID ";
    
    $result = mysql_query($query)or die("Invalid query: readZsdList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取当堂课教学知识点zsd成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>