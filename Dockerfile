# Installing node
FROM node:8.15.1

# Non root user should own the app
RUN groupadd -r bbadmin && useradd -r -g bbadmin bbadmin 

# Creating working directory
RUN mkdir -p /app/
RUN chown -R bbadmin:bbadmin /app/
WORKDIR /home/bbadmin/app

#Giving Permissions
RUN chmod 755 /home/bbadmin

# Installing Packages
COPY package*.json ./
RUN npm install
COPY . /app

USER bbadmin

# Setting Port
EXPOSE 8080

# Running the server
CMD ["npm","run","start:prod"]
