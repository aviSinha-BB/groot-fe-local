# Installing node
FROM node:8.15.1

# Non root user should own the app
RUN groupadd -r bbadmin && useradd -r -g bbadmin bbadmin 

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
RUN npm run build:prod

USER bbadmin

# Setting Port
EXPOSE 8080

# Running the server
CMD ["npm","run","start"]
