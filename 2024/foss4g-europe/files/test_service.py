import zoo
def Hello(conf,inputs,outputs):
    outputs["Result"]["value"]=\
            "Hello "+inputs["name"]["value"]+" from the FOSS4G-Europe 2024!"
    return zoo.SERVICE_SUCCEEDED
