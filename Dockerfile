FROM oven/bun:latest

WORKDIR /app

#RUN apt-get update && apt-get install -y unzip

COPY . .

RUN bun install

RUN bunx --bun vite build

CMD ["bun", "run", "preview", "--host"]
