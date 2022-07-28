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

    aws_access_key_id="ASIARS4TA543EUVV52GM",

    aws_secret_access_key="A08dwD2gzoIVNXl88RdTFT0vhafe2RjttJTS/S+P",

    aws_session_token="FwoGZXIvYXdzEF4aDDe3/LONf0UlbN/EKSLAAZSRxFuztC67DKClcwnUQhZyZ+g+pQOIFA3V0wIHaqK5nYf4oi0XbIAmZRZVGitlfQW38jc6YBXv2ubza4MslSA74KIsVdmLQP1CX9B6If1ErUkXWcM4888HYIAtq/M82XdND7FZIFzBz8intDa2eF+/REKviB/GBQRm7zujQbgKq5n87MUgNYio1vttt1FzlhmodQ+UVMaU8licKHEZzEb+Ac7m5MbOpZu/P8oON0xRkBaq1xkaC9Hhk4SJ+IirNij61/aWBjItLcLg5LUWHvD+59q81LhVwm0IaTGLVNmSS8TsQlqVvVfZrlUbd6KKY756qa69"

    )

def tourinvoicetablecloudfunction(request):
    try:

        response = dynamoDB.scan(TableName='CSCI5410_Tour_Invoice')

        data = response['Items']

        for i in range(len(data)):

            x = data[i]

            # print(x)

            data[i]['BookingId']=x['BookingId']['S']

            data[i]['Date']=x['Date']['S']

            data[i]['Location']=x['Location']['S']

            data[i]['Name']=x['Name']['S']

            data[i]['Price']=x['Price']['S']

            data[i]['UserId']=x['UserId']['S']

        df = pd.DataFrame(data)

        print(df.head())
    
        bucketName = "csci5410_visualization"
        fileName = "tourInvoiceTable.csv"
        # print(tdata.head())
        #actual data
        client = storage.Client()
        bucket = client.bucket(bucketName)

        csvFile = df.to_csv(index=False)

        blob = bucket.blob(fileName)
        with blob.open("wt") as f:
            f.write(csvFile)
        print("wrote content to the gcs")
        return "succeded"
    except Exception as e:
        print(e)
        return "failure"

   

   
   