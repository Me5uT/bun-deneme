bun run clean

### bun install ###
TIMEOUT=30
echo "bun install komutu çalıştırılıyor..."
timeout $TIMEOUT bun install
if [ $? -ne 0 ]; then
    echo "İlk deneme başarısız veya zaman aşımına uğradı, tekrar deneniyor..."
    timeout $TIMEOUT bun install
    if [ $? -ne 0 ]; then
        echo "Komut tekrar başarısız oldu."
        exit 1
    else
        echo "Komut başarıyla tamamlandı."
    fi
else
    echo "Komut başarıyla tamamlandı."
fi
### ### ###

bunx --bun vite build
docker build -t bun-deneme-app .
docker stop fe-bun

sudo docker container prune --force
sudo docker run --name fe-bun -p 9000:9000 bun-deneme-app &
sudo docker image prune --force