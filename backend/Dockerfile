# Use ECR public-repo Due to DockerHub pull rate limit
FROM public.ecr.aws/bitnami/python:latest
# FROM python:3.8-slim

# Download latest listing of available packages:
# Upgrade already installed packages:
RUN apt-get -y update \
    && apt-get -y upgrade \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app
WORKDIR /app
COPY requirements.txt /app
RUN pip3 install -r requirements.txt --no-cache-dir
COPY . /app
EXPOSE 5000
RUN chmod +x ./entrypoint.sh
#CMD python3 -m http.server 8000
ENTRYPOINT ["sh", "entrypoint.sh"]