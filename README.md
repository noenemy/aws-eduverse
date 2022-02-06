# aws-eduverse
aws-eduverse



# Frontend resource provisioning


# Backend resource provisioning

## Install AWS Copilot
[AWS Copilot](https://aws.github.io/copilot-cli/) is an open source command line interface that makes it easy for developers to build, release, and operate production ready containerized applications on AWS App Runner, Amazon ECS, and AWS Fargate.
* [Install Guide](https://aws.github.io/copilot-cli/docs/getting-started/install/)

## Initialize Eduverse API backend
Run the AWS Copilot command like below.

### Initialize app and service
```bash
copilot init --app eduverse-api --dockerfile backend/Dockerfile --name eduverse-api-svc --port 5000 --type "Load Balanced Web Service"
```

### Setup dev environemnt for the Eduverse API
```bash
copilot env init --app eduverse-api --name dev  
```

### Setup environment variables for the Eduverse API
```bash
copilot secret init --name APP_SETTINGS
```
Type `config.DevelopmentConfig` for the following question.
This is the default value for `APP_SETTINGS`.


```bash
copilot secret init --name AWS_REGION
```
Type `ap-northeast-2` for the following question. 
This is the default value for `AWS_REGION`.


## Resource provisioning for Eduverse backend
```bash
copilot deploy --app eduverse-api --env dev --name eduverse-api-svc
```

You can check the logs for Eduverse API service using below command.
```bash
copilot svc logs --follow
```
`copilot svc status` is also useful to check the status.


## CI/CD pipeline provisioning
You can run below command to initialize CD/CD pipeline.
```bash
copilot pipeline init --environments dev
```
After initialize you can run below command for provisioning
```bash
copilot pipeline update
```

You can also follow command to confirm status of pipeline.

```bash
copilot pipeline status
copilot pipeline show
```

## Clean up backend resource 
For the pipeline
```bash
copilot pipeline delete
```

For the app
```bash
copilot app delete
```

## References and more for AWS Copilot 
Explore advanced features – addons, storage, sidecars, etc

* [AWS Copilot CLI repository](https://github.com/aws/copilot-cli/)
* [AWS Copilot CLI documentation](https://aws.github.io/copilot-cli/)
* [Guides and resources](https://aws.github.io/copilot-cli/community/guides/)



