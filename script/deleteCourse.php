<?php
/* 
 * 删除当天上课课时 course
 */

	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

    $courseID = $_REQUEST['courseID'];

	$query = "DELETE FROM `ghjy_teacher_course` Where courseID=$courseID ";
    $result = mysql_query($query) 
        or die("Invalid query: deleteCourse" . mysql_error());
    
    echo json_encode(array(
        "success" => true,
        "message" => "删除当天上课课时成功"
    ));
  
?>
