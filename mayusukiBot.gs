var twitter_base_url = "https://api.twitter.com/1.1/";

//毎日発動するトリガー
function addMayusukiData(){
  var spreadsheet = getMayusukiSheet();
  var sheet = spreadsheet.getActiveSheet();
  auth();
  var data = getYesterdayMayusukiData();
  sheet.getRange(sheet.getLastRow()+1,1,data.length,data[0].length).setValues(data);
}


// 日曜日に発動するトリガー
function createMayusukiChartWeekly(){
  var spreadsheet = getMayusukiSheet();
  var sheet = spreadsheet.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange("A"+(lastRow-6)+":"+"B"+lastRow);
  var chart = sheet.newChart()
              .addRange(range)
              .setChartType(Charts.ChartType.LINE)
              .setPosition(5,10,0,0)
              .setOption("title","今週のまゆすき")
              .setOption("vAxes",[{"title":"ツイート数"}]);
  sheet.insertChart(chart.build());
}

function createJsonContent(jsonData){
  var text = JSON.stringify(jsonData)
  var content = ContentService.createTextOutput(text);
  content = content.setMimeType(ContentService.MimeType.JSON);
  return content;
}

function getMayusukiSheet(){
  return SpreadsheetApp.openById('1JEmcFhzK65JXkniFlGrnwQO7uHcClYSFIBsxLBNFPRY');
}

function getYesterdayMayusukiData(){
  var today = new Date(2017,10, 23);
  var yesterdayBegin = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  var yesterdayEnd = new Date(yesterdayBegin.getTime());
  yesterdayBegin.setHours(0,0,0,0)
  yesterdayEnd.setHours(23,59,59,59) 
  var twiSearchCountMax =  100;//TwitterSearchAPIでは検索上限が100件のため
  var searchPayload = {
    q:"\"まゆすき\" -rt",
    since:formatDate4Twitter(yesterdayBegin),
    until:formatDate4Twitter(yesterdayEnd),
    count:twiSearchCountMax
  }
  
  var mayusukiCount = 0;
  while(true){
    var response  = JSON.parse(getAccessTwitter("search/tweets", searchPayload));
    if(response.statuses.length !== twiSearchCountMax){
      mayusukiCount += response.statuses.length;
      break;      
    }
    //Utilities.sleep(5000); //API制限回避に必要かなと思ったけど多分そこまでツイートされない
    searchPayload.max_id = response.statuses[twiSearchCountMax-1].id_str;
    mayusukiCount += twiSearchCountMax-1;
  }
  var arrDay = new Array("日", "月", "火", "水", "木", "金", "土");
  return [[formatDate4DB(yesterdayBegin), arrDay[yesterdayBegin.getDay()] ,mayusukiCount]];
}

function formatDate4Twitter(date){
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "_" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "_JST";
}

function formatDate4DB(date){
  return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
}

function getTwitterService(){
  return OAuth1.createService("twitter")
  .setAccessTokenUrl("https://api.twitter.com/oauth/access_token")
  .setRequestTokenUrl("https://api.twitter.com/oauth/request_token")
  .setAuthorizationUrl("https://api.twitter.com/oauth/authorize")
  .setConsumerKey("xxxxxxxxxxxxx")
  .setConsumerSecret("xxxxxxxxxxxxx")
  .setCallbackFunction("authCallback")
  .setPropertyStore(PropertiesService.getScriptProperties());
}

function authCallback(request){
  var service = getTwitterService();
  var isAuth = service.handleCallback(request);
  if (isAuth) return HtmlService.createHtmlOutput("OK");
  return HtmlService.createHtmlOutput("NG");
}

function auth(){
  var service = getTwitterService();
  if (service.hasAccess()) return;
  var authorizationUrl = service.authorize();
  Logger.log(authorizationUrl);
}

function postAccessTwitter(endPoint, payload){
  var service = getTwitterService();
  var payload_str = payloadToString(payload);
  var options = {
    method:"post",
    escaping:false,
    payload:payload_str
  };
  var url = twitter_base_url + endPoint + ".json";
  return service.fetch(url, options);
}

function getAccessTwitter(endPoint, payload){
  var service = getTwitterService();
  var options = {
    method:"get",
    escaping:false
  };
  var payload_str = payloadToString(payload);
  var url = twitter_base_url + endPoint + ".json?" + payload_str;
  return service.fetch(url, options);
}

function payloadToString(payload){
  return Object.keys(payload).map(function(key){
    return encodeToRfc3986(key) + "=" + encodeToRfc3986(payload[key]);
  }).join("&");
}

function encodeToRfc3986(str){
  return encodeURIComponent(str).replace(/[!'()]/g,function(char){
    return escape(char);
  }).replace(/\*/g, "%2A");
}

          
          