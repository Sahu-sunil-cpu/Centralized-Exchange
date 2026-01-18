import { client } from "./client"

async function initializeDB() {

     await client.query(`
        DROP TYPE order_status;
        DROP TYPE order_type;
        DROP TYPE market_type;
        `)

    await client.query(`
        CREATE TYPE order_type AS ENUM ('buy', 'sell');
        CREATE TYPE order_status AS ENUM ('filled', 'partiallyFilled', 'open', 'cancelled');
        CREATE TYPE market_type AS ENUM ('TATA_INR', 'AXIS_INR')
        `)
    
    await client.query(`
        CREATE TABLE users (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL
        );
        `)
   
    await client.query(`
        CREATE TABLE orders (
        id TEXT PRIMARY KEY,
        type order_type NOT NULL,
        price NUMERIC(18, 8) NOT NULL,
        qty NUMERIC(18, 8) NOT NULL,
        executedQty NUMERIC(18, 8) NOT NULL,
        status order_status NOT NULL,
        market market_type NOT NULL,
        userId BIGSERIAL NOT NULL,
        CONSTRAINT fk_user
          FOREIGN KEY (userId)
          REFERENCES users(id)
        );
        `)

    await client.query(`
        CREATE TABLE trades (
        id BIGSERIAL PRIMARY KEY,
        market TEXT NOT NULL,
        price NUMERIC(18, 8) NOT NULL,
        amount NUMERIC(18, 8) NOT NULL,
        time TIMESTAMP NOT NULL
        );
        `)

    await client.query(`
        CREATE TABLE klines_1m (
        market TEXT NOT NULL,
        bucket_start TIMESTAMPTZ NOT NULL,
        open NUMERIC(36, 18) NOT NULL,
        high NUMERIC(36, 18) NOT NULL,
        close NUMERIC(36, 18) NOT NULL,
        low NUMERIC(36, 18) NOT NULL,
        volume NUMERIC(36, 18) NOT NULL,
        PRIMARY KEY (market, bucket_start)
        );
        `)

    await client.query(`
         CREATE TABLE klines_5m (
         market TEXT NOT NULL,
            bucket_start TIMESTAMPTZ NOT NULL,
            open NUMERIC(36, 18) NOT NULL,
            high NUMERIC(36, 18) NOT NULL,
            close NUMERIC(36, 18) NOT NULL,
            low NUMERIC(36, 18) NOT NULL,
            volume NUMERIC(36, 18) NOT NULL,
            PRIMARY KEY (market, bucket_start)
            );
            `)

    await client.query(`
        CREATE TABLE klines_1h (
        market TEXT NOT NULL,
        bucket_start TIMESTAMPTZ NOT NULL,
        open NUMERIC(36, 18) NOT NULL,
        high NUMERIC(36, 18) NOT NULL,
        close NUMERIC(36, 18) NOT NULL,
        low NUMERIC(36, 18) NOT NULL,
        volume NUMERIC(36, 18) NOT NULL,
        PRIMARY KEY (market, bucket_start)
         );
                `)

  

    await client.query(`
        CREATE INDEX idx_trades_market ON trades (market);

        CREATE INDEX idx_trades_market_time ON trades (market, time DESC);
        `)


              

  // console.log(a);

    await client.end();
    console.log('database initialized')
}


initializeDB().catch(err => console.log(err))