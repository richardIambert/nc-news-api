# NC News API 📰

API for NC News project.

## Setup

### 1. Clone project repository 🐑🧪🐑

```bash
git clone
cd nc-news-api
```

### 2. Install project dependencies 💻🚚💨📦📦

```bash
npm install
```

### 3. Create environment variables 🧮

Using `.env.example` as an example (...👀), create a `.env.development` and `.env.test` file in the root directory of the repository.

```bash
# .env.development
PGDATABASE=nc_news
PORT=3000
```

```bash
# .env.test
PGDATABASE=nc_news_test
PORT=3000
```

### 4. Setup databases 🌱🌱🗄️🗄️

```bash
npm run setup-dbs
npm run seed-dbs
```

### 5. Ok, now what 🤔?

From here, we can run a development environment ...

```bash
npm run dev
```

... testing our work like good little eggs 🥚🥚 as we go 🙌

```bash
npm test
```
