<?php
/* 
 * 删除选择到不合适的教学题目
 * 不要真正删除，否则＋添加题目时候，可能删除过的题目会再出现	
 */
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

    $arr = $req->params;
	$topicteachID = $arr->topicteachID;
	//$query = "delete from `ghjy_topic-teach` where topicteachID = $topicteachID ";
	$query = "UPDATE `ghjy_topic-teach` Set current=0 
		where topicteachID = $topicteachID ";
	$result = mysql_query($query) 
		or die("Invalid query: deleteTopicteach current=0" . mysql_error());
	$res->success = true;
    $res->message = "删除选择例题topic-teach成功";
	$res->data = array();
	
echo $_GET['callback']."(".$res->to_json().")";
?>
