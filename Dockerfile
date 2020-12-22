FROM mcr.microsoft.com/azure-functions/node:3.0-node12-appservice

ENV DEBIAN_VERSION buster

#remove nodesource - it is installed in the base image
RUN rm -f /etc/apt/sources.list.d/nodesource.list
# initial install of av daemon
RUN echo "deb http://http.debian.net/debian/ $DEBIAN_VERSION main contrib non-free" > /etc/apt/sources.list && \
    echo "deb http://http.debian.net/debian/ $DEBIAN_VERSION-updates main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb http://security.debian.org/ $DEBIAN_VERSION/updates main contrib non-free" >> /etc/apt/sources.list && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y -qq \
        clamav \
        clamdscan \
        clamav-daemon \
        clamav-freshclam \
        libclamunrar9 \
        netcat \
        rsync \
        wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

RUN wget -O /var/lib/clamav/main.cvd http://database.clamav.net/main.cvd && \
    wget -O /var/lib/clamav/daily.cvd http://database.clamav.net/daily.cvd && \
    wget -O /var/lib/clamav/bytecode.cvd http://database.clamav.net/bytecode.cvd && \
    chown -R clamav:clamav /var/lib/clamav

RUN mkdir /var/run/clamav && \
    chown clamav:clamav /var/run/clamav && \
    chmod 750 /var/run/clamav

COPY docker/startup.sh /tmp/startup.sh
RUN chmod u+x /tmp/startup.sh

COPY docker/clamd.conf /etc/clamav/clamd.conf
COPY docker/freshclam.conf /etc/clamav/freshclam.conf
RUN chown clamav:clamav /etc/clamav/clamd.conf /etc/clamav/freshclam.conf 


RUN mkdir /wwwroot
COPY code/node_modules /wwwroot/node_modules
COPY code/dist /wwwroot

ENTRYPOINT ["/tmp/startup.sh"]

