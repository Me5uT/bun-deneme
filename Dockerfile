FROM oven/bun:latest
WORKDIR /app
COPY . .
#RUN bun install
#RUN bunx --bun vite build
CMD ["bun", "run", "preview", "--host"]
