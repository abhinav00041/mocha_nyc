FROM node:boron-slim

MAINTAINER "a.b.chaudhary0001@gmail.com"

WORKDIR /usr/app

EXPOSE 4000

COPY package.json .babelrc /usr/app/
COPY /config/ /usr/app/config/
COPY /src/ /usr/app/src/
COPY /test/ /usr/app/test/

RUN npm install
RUN npm run build

CMD npm start