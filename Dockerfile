FROM node:18

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build
CMD [ "npm", "start" ]
EXPOSE 3000