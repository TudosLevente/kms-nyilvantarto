#!/bin/bash

# A Render.com "Disk" funkciója a /data könyvtárba menti az adatokat (lásd render.yaml)
# Biztosítjuk, hogy lokális futtatás esetén is létezzen a könyvtár
mkdir -p data

echo "Starting Python analytics service..."
# A Python szolgáltatás a háttérben indul
python3 python_service/app.py &

echo "Starting Node.js API and serving React app..."
# A Node.js alkalmazás az előtérben indul (ez tartja életben a Docker konténert)
node --experimental-sqlite server/index.js
