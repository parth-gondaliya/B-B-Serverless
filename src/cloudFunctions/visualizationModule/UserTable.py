import base64
import os
import pandas as pd
import json
from google.cloud import storage
from io import StringIO

import boto3

from botocore.config import Config

import pandas as pd

dynamoDB = boto3.client(

    'dynamodb',

    config = Config(region_name = 'us-east-1'),

    aws_access_key_id="ASIARS4TA543ACNTPS6P",

    aws_secret_access_key="msF290XZXGjdwxI4NAE/H9s8rJYHuHVOxu/WliDM",

    aws_session_token="FwoGZXIvYXdzEFoaDE/bbNU+XIMbeWI/GSLAAZfhDvnMCVTRAGt0mNbIhCanlHssJHDG+b1BTA3zp8rG6Q5IPrqVTvm28zJPygX7ceLdTgAF2Pum11JNvu6tEUQqUIzfyGv4EetJdoi58MjVYydZCu5ttlDMMf+eIxYJVe8HVmqEfiZeH+xjkBrblqOTBhyN2udzQP3/EtrWqB36c/Ff9aBRirRq0lGJZhdXw+GdEzBVYcEW/nbclC0zcUE1P3mwfW3+lj2uSuolJKWZ8rW7mSPp74Pa6YOjTxmwdCj15PWWBjItcQq7UKPXauDzvm3l9X5+fyos2Y8PoSiOw3/Upt+JrxA7akwNVn4deRe2RbPI"

    )

def user_table(request):

    response = dynamoDB.scan(TableName='CSCI_5410_USERS')

    data = response['Items']

    for i in range(len(data)):

        x = data[i]

        # print(x)

        data[i]['userId']=x['userId']['S']

        data[i]['answer']=x['answer']['S']

        data[i]['cipherNumber']=x['cipherNumber']['S']

        data[i]['email']=x['email']['S']

        data[i]['firstName']=x['firstName']['S']

        data[i]['lastName']=x['lastName']['S']

    df = pd.DataFrame(data)

    print(df.head())
 

    bucketName = "csci5410_visualization"
    fileName = "userTable.csv"
   
    client = storage.Client()
    bucket = client.bucket(bucketName)
    

    csvFile = df.to_csv(index=False)

    blob = bucket.blob(fileName)
    with blob.open("wt") as f:
        f.write(csvFile)

    return "succeded"

   