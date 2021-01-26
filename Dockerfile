FROM node:11 as frontendbuilder
WORKDIR /usr/src/app
COPY dashboard-frontend/package*.json ./

RUN npm install --production
COPY dashboard-frontend/. .
RUN npm run build

FROM node:11

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install 
COPY . .
COPY --from=frontendbuilder /usr/src/app/build .
EXPOSE 3001
CMD [ "npm", "start" ]