<?php

// 加盟学校
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

	$query = " select * from `ghjy_school` ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readSchoolList" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取加盟校区school成功";
	$res->data = $query_array;


echo $_GET['callback']."(".$res->to_json().")";
?>