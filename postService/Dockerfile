# base image to use/ enviroment
FROM node:alpine

# what directory to apply following actions
WORKDIR /app
# copy package file
COPY package.json ./
# run install script
RUN npm install
# copy all files except the nodemodules
COPY ./ ./

# will copy all files except node_modules since we have a dockerignore file with it inside

CMD ["npm","start"]