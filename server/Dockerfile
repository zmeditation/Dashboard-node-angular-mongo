FROM node:14.16.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
#COPY package.json package-lock.json ./
COPY server/package.json ./
RUN npm install
#RUN npm run i-serv
COPY  . /usr/src/app
EXPOSE 4200  
CMD [ "npm", "start" ]
