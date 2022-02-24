import boto3
import base64
import io
import json
import transcribe_util
import PIL.Image as Image
from contextlib import closing

session = boto3.session.Session()

def rekognition(request):
    try:
        print(f'session > {session}')

        base64Image = request['image']
        base64Image = base64.b64decode(base64Image.split(',')[1])
        receivedImage = Image.open(io.BytesIO(base64Image))

        byteArrImage = io.BytesIO()
        receivedImage.save(byteArrImage, format='PNG')
        byteArrImage = byteArrImage.getvalue()

        rekog = session.client('rekognition')
        response = rekog.detect_labels(
            Image={
                'Bytes': byteArrImage,
            }
        )
        print('success!')
        res = response
        return res

    except Exception as e:
        print(e)

def textract(request):
  try:

    base64Image = request['image']
    base64Image = base64.b64decode(base64Image.split(',')[1])
    receivedImage = Image.open(io.BytesIO(base64Image))

    byteArrImage = io.BytesIO()
    receivedImage.save(byteArrImage, format='PNG')
    byteArrImage = byteArrImage.getvalue()

    textract = session.client('textract')
    response = textract.detect_document_text(
      Document={
          'Bytes': byteArrImage,
      }
    )
    print('success!')
    res = response
    return res

  except Exception as e:
      print(e)

def get_polly_language(request):
    try:
        polly = session.client('polly')
        response = polly.describe_voices()
        languageList = []

        for voice in response['Voices']:
            # add only none-duplicate language codes
            if next((item for item in languageList if item['languageCode'] == voice['LanguageCode']), False) == False:
                dic = {
                    'languageCode': voice['LanguageCode'],
                    'languageName': voice['LanguageName']
                }
                languageList.append(dic)

        print(f'languageList > {languageList}')

        print('success!')
        res = languageList
        return res

    except Exception as e:
        print(e)

def get_polly_voices(request):
    try:
        languageCode = request['languageCode']

        polly = session.client('polly')
        response = polly.describe_voices(LanguageCode=languageCode)
        voiceList = []

        for voice in response['Voices']:
            if voice['LanguageCode'] is not None:
                dic = {
                    'voiceName': voice['Name'],
                    'gender': voice['Gender']
                }
                voiceList.append(dic)

        print(f'voiceList > {voiceList}')
        print('success!')
        res = voiceList #make_response(jsonify(voiceList), 200)
        return res

    except Exception as e:
        print(e)

def polly(request):
    try:
        print(f'polly request > {request}')
        polly = session.client('polly')
        languageCode = request["language"]
        voiceId = request["voice"]
        text = request["text"]

        response = polly.synthesize_speech(LanguageCode=languageCode,
                        VoiceId=voiceId,
                        OutputFormat='mp3', 
                        Text = text)
                        
        print(f'response >> {response}')

        if "AudioStream" in response:
            with closing(response["AudioStream"]) as stream:
                
                bucket_name = "eduverse-data"
                key = "pollydemo"

                # upload audio stream to s3 bucket
                s3 = session.client('s3')
                output = io.BytesIO()
                output.write(response['AudioStream'].read())
                s3.put_object(Body=output.getvalue(), Bucket=bucket_name, Key=key)
                output.close()

                # get signed url for the uploaded audio file
                signedUrl = s3.generate_presigned_url(
                    ClientMethod='get_object',
                    Params={
                        'Bucket': bucket_name,
                        'Key': key
                    }
                )
            
        print('success!')
        res = {'mediaUrl':signedUrl}
        return res

    except Exception as e:
        print(e)

def get_presigned_url(request):
    try:

        languageCode = request.form['language']
        presigned_url = transcribe_util.get_presigned_url(language_code=languageCode)

        print('success!')
        res = {'transcribeUrl':presigned_url}
        return res

    except Exception as e:
        print(e)

def get_transcribe_language(request):
    try:

        # Streaming type only. See 
        # https://docs.aws.amazon.com/transcribe/latest/dg/supported-languages.html#table-language-matrix
        languages = [('English, US', 'en-US'), ('Chinese, CN', 'zh-CN'), ('English, AU', 'en-AU'), ('English, UK', 'en-GB'), ('French, CA', 'fr-CA'), ('French, FR', 'fr-FR'), ('German, DE', 'de-DE'), ('Italian, IT', 'it-IT'), ('Japanese, JP', 'ja-JP'), ('Korean, KR', 'ko-KR'), ('Portuguese, BR', 'pt-BR'), ('Spanish, US', 'es-US')]
        languageList = []

        for language in languages:
            dic = {
                'language': language[0],
                'languageCode': language[1]
            }
            languageList.append(dic)

        print('success!')
        res = languageList
        return res

    except Exception as e:
        print(e)

def handler(event, context):
  
    blueprint = '/demo'
    
    print('received event:')
    print(event)
    
    method = event['httpMethod']
    path = event['path'].replace(blueprint, '')
    body = {}
    if event['body'] != None:
        body = json.loads(event['body'])
        
    queryStringParameters = event['queryStringParameters']
    
    print(f'method : {method}')
    print(f'path : {path}')
    print(f'body : {body}')
    print(f'queryStringParameters : {queryStringParameters}')

    # print(f'PIL.Image >> {Image}')

    if path == '/rekognition' and method == 'POST':
        res = rekognition(body)
    elif path == '/textract' and method == 'POST':
        res = textract(body)
    elif path == '/polly/languages' and method == 'GET':
        res = get_polly_language(queryStringParameters)
    elif path == '/polly/voices' and method == 'GET':
        res = get_polly_voices(queryStringParameters)
    elif path == '/polly' and method == 'POST':
        res = polly(body)
    elif path == '/transcribe' and method == 'POST':
        res = get_presigned_url(body)
    elif path == '/transcribe/languages' and method == 'GET':
        res = get_transcribe_language(queryStringParameters)

    print(f'@ res >> {res}')

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(res)
    }