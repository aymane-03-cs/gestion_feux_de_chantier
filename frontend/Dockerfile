# 1. Use Node.js 18
FROM node:18

# 2. Set the working directory
WORKDIR /app

# 3. Copy package.json & package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the Angular project
COPY . .

# 5. Disable Angular CLI analytics (no prompt)
ENV NG_CLI_ANALYTICS=ci

# 6. Build the Angular app in production mode
RUN npm run build --configuration=production

# 7. Install http-server globally
RUN npm install -g http-server

# 8. Expose port 4200 for our Angular app
EXPOSE 4200

# 9. Serve the production build with http-server
CMD ["http-server", "dist/frontend/browser", "-p", "4200", "-c-1"]