FROM node:11

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install -g nodemon
RUN npm install --production
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]