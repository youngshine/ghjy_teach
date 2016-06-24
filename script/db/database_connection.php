<?php

//$con = mysql_connect("w.rdc.sae.sina.com.cn","SAE_MYSQL_USER","SAE_MYSQL_PASS");
$con = mysql_connect("10.66.153.50:3306","root","rootroot2@");
// 新浪云mysql
//$con = mysql_connect(SAE_MYSQL_HOST_M.":".SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }  

//mysql_select_db("yunyi2013", $con);
mysql_select_db("ghjy", $con);
mysql_query("SET NAMES utf8");
date_default_timezone_set("Asia/Shanghai");

?>
