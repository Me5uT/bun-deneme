bun run clean
bun install &
sleep 3
bun install
bunx --bun vite build
docker build -t bun-deneme-app .
docker stop fe-bun
sudo docker container prune --force
docker run --name fe-bun -p 9000:9000 bun-deneme-app &