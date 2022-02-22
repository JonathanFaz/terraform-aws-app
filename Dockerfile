FROM node:14.15.4-alpine

ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY . /opt/app

RUN chown -R node:node /opt/app/* 

RUN npm install

EXPOSE 3000

USER node

CMD [ "node", "./src/app.js" ]