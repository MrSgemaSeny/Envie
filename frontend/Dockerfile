FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Set the environment variable for Vite to point to the backend Docker compose service port
ENV VITE_API_URL=http://localhost:8080/api/v1
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Create the /Envie directory in the web root and copy the built files there
RUN mkdir -p /usr/share/nginx/html/Envie
COPY --from=builder /app/dist /usr/share/nginx/html/Envie

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
