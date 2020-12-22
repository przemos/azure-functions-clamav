#!/bin/bash

if [ ! -d "/home/clamav" ] 
then
    mkdir -p /home/clamav
    chown -R clamav:clamav /home/clamav
    mv  /var/lib/clamav /home
fi

mkdir -p '/home/site/wwwroot'
rsync -avu  --delete --remove-source-files "/wwwroot/" "/home/site/wwwroot"
clamd
cd azure-functions-host
./start.sh


