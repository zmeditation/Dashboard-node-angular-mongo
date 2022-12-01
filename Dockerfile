##STAGE 1:server build 
FROM node:14.16.0 AS server
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
#COPY package.json package-lock.json ./
COPY server/package.json ./
RUN npm install
#RUN npm run i-serv
COPY  . /usr/src/app
EXPOSE 4200  
CMD [ "npm", "start" ]

## STAGE 2: Build ###
FROM node:14.16.0 AS build
WORKDIR /app
COPY package.json ./
COPY view/package.json ./view/
RUN npm run i-view
#RUN npm install
#RUN npm install -g @angular/cli@9.1.12
COPY . .
RUN npm run develop 
#RUN ng build --configuration=develop 
#RUN npm run-script develop

### STAGE 2: Run ###
FROM nginx:mainline-alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /var/www/dashboard /usr/share/nginx/html
EXPOSE 80


