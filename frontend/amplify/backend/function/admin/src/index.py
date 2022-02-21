import json

def health_check():

    ## TODO: write detailed health check logic
    response = {'health_check': 'success'}
    print('health_check: success')
    return response

def handler(event, context):

    blueprint = '/admin'

    print('received event:')
    print(event)

    method = event['httpMethod']
    path = event['path'].replace(blueprint, '')
    body = event['body']
    queryStringParameters = event['queryStringParameters']

    print(f'method : {method}')
    print(f'path : {path}')
    print(f'body : {body}')
    print(f'queryStringParameters : {queryStringParameters}')

    if path == '/health_check' and method == 'GET':
        res = health_check()
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(res)
    }