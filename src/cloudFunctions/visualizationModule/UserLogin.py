import firebase_admin

from firebase_admin import credentials

from firebase_admin import firestore

import csv

from google.cloud import storage

import os

import pandas as pd

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'gcp.json'

cred = credentials.Certificate("firestore.json")

firebase_admin.initialize_app(cred)



db = firestore.client()

def userLoginVisualization(request):

    lst = []

    docs = db.collection(u'customerFeedback').stream()



    for doc in docs:

        lst.append(doc.to_dict())

    df = pd.DataFrame(lst)

    bucketName = "csci5410_visualization"

    fileName = "userloginDetails.csv"

    client = storage.Client()

    bucket = client.bucket(bucketName)  

    csvFile = df.to_csv(index=False)

    blob = bucket.blob(fileName)

    with blob.open("wt") as f:

        f.write(csvFile)

    return "succeeded"