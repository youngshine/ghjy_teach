

<?php
/*log
*16-03-09 学生某个知识点通过学习 studentstudy，可以解除通过？
endlog */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

    $arr = $req->params;
	$pass = $arr->pass;
	$studentstudyID = $arr->studentstudyID;
	$now = date('ymd');

	$query = "update `ghjy_student-study` set pass = $pass,pass_date = '$now'  
		where studentstudyID = $studentstudyID ";
	$result = mysql_query($query) 
		or die("Invalid query: updateStudentstudy " . mysql_error());
	$res->success = true;
	$res->message = "学生报读知识点studentstudy学习通过成功";
	$res->data = array();
	
echo $_GET['callback']."(".$res->to_json().")";
?>
