#!/usr/bin/env python3

# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

import datetime
import json
import time
import random
import boto3
import hashlib
import sys

session = boto3.Session(
    # Uncomment to a different AWS Profile than Default
    # profile_name='eduverse' 
    )
ivs = session.client(
    # Service Name
    'ivs', 
    # Uncomment to use a different AWS Region than Default in Profile
    region_name='us-west-2',
    )

def get_quiz(quiz_file="quiz_ko.txt"):
    """Returns a list of quiz about cats from the cat file (one fact
    per line)"""
    with open(quiz_file, "r") as quiz_file:
        return [line for line in quiz_file]

def put_metadata(channel_arn, metadata_payload):
    """
    Adds metadata to an active stream. 
    There is a limit: at most 5 requests per second per channel 
    are allowed.
    """
    response = ivs.put_metadata(
        channelArn=channel_arn,
        metadata=metadata_payload,
    )
    return response

# Bokil modifed the part that fills the metadata from a file
# The thing is a correctanswer and answer1,2,3

if __name__ == "__main__":
    if len(sys.argv) > 1:
        channel_arn = sys.argv[1]
        quiz = get_quiz()
        options = ['에듀버스', '답이없음', 'Eduverse', '모두정답']
        while True:
            question = random.choice(quiz).rstrip()
            fields=question.split(";")

            for field in fields:
                question = fields[0]
                correctanswer= fields[1]
                answer1 = fields[2]
                answer2 = fields[3]
                answer3 = fields[4]
            data = {
                    "current_time" : datetime.datetime.utcnow().strftime('%Y-%b-%d-%H%M%S'),
                    "question_id": str(hashlib.md5(question.encode()).hexdigest()), #create hash for an id for now
                    "question": question,
                    "correctIndex": correctanswer.rstrip(),
                    "answers": [
                        answer1,
                        answer2,
                        answer3,
                        random.choice(options).rstrip()
                        ]
            }
            print(json.dumps(data))
            try:
                response = put_metadata(channel_arn,json.dumps(data))
                #print(response)
                print("HTTPStatusCode: {}".format(response['ResponseMetadata']['HTTPStatusCode']))
            except Exception as e: 
                print("ERROR: {}".format(e))
            time.sleep(15)
    else:
        print("please provide IVS ARN\n example: \t ./metadata.py <ARN>
