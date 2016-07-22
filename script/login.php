<?php 

header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$username = $_REQUEST['username'];
$psw = $_REQUEST['psw'];
$school = $_REQUEST['school'];

$query = "SELECT a.teacherID,a.teacherName,b.schoolName 
	From `ghjy_teacher` a 
    Join `ghjy_school` b On a.schoolID=b.schoolID  
	Where a.teacherName = '$username' And a.psw = '$psw' And b.schoolName='$school' ";
	
$result = mysql_query($query);
	//if(!$result)
		//ErrorOutput();
if(mysql_num_rows($result)>0){
	$row = mysql_fetch_assoc($result); 
    echo json_encode(array(
        "success" => true,
        "message" => "登录成功",
		"data"    => $row
    ));
}else{
    echo json_encode(array(
        "success" => false,
        "message" => "登录信息错误",
    ));
}


?>