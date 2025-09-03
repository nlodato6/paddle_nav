#!/bin/bash

##############################
# This builds and pushes both the nginx/React image
# and the DRF one.  
#
# The nginx/React image gets built with an environment variable
# that sets the url of the DRF backend REACT_APP_BASE_URL.  Once you
# know the IP address of your EC2 instance, you would pass that in
# instead of localhost
##############################

# ./build-and-push-images.sh <VERSION>

DOCKERHUB_UNAME=<nlodato6>

NEW_VERSION=$1

docker buildx build --platform linux/amd64 -t $DOCKERHUB_UNAME/webserver-prod2:$NEW_VERSION -f webserver/Dockerfile . --no-cache
docker push $DOCKERHUB_UNAME/webserver-prod2:$NEW_VERSION

docker buildx build --platform linux/amd64  -t $DOCKERHUB_UNAME/api-prod2:$NEW_VERSION -f backend/Dockerfile ./backend --no-cache
docker push $DOCKERHUB_UNAME/api-prod2:$NEW_VERSION