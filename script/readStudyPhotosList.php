<?php
// 读取教师授课的知识点,group by
// 新题目库，知识点分3个表，在数据库后端合并成zsd，索引subjectID+zsdID唯一
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$arr = $req->params;

	$studentstudyID = $arr->studentstudyID;
	$sql = "SELECT * From `ghjy_student-study-photos` 
		Where studentstudyID=$studentstudyID Order By created Desc ";
    
    $result = mysql_query($sql) 
		or die("Invalid query: readStudyPhotosList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取当堂课某个学生的教学图片studentstudyphotos成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>