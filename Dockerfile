# FROM shelvak/baseimage
FROM node:6-alpine

MAINTAINER Néstor Coppi <nestorcoppi@gmail.com>

RUN mkdir /firehouse_socketio

WORKDIR /firehouse_socketio

ADD app.js package.json ./

RUN npm install

EXPOSE 8085:8085

CMD node app.js
