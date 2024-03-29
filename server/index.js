const keys = require('./keys');

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();

app.use(cors());
app.use(express.json());

// Postgres client setup
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection.'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));

// Redis client setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => {
  res.json({
    data: 'Hello world!'
  });
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');

  res.json({
    data: values.rows
  });
});

app.get('/values/current', (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.json({
      data: values
    });
  });
});

app.post('/values', (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 100) {
    return res.status(422).json({
      data: 'Index too high.'
    });
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.json({
    data: 'Number added'
  });
});

app.listen(5000, err => console.log('Listening on port 5000'));
