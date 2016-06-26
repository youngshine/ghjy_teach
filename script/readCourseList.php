<?php
// 读取教师授课的课时表course
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
	$query = "SELECT a.*,c.zsdName,c.zsdID,c.PDF,d.subjectName,d.subjectID, e.studentName,e.studentID,e.level_list      
		from `ghjy_teacher_course` a 
		JOIN `ghjy_student-study` b On a.studentstudyID=b.studentstudyID 
		JOIN `ghjy_zsd` c On (b.zsdID=c.zsdID And b.subjectID=c.subjectID) 
		JOIN `ghjy_subject` d On c.subjectID=d.subjectID 
		JOIN `ghjy_student` e On b.studentID=e.studentID 
		Where b.teacherID = '$teacherID' And b.pass=0  
		Group By a.created Desc";
    
    $result = mysql_query($query)or die("Invalid query: readCourseList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取课时表course成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>