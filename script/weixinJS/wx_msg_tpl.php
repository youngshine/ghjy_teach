<?php
//根号教育上门家教－发送模版消息 token 微信上墙－现场大屏幕气氛 https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe7253a6972bd2d4b&secret=c5c604c56402baac2c7ccd98b35ef2f2 

header("Content-type: text/html; charset=utf-8");

header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once "jssdk-token.php";

$corpid = "wx4f3ffca94662ce40";
$corpsecret = "9998a307f7f99e9445d84439d6182355";

$jssdk = new JSSDK($corpid, $corpsecret);
$access_token = $jssdk->getAccessToken();

define("ACCESS_TOKEN",$access_token );

//发送模版消息，参数wxid..
function httpPost($data,$access_token){
	$ch = curl_init();
	$url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" . ACCESS_TOKEN;
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 5.01; Windows NT 5.0)');
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$tmpInfo = curl_exec($ch);
	if (curl_errno($ch)) {
	  return curl_error($ch);
	}

	curl_close($ch);
	return $tmpInfo;
}

$courseID = $_REQUEST['courseID'];
$wxID = addslashes($_REQUEST['wxID']);
//$wxID = 'oMEqkuMUKNmxtAxWGrjeOWPRFO20';
$student = $_REQUEST['student'];
$teacher = $_REQUEST['teacher'];
$zsd = addslashes($_REQUEST['zsd']);
//$created = $_REQUEST['created'];

// 教学课后评价提醒模版 
$data = '{
       "touser":"' . $wxID . '",
       "template_id":"w-jfUn6P5GzQvNcUAguC2_v66XK_1WSiemBvUjZDzyc",
       "url":"http://www.xzpt.org/wx_ghjy/product.html?courseID='.$courseID .'",            
       "data":{
               "first": {
                   "value":"请对今天上门家教进行评价。",
                   "color":"#173177"
               },
               "keyword1": {
                   "value":"'.$student.'",
                   "color":"#173177"
               },
               "keyword2": {
                   "value":"' . $zsd . '",
                   "color":"#173177"
               },
               "keyword3": {
                   "value":"' . $teacher . '",
                   "color":"#173177"
               },
               "remark":{
                   "value": "点击进入评价。\n服务电话400-6680-118",
                   "color":"#173177"
               }
       }
   }';




echo httpPost($data);

?>

