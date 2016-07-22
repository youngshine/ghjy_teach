<?php
/* 
 * 删除当天上课课时 course
 * 有练习题目或上传图片?记录，应该不能删除
 */

	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');

    $courseID = $_REQUEST['courseID'];
	
	$sql = "SELECT 1 FROM `ghjy_topic-teach` Where courseID = $courseID";
	$result = mysql_query($sql);
	
	if(mysql_num_rows($result) > 0){
	    echo json_encode(array(
	        "success" => false,
	        "message" => "已经做题，不能删除"
	    ));
	}else{	
		$query = "DELETE FROM `ghjy_teacher_course` Where courseID=$courseID ";
	    $result = mysql_query($query) 
	        or die("Invalid query: deleteCourse" . mysql_error());

		echo json_encode(array(
	        "success" => true,
	        "message" => "删除成功"
	    ));
	}
	
	// select 1 from ghjy_topic-teach or ghjy_student-study-photo？？
  
?>
