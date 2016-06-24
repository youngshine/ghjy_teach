<?php
// 教师下面某个学生的正在报读知识点
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	$teacherID = $arr->teacherID;
	$studentID = $arr->studentID;
	
	$query = "SELECT a.studentstudyID,b.zsdName  
		From `ghjy_student-study` a 
		JOIN `ghjy_zsd` b On (a.zsdID=b.zsdID And a.subjectID=b.subjectID) 
		Where a.teacherID = '$teacherID' And a.studentID=$studentID And 
			a.pass=0";
    
    $result = mysql_query($query) 
		or die("Invalid query: readZsdList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取学生的知识点zsd成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>