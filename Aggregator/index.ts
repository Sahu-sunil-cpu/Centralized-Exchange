import { PublishStream } from "./redis/publish";
import type { OutgoingMessage } from "./types/Outgoing";
import { client } from "./db/client"



export async function Aggregate1mOhlvc() {

  try {
    // TODO_1: Aggregating candles from entire trades on each call, only previous 
    // one minute trades can be aggregated
    // not doing it now because timestamp from soalna blockchain is in us timezone
    //and it needs to format ingest worker,
    const result = await client.query(`
    WITH bucketed AS (
      SELECT
          market,
          date_trunc('minute', time) AS bucket_start,
          MIN(time) AS first_time,
          MAX(time) AS last_time,
          MAX(price) AS high,
          MIN(price) AS low,
          SUM(amount) AS volume
          FROM trades    --  WHERE time >= NOW() - interval '1 min'
          GROUP BY market, bucket_start
         )
    INSERT INTO klines_1m (market, bucket_start, open, high, low, close, volume)
    SELECT
          b.market,
          b.bucket_start, -- open price (first trade in bucket)
          (SELECT price 
          FROM trades t 
          WHERE t.market = b.market 
          AND date_trunc('minute', t.time) = b.bucket_start 
          ORDER BY t.time ASC LIMIT 1) AS open,
          b.high,
          b.low, -- close price (last trade in bucket)
          (SELECT price 
          FROM trades t WHERE t.market = b.market AND date_trunc('minute', t.time) = b.bucket_start 
  
          ORDER BY t.time DESC LIMIT 1) AS close,
          b.volume
          FROM bucketed b
  
          ON CONFLICT (market, bucket_start) DO UPDATE
          SET open = EXCLUDED.open,
          high = EXCLUDED.high,
          low = EXCLUDED.low,
          close = EXCLUDED.close,
          volume = EXCLUDED.volume;
  
              `)

    console.log("inserted 1m klines")

    const res = await client.query(`
         SELECT * FROM klines_1m
         -- WHERE market = $1
         ORDER BY bucket_start DESC
         LIMIT 1
          `);

    const msg: OutgoingMessage = {
      stream: `candle@${res.rows[0].market}`,
      data: {
        o: res.rows[0].open,
        h: res.rows[0].high,
        l: res.rows[0].low,
        v: res.rows[0].volume,
        c: res.rows[0].close,
        ts: res.rows[0].bucket_start,
        b: "1m",
        m: res.rows[0].market
        
      }
    }

 //   console.log(msg);
    PublishStream(res.rows[0].market, msg);

  } catch (e) {
    throw e;
  }

}



export async function Aggregate5mOhlvc() {

  try {

    await client.query(`
            WITH bucketed AS (
              SELECT
                  market,
                  date_trunc('minute', time) - (EXTRACT(MINUTE FROM time)::int % 5) * interval '1 minute' AS bucket_start,
                  MIN(time) AS first_time,
                  MAX(time) AS last_time,
                  MAX(price) AS high,
                  MIN(price) AS low,
                  SUM(amount) AS volume
              FROM trades
             --  WHERE time >= NOW() - interval '5 min'
              GROUP BY market, bucket_start
          )
          INSERT INTO klines_5m (market, bucket_start, open, high, low, close, volume)
          SELECT
              b.market,
              b.bucket_start,
              -- open price (first trade in bucket)
              (SELECT price 
               FROM trades t 
               WHERE t.market = b.market 
                 AND (date_trunc('minute', t.time) -  (EXTRACT(MINUTE FROM t.time)::int % 5) * interval '1 minute') = b.bucket_start 
               ORDER BY t.time ASC LIMIT 1) AS open,
              b.high,
              b.low,
              -- close price (last trade in bucket)
              (SELECT price 
               FROM trades t 
               WHERE t.market = b.market 
                 AND (date_trunc('minute', t.time) -  (EXTRACT(MINUTE FROM t.time)::int % 5) * interval '1 minute') = b.bucket_start 
               ORDER BY t.time DESC LIMIT 1) AS close,
              b.volume
          FROM bucketed b
          ON CONFLICT (market, bucket_start) DO UPDATE
          SET open = EXCLUDED.open,
              high = EXCLUDED.high,
              low = EXCLUDED.low,
              close = EXCLUDED.close,
              volume = EXCLUDED.volume;
                      `)

    console.log("inserted 5m klines")


    const res = await client.query(`
         SELECT * FROM klines_5m
         -- WHERE market = $1
         ORDER BY bucket_start DESC
         LIMIT 1
          `);

     const msg: OutgoingMessage = {
      stream: `candle@${res.rows[0].market}`,
      data: {
        o: res.rows[0].open,
        h: res.rows[0].high,
        l: res.rows[0].low,
        v: res.rows[0].volume,
        c: res.rows[0].close,
        ts: res.rows[0].bucket_start,
        b: "5m",
        m: res.rows[0].market
        
      }
    }

 //   console.log(msg);
    PublishStream(res.rows[0].market, msg);

  } catch (e) {
    throw e;
  }

}

async function ExtraFunction() {
  const query = `
    WITH bucketed AS (
      SELECT
        market,
        date_trunc('minute', time) AS bucket_start,
        MAX(price) AS high,
        MIN(price) AS low,
        SUM(amount) AS volume
      FROM trades
      GROUP BY market, bucket_start
    )
    SELECT
      b.market,
      b.bucket_start,
      (SELECT price FROM trades t
       WHERE t.market = b.market
         AND date_trunc('minute', t.time) = b.bucket_start
       ORDER BY t.time ASC LIMIT 1) AS open,
      b.high,
      b.low,
      (SELECT price FROM trades t
       WHERE t.market = b.market
         AND date_trunc('minute', t.time) = b.bucket_start
       ORDER BY t.time DESC LIMIT 1) AS close,
      b.volume
    FROM bucketed b;
  `;

  const result = await client.query(query);
  console.log(result.rows)

}

//cron job like
setInterval(Aggregate1mOhlvc, 1000 * 60);
setInterval(Aggregate5mOhlvc, 1000 * 60 * 5);
