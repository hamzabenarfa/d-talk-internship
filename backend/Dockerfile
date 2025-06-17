FROM node:20-bullseye

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .
RUN npm install

EXPOSE 4000
EXPOSE 8081

CMD ["npm", "run", "dev"]
