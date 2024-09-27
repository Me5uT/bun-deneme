
ENV_FILE=".env"

NEW_PROD_URL="https://dev-admin.mirketsecurity.com"
#NEW_PROD_URL="https://dev-test.mirketsecurity.com"
#NEW_PROD_URL="https://admin.mirketsecurity.com"
# VITE_API_PROD_URL değerini değiştirme
sed -i "s|^VITE_API_PROD_URL=.*|VITE_API_PROD_URL=$NEW_PROD_URL|" $ENV_FILE

echo ".env dosyasında VITE_API_DEV_URL ve VITE_API_PROD_URL güncellendi."



bun run clean

### bun install ###
TIMEOUT=30
echo "bun install komutu çalıştırılıyor..."
timeout $TIMEOUT bun install
if [ $? -ne 0 ]; then
    echo "İlk deneme başarısız veya zaman aşımına uğradı, tekrar deneniyor..."
    timeout $TIMEOUT bun install
    if [ $? -ne 0 ]; then
        echo "Komut tekrar başarısız oldu. Son deneme"
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
else
    echo "Komut başarıyla tamamlandı."
fi
### ### ###

bunx --bun vite build
sudo docker build -t bun-deneme-app .

sudo docker stop fe-bun
sudo docker container prune --force

sudo docker run --name fe-bun -p 9000:9000 bun-deneme-app &
sudo docker image prune --force