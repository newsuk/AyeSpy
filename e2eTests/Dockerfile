FROM node:9.11.2-alpine

WORKDIR /home/node/app

COPY . .

RUN npm install

CMD npm run test:e2e:snap
