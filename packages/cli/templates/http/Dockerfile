FROM node:22.20.0-alpine3.21
RUN apk upgrade --no-cache

RUN deluser --remove-home node \
  && addgroup -g 1000 node \
  && adduser -u 1000 --home /home/node -G node --shell /bin/sh --disabled-password -D node
RUN chown -R node:node /home/node

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

RUN npm install --omit=dev
COPY --chown=node:node . .

EXPOSE 3000

USER node

CMD [ "npm", "start" ]