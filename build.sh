#!/bin/bash

docker build -t beacat:latest-arm .
docker tag beacat:latest-arm ericmgs/beacat:latest-arm
docker push ericmgs/beacat:latest-arm
docker run -p 8080:80 ericmgs/beacat:latest-arm
