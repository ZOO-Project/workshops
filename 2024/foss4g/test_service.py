import zoo
def Hello(conf,inputs,outputs):
    outputs["Result"]["value"]=\
            "Hello "+inputs["name"]["value"]+" from the FOSS4G 2023!"
    return zoo.SERVICE_SUCCEEDED
