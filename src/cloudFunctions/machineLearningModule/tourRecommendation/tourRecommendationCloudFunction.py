from google.cloud import aiplatform
from google.cloud.aiplatform.gapic.schema import predict
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value
from flask import jsonify
import nltk
import pandas as pd
nltk.download("stopwords")
from nltk.corpus import stopwords
# [START aiplatform_predict_tabular_classification_sample]
from typing import Dict

def hello_world(requests):
    request_args = requests.args
    request_json = requests.get_json(silent=True)
    
    if requests.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Origin': '*'}

    if request_args and "stayDuration" in request_args:
        stayDuration = request_args['stayDuration']
    elif request_json and "stayDuration" in request_json:
        stayDuration = request_json['stayDuration']
    else:
        stayDuration = None
        return (jsonify({"message": "Something went wrong", "status":400}),400,headers)
        
 
    print(stayDuration)
    api_endpoint = "us-central1-aiplatform.googleapis.com"
    project="968345354155"
    endpoint_id="2265266632102248448"
    location="us-central1"
    instance_dict = { "stay_duration_feature": stayDuration}
    client_options = {"api_endpoint": api_endpoint}
    client = aiplatform.gapic.PredictionServiceClient(client_options=client_options)
    instance = json_format.ParseDict(instance_dict, Value())
    instances = [instance]
    parameters_dict = {}
    parameters = json_format.ParseDict(parameters_dict, Value())
    endpoint = client.endpoint_path(project=project, location=location, endpoint=endpoint_id)
    response = client.predict(endpoint=endpoint, instances=instances, parameters=parameters)
    predictions = response.predictions
    for prediction in predictions:
        print(prediction)

    df = pd.DataFrame(dict(prediction))
    tour_class = df['classes'].iloc[df[['scores']].idxmax()]
    print(tour_class.values[0])
    return (jsonify(tour_class),200,headers)