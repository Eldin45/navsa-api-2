FROM node:21

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .
COPY .env .
RUN npx prisma generate



# Expose the port on which the app will run
EXPOSE 3001

# Start the server using the production build
CMD ["npm", "run", "start:dev"]