FROM node:lts-alpine AS build

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && npm install -g vite

COPY . .

RUN npm run build

FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

EXPOSE 4000
EXPOSE 4100
EXPOSE 4200

RUN chown -R node /usr/src/app
USER node

CMD ["npm", "start"]
