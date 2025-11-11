FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


ENV VITE_API_BASE_URL=http://localhost:8081

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

