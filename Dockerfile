# syntax=docker/dockerfile:1

FROM node:14.18.0
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD [ "node", "./server.js" ]