function doGet(e){
//  var name = e.parameter.name;
  sheet = getMayusukiSheet();
  var data =  sheet.getDataRange().getValues();
  var columns = []
  
//  var jsonData = {"text":"佐久間まゆ♡" + name}
//  var content = createJsonContent(jsonData);
//  
//  return content;
}

function createJsonContent(jsonData){
  var text = JSON.stringify(jsonData);
  var content = ContentService.createTextOutput(text);
  return content.setMimeType(ContentService.MimeType.JSON);
}