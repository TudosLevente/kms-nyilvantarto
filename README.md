# KMS Nyilvántartó

React frontend, Node.js API, Python analytics service és SQLite adatbázis saját edzésnyilvántartáshoz.

## Indítás

```bash
npm install
npm run dev
```

Elérhetőség:

- React app: http://127.0.0.1:5173/
- Node API: http://127.0.0.1:3001/api/health
- Python analytics: http://127.0.0.1:8001/health

Alap belépés:

- Felhasználónév: `admin`
- Jelszó: `admin123`

## Környezeti változók

Másold a `.env.example` fájlt `.env` néven, ha át akarod írni a portokat, az adatbázis helyét vagy az admin belépést.

```bash
cp .env.example .env
```

Az SQLite adatbázis alapból itt jön létre: `data/kms.sqlite`.

## Online használat

Production build:

```bash
npm run build
npm start
```

Build után a Node.js szerver a `dist/` mappából kiszolgálja a React alkalmazást is, az API pedig ugyanazon a szerveren marad `/api` útvonal alatt. Online deploy előtt mindenképp állítsd át:

- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ALLOWED_ORIGINS`
- `DATABASE_PATH`

## Projektstruktúra

```text
server/
  app.js                    Express app összerakása, statikus React kiszolgálás
  index.js                  Node szerver belépési pont
  db.js                     SQLite kapcsolat és migráció
  repository.js             Tanítvány, fizetés és dashboard adatlekérdezések
  routes/                   API útvonalak
  services/                 Auth és analytics üzleti logika
  middleware/               Auth middleware
  utils/                    Validáció és kisebb segédek

python_service/
  app.py                    Python analytics service

src/
  App.jsx                   React app állapot és nézetváltás
  api/                      API kliens
  hooks/                    Adatbetöltő hookok
  pages/                    Fő oldalak
  components/               Újrahasznosítható UI komponensek
  utils/                    Dátum és fizetés segédfüggvények
```

## Tanítvány profil

A tanítványkártyán vagy a fizetési listában a névre/profil gombra kattintva megnyílik a részletes profil. Itt látható:

- személyes és szülői kapcsolattartási adat
- aktuális havi, féléves és éves fizetési státusz
- fizetések rögzítése vagy visszavonása
- teljes fizetési előzmény lista dátummal és időszakkal
