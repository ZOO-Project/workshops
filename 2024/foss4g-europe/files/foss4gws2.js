function BufferRequest(conf,inputs,outputs){

  var fGJ=new ZOO.Format.GeoJSON();
  var bbox=BufferToBBOX(inputs,0.0015);
  var myProcess2 = new ZOO.Process(zoo_url,'Intersection');
  var myInputs2 = {
    InputEntity1: {
      type: 'complex',
      value: fGJ.write(bbox[1]),
      mimeType: "application/json"
    },
    InputEntity2: {
      type: 'complex',
      xlink: "http://localhost/cgi-bin/mapserv?map="+mapfile+
        "&amp;SERVICE=WFS&amp;version=1.0.0&amp;request=GetFeature&amp;"+
        "typename=points&amp;SRS=EPSG:4326&amp;BBOX="+
        bbox[0].left+","+bbox[0].bottom+","+bbox[0].right+","+bbox[0].top,
      mimeType: "text/xml"
    }
  };
  var myOutputs2= {
    Result: {
      type: 'RawDataOutput',
      "mimeType": outputs["Result"]["mimeType"]
    }
  };
  var myExecuteResult4=myProcess2.Execute(myInputs2,myOutputs2);
  outputs["Result"]["value"]=myExecuteResult4;
  return {result: ZOO.SERVICE_SUCCEEDED, outputs: outputs };

}