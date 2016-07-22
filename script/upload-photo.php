<?php

/*  上传图片＋插入数据库  */
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

    //include_once('saestorage.class.php'); //新浪云平台存储组件API
	require_once('db/database_connection.php');

    if( isset( $_REQUEST['do']) ){
	    //var_dump($_FILES['fileToUpload']);
		
		$file = $_FILES['fileToUpload'];
        $fileName = $file['name'];
        $fileSize = $file['size'];
        //$name = $_FILES['fileToUpload']['name']; 
        //$basename = pathinfo($name,PATHINFO_EXTENSION); 
		
		$newName = date('ymdhis')."_".rand(100,999) . ".jpg";
		// 1、文件上传
		$result = move_uploaded_file($_FILES['fileToUpload']['tmp_name'], "img/" . $newName );
 
        //echo $s = $stor->upload("imgfile",$newName,$tmp_name); 
        // $stor->getUrl //获取文件storage访问地址
        //$file_url = $stor->getUrl("domain","cdn_test.txt");
        //$file_url = $stor->getUrl("imgfile",$newName);

        // 2、插入数据库
        //$today = date('ymd');
        //$title = addslashes($_REQUEST['title']);
        $studentstudyID = $_REQUEST['studentstudyID'];
		$fullName = 'script/img/' . $newName; // 图片文件路径
        $sql = "INSERT INTO `ghjy_student-study-photos` (photo,studentstudyID) 
	    	VALUES('$fullName',$studentstudyID)";

        $result = mysql_query($sql) 
            or die("Invalid query: uploadPhoto & insert" . mysql_error());
           
        //die();
		// 返回最新插入记录id
		$id = mysql_insert_id();  
		// 返回当前插入记录
		echo json_encode(array(
			"studyphotoID" => $id,
			"photo" => $fullName,//$newName,
			"studentstudyID" => $studentstudyID,
			//"created": date('ymdhis') //跨域问题
		));	
	}

?>