FROM node:10-alpine
ARG NPM_TOKEN
ENV NPM_TOKEN ${NPM_TOKEN}

RUN apk add gettext

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN chown -R node:node /usr/local/lib/node_modules
WORKDIR /home/node/app

RUN npm install -g nodemon

USER node

COPY --chown=node:node .npmrc ./
COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN envsubst < .npmrc > ~/.npmrc

EXPOSE 3500

CMD ["npm", "run", "debug"]