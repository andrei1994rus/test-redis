const Redis = require('ioredis');
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const ServerlessHttp = require('serverless-http');

const app = express();
const port = process.env.PORT || 3000;
const URL = process.env.REDIS_URL;

let client;

try {
  client = new Redis(`${URL}`);

  if (client) {
    console.log('CONNECTED');
  }
} catch (e) {
  console.log(e.message);
}

const llen = async () => await client.llen('person');

/* set element with required index by inputted name */
app.use(
  '/.netlify/functions/api/person/lset/:index/:elem',
  async (req, res) => {
    try {
      console.log(`Handle path: ${req.originalUrl}`);
      let index = req.params.index;
      let elem = req.params.elem;
      console.log(`index: ${index}`);
      console.log(`elem: ${elem}`);
      console.log(`End: ${req.path}`);
      if (req.path.length > 1) {
        res.send('404 NOT FOUND');
        return;
      }
      let count = await llen();

      console.log(`count-1<index:${count - 1 < index}`);

      if (count - 1 < index) {
        throw new Error('INDEX>COUNT-1');
      } else {
        client.lset('person', index, elem);
      }

      return res.json({ message: 'DONE!' });
    } catch (e) {
      console.log(e);
      return res.json({ message: `${e.message}` });
    }
  }
);

/* remove inputted element */
app.use('/.netlify/functions/api/person/lrem/:elem', (req, res) => {
  try {
    console.log(`Handle path: ${req.originalUrl}`);
    if (req.path.length > 1) {
      res.send('404 NOT FOUND');
      return;
    }
    let elem = req.params.elem;
    console.log(`elem: ${elem}`);

    client.lrem('person', -1, elem);

    return res.json({ message: 'DONE!' });
  } catch (e) {
    console.log(e);
    return res.json({ message: `${e.message}` });
  }
});

/* add element/elements into list */
app.use('/.netlify/functions/api/person/lpush/:elem', (req, res) => {
  try {
    console.log(`Handle path: ${req.originalUrl}`);
    if (req.path.length > 1) {
      res.send('404 NOT FOUND');
      return;
    }
    let elem = req.params.elem;
    let elems = [];
    console.log(`elem: ${elem}`);
    if (elem.includes(',')) {
      elem = elem.split(',');
      console.log(elems);
      elem.forEach((item) => {
        console.group(`map (${item}):`);
        console.log(item);
        let mapped = item.replace(/^ +/, '');
        mapped = mapped.replace(/ +$/, '');
        console.log(mapped);
        elems.push(mapped);
        console.groupEnd();
      });
      console.log(elems);
      client.lpush('person', elems);
    } else {
      let fixed = elem.replace(/^ +/, '');
      console.log(fixed);
      client.lpush('person', fixed);
    }

    return res.json({ message: 'DONE!' });
  } catch (e) {
    console.log(e);
    return res.json({ message: `${e.message}` });
  }
});

/* count elements */
app.use('/.netlify/functions/api/person/count', async (req, res) => {
  try {
    console.log(`Handle path: ${req.originalUrl}`);
    if (req.path.length > 1) {
      res.send('404 NOT FOUND');
      return;
    }
    let count = await llen();
    res.send(`count of elements: ${count}`);
  } catch (e) {
    console.log(e);
    return res.json({ message: `${e.message}` });
  }
});

/* get person by inputted index */
app.use('/.netlify/functions/api/person/:index', async (req, res) => {
  try {
    console.log(`Handle path: ${req.originalUrl}`);
    if (req.path.length > 1) {
      res.send('404 NOT FOUND');
      return;
    }
    let index = req.params.index;
    console.log(index);

    let item = await client.lindex('person', index);
    return res.json({ name: `${item}` });
  } catch (e) {
    console.log(e);
    return res.json({ message: `${e.message}` });
  }
});

/* get list */
app.use('/.netlify/functions/api/person', async (req, res) => {
  try {
    let count = await llen();
    let list = await client.lrange('person', 0, count);
    let result = [];

    list.forEach((name) => {
      result.push({ name });
    });
    console.log(result);
    return res.json({ list: result });
  } catch (e) {
    console.log(e);
    return res.json({ message: `${e.message}` });
  }
});

app.use('/*', (req, res) => {
  console.log(`Handle path: ${req.originalUrl}`);
  res.send('404 NOT FOUND');
});

app.listen(port, () => console.log(`Server is running in ${port}`));

const handler = ServerlessHttp(app);

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
