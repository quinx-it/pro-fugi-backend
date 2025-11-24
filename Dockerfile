FROM node:22
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm install --ignore-scripts

RUN mkdir -p static

COPY . .

CMD ["sh", "-c", "pnpm migration:run:build && pnpm start"]