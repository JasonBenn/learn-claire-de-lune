import os

import boto3

# Let's use Amazon S3
s3 = boto3.resource('s3')
bucket = os.environ.get("S3_BUCKET")


def exists(filename):
    pass


def upload(file, filename):
    s3.Bucket(bucket).put_object(Key=filename, Body=file)


def download(key):
    return s3.Object(bucket, key).get()['Body'].read()