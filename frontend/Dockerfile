# # Stage 1: Build React app
# FROM node:20-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --frozen-lockfile
# COPY . .
# RUN npm run build   # builds into /app/dist

# # Stage 2: Nginx to serve frontend
# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html


# Stage 1: Build React app with Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build   # output -> /app/dist

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy React build into Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Overwrite default Nginx config
COPY default.conf /etc/nginx/conf.d/default.conf
