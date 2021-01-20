FROM node:11 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build


FROM nginx:alpine

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
