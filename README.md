# ff-challenge

While I didn't create the initial script to run all commands, please follow this guide:

```
cd backend
docker-compose up -d    --to run Docker with postgres database
yarn prisma migrate dev --to apply schema to database
yarn prisma db seed     --to populate database from csv
yarn start              --backend run

cd ..
cd frontend
yarn dev                --frontend run
```

What's missing?
- Search fields
- Order table (backend is ready to order data)
