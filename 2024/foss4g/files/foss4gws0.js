var zoo_url='http://localhost/cgi-bin/zoo_loader.cgi';
var mapfile="/var/data/maps/project_WS2024.map";

function Buffer(inputData,bDist){

  // Create all required ZOO.formats
  var fGJ=new ZOO.Format.GeoJSON();

  // Call the Buffer service
  var myInputs = {
    InputPolygon: { 
      type: 'complex',
      value: fGJ.write(inputData),
      mimeType: "application/json"},
      BufferDistance: {
        type: 'float',
        "value": bDist
      }
  };
  var myOutputs= {
    Result: { 
      type: 'RawDataOutput',
      "mimeType": "application/json"
    }
  };
  var myProcess = new ZOO.Process(zoo_url,'Buffer');
  var myExecuteResult=myProcess.Execute(myInputs,myOutputs);
  return fGJ.read(myExecuteResult);

}

function BufferToBBOX(inputs,dist){
  // Create all required ZOO.formats
  var fGJ=new ZOO.Format.GeoJSON();
  var fGML=new ZOO.Format.GML();
  if(inputs["InputData"]["mimeType"]=="application/json")
      fGML=new ZOO.Format.GeoJSON();

  // Read the   input GML
  var inputData=fGML.read(inputs["InputData"]["value"]);
  alert(inputData);

  // Compute Buffer
  var bufferResultAsJSON=Buffer(inputData,dist);
  alert(bufferResultAsJSON);

  // Create the Buffer result BBOX
  var bbox = new ZOO.Bounds();
  var bounds=bufferResultAsJSON[0].geometry.getVertices();
  for(var t in bounds){
    bbox.extend(bounds[t]);
  }
  return [bbox,bufferResultAsJSON,inputData];
}

function Mask(conf,inputs,outputs){
  var fGJ=new ZOO.Format.GeoJSON();
  var bbox = BufferToBBOX(inputs,0.15);
  var finalG=bbox[0].toGeometry();
  var result=new ZOO.Feature(finalG,{"name": "Result1000"});
  outputs["Result"]["value"]=fGJ.write(result);
  return {result: ZOO.SERVICE_SUCCEEDED, outputs: outputs };
}
