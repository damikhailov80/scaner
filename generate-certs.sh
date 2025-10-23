#!/bin/bash

# Скрипт для генерации самоподписанных SSL сертификатов для локальной разработки

CERT_DIR="certificates"

# Создаем директорию для сертификатов
mkdir -p $CERT_DIR

echo "🔐 Генерация SSL сертификатов..."

# Генерируем приватный ключ и сертификат
openssl req -x509 -out $CERT_DIR/localhost.pem -keyout $CERT_DIR/localhost-key.pem \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' \
  -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost,IP:127.0.0.1\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

echo "✅ Сертификаты созданы в папке $CERT_DIR/"
echo ""
echo "⚠️  ВАЖНО: Это самоподписанные сертификаты для разработки."
echo "    Браузер покажет предупреждение о безопасности - это нормально."
echo "    Нажмите 'Продолжить' или 'Принять риск' в браузере."
echo ""
echo "📱 Для мобильных устройств:"
echo "    1. Узнайте IP вашего компьютера: ifconfig | grep 'inet '"
echo "    2. Откройте на телефоне: https://ваш-ip:3000"
echo "    3. Примите предупреждение о сертификате"

