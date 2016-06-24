<?php

// 某个老师上课的某个particular知识点的学生列表，有的通过学习
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();
	
	$arr = $req->params;
	$teacherID = $arr->teacherID;
	//group by student+zsd?，一个学生可以报读同样知识点？？
	$query = "SELECT a.studentstudyID,a.subjectID,a.zsdID,a.pass,
		b.studentName,b.studentID,b.level_list   
		From `ghjy_student-study` a 
		Join `ghjy_student` b on a.studentID=b.studentID 
		Where a.teacherID=$teacherID 
		Group By a.studentID ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readStudentList by subjectID+zsdID" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取某个教师的学生列表student成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>