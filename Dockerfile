FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

RUN npm install -g yarn
RUN npm install -g nodemon

USER node

COPY --chown=node:node yarn.lock ./

RUN yarn

COPY --chown=node:node . .

EXPOSE 3500

CMD ["yarn", "debug"]