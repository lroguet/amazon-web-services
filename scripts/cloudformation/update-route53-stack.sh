#!/bin/bash
# To update https://github.com/lroguet/amazon-web-services/blob/master/cloudformation/templates/route53-dns-failover.json

PRIMARY_RECORD_IP_ADDRESS="MY_IP_ADDRESS"
STACK_NAME_OR_ID="MY_STACK"

aws cloudformation update-stack --stack-name $MY_STACK \
  --use-previous-template \
  --parameters \
    ParameterKey=PrimaryRecord,ParameterValue=$PRIMARY_RECORD_IP_ADDRESS \
    ParameterKey=DomainName,UsePreviousValue=true \
    ParameterKey=HealthCheckPath,UsePreviousValue=true \
    ParameterKey=HostedZoneId,UsePreviousValue=true \
    ParameterKey=SecondaryRecord,UsePreviousValue=true   