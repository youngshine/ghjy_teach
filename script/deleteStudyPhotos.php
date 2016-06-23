<?php
/* 
 * 删除教学图片
 */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

    $arr = $req->params;
	$studyphotoID = $arr->studyphotoID;
	$query = "DELETE from `ghjy_student-study-photos` 
		where studyphotoID = $studyphotoID ";
	$result = mysql_query($query) 
		or die("Invalid query: deleteStudyPhotos" . mysql_error());
	$res->success = true;
    $res->message = "删除教学上传照片student-study-photos成功";
	$res->data = array();
	
echo $_GET['callback']."(".$res->to_json().")";
?>
