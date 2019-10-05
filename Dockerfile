FROM node:10-alpine
ARG NPM_TOKEN
ENV NPM_TOKEN ${NPM_TOKEN}

RUN echo ${NPM_TOKEN}

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

RUN npm install -g nodemon

USER node

COPY --chown=node:node .npmrc ./
COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3500

CMD ["npm", "run", "debug"]