### Build stage
FROM node:20.15.1-alpine as builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

### Run stage
FROM nginx:latest

# copy the custom nginx configuration file to the container in the default
# location
COPY nginx.conf /etc/nginx/nginx.conf
# copy the built application from the build stage to the nginx html
# directory
COPY --from=builder /app/dist/posh-client/browser /usr/share/nginx/html

EXPOSE 80
