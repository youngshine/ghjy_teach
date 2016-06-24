<?php
/* 
 * 删除
 */

	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Access-Control-Allow-Origin: *'); // 跨域问题
	//header('Access-Control-Allow-Headers: X-Requested-With');

	require_once('db/database_connection.php');


    $teacherID = $_REQUEST['teacherID'];
	$psw1 = addslashes($_REQUEST['psw1']);
    
    //删除试卷图片吗？
    //$query = "delete from exam where exam_id = $examID ";
    // 不真正删除，作废
	$query = "UPDATE `ghjy_teacher` SET psw='$psw1' where teacherID=$teacherID ";
    $result = mysql_query($query) 
        or die("Invalid query: updatePassword" . mysql_error());
    
    echo json_encode(array(
        "success" => true,
        "message" => "密码设置成功"
    ));
  
?>
