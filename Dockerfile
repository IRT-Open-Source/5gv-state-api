FROM node:latest
RUN echo "v0.0.6"
WORKDIR /usr/state-api
COPY ./*.json ./
RUN npm install
RUN npm i -g @nestjs/cli
