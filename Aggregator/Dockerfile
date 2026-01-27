FROM oven/bun:1

RUN apt-get update && apt-get install -y ca-certificates

WORKDIR /usr/src/path

COPY package.json bun.lock ./
RUN bun install 

COPY . .

CMD [ "bun", "run", "index.ts" ]