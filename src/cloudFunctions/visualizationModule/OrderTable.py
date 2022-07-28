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

def order_table(request):
    response = dynamoDB.scan(TableName='csci5410orderInvoice')
    data = response['Items']
    print(len(data))
    for i in range(len(data)):
        try:
            x = data[i]
            # print(x)
            data[i]['orderId']=str(x['orderId']['S'])
            data[i]['items']=x['items']['S']
            data[i]['TimeStamp']=x['TimeStamp']['S']
            data[i]['totalItem']=x['totalItem']['S']
            data[i]['totalPrice']=x['totalPrice']['S']
            # item = data[i]
            # if(len(data[i]['items'])>1):
            #     for x in item['items']:
            #         copyItem = item
            #         copyItem['items']=x
            #         data.append(copyItem)
                # _ = data.pop(i)
        except:
            pass
    df = pd.DataFrame(data)
    print(df.head(),len(df))
    bucketName = "csci5410_visualization"
    fileName = " OrderInvoiceTable.csv"
    client = storage.Client()
    bucket = client.bucket(bucketName)  
    csvFile = df.to_csv(index=False)
    blob = bucket.blob(fileName)
    with blob.open("wt") as f:
        f.write(csvFile)
    return "succeded"