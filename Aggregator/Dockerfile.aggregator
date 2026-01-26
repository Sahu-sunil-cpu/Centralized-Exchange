FROM oven/bun:1

WORKDIR /usr/src/path

COPY package.json bun.lockb ./
RUN bun install 

COPY . .

CMD [ "bun", "run", "index.ts" ]