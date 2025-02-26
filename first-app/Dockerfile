# first-app/Dockerfile
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables to make React bind to all interfaces and run in non-interactive mode
ENV HOST=0.0.0.0
ENV PORT=3000
ENV CI=true

EXPOSE 3000

# Force non-interactive mode
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
