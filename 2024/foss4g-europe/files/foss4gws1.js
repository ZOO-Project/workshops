function BufferMask(conf,inputs,outputs){

  // Compute big Buffer
  var bbox = BufferToBBOX(inputs,0.15);
  var finalG=bbox[0].toGeometry();
  var fGJ=new ZOO.Format.GeoJSON();

  // Compute Buffer standard buffer
  var bufferResultAsJSON=Buffer(bbox[2],0.0015);

  // Request Difference service using Buffer result and features in the BBOX
  var result=new ZOO.Feature(finalG,{"fid": "1","name": "Result1000"});
  var myProcess2 = new ZOO.Process(zoo_url,'Difference');
  var myInputs2 = {
    InputEntity1: {
      type: 'complex',
      value: fGJ.write(finalG),
      mimeType: "application/json"
    },
    InputEntity2: {
      type: 'complex',
      value: fGJ.write(bufferResultAsJSON),
      mimeType: "application/json"
    }
  };
  var myOutputs2= {
    Result: {
      type: 'RawDataOutput',
      "mimeType": "application/json"
    }
  };
  var myExecuteResult4=myProcess2.Execute(myInputs2,myOutputs2);

  outputs["Result"]["value"]=myExecuteResult4;
  return {result: ZOO.SERVICE_SUCCEEDED, outputs: outputs };

}