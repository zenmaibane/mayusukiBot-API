function doGet(e){
  var name = e.parameter.name;
  var jsonData = {"text":"佐久間まゆ♡"}
  var content = createJsonContent(jsonData);
  return content;
}