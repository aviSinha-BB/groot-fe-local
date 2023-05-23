# Using Alpine
FROM alpine:latest

#Installing node and npm
RUN apk add --update nodejs npm

# Non root user should own the app
RUN addgroup -S bbadmin && adduser -S bbadmin -G bbadmin 

# Creating working directory
RUN mkdir -p /app/
RUN chown -R bbadmin:bbadmin /app/
WORKDIR /app

#Giving Permissions
RUN chmod 755 /app

# Installing Packages
COPY package*.json ./
RUN npm install
COPY . /app

#Assigning User
USER bbadmin

#Setting env and building source code
RUN cat env.properties >> ~/.bashrc && source ~/.bashrc && npm run build:prod

# Setting Port
EXPOSE 8080

# Running the server
CMD ["npm","run","start"]