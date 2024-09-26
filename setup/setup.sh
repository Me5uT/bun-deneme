bun install
bunx --bun vite build
docker build -t bun-deneme-app .
docker run -p 9000:9000 bun-deneme-app &