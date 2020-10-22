FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
CMD [ "node", "app.js" ]
COPY . .
EXPOSE 5000