# test-redis
---
This app is test Redis on NodeJS. List is used in database.

---
# Functions

- Use database (Redis);
- Get list;
- Get count of elements;
- Get element of list by inputted index;
- Push element/elements into list;
- Remove element from list;
- Set element of list;
- Handle wrong path (404 NOT FOUND);
- Can delete spaces before and after ',' during execute command lpush;
- Has index.html to explain about commands.
---
# Commands

- [Lrange](https://redis.io/commands/lrange/) - get all elements of list (path: /.netlify/functions/api/person/). Command in Redis: LRANGE person 0 n (also this argument may be -1) - where 'n' is count of elements;
- [Llen](https://redis.io/commands/llen/) - get count of list's elements (path: /.netlify/functions/api/person/count);
- [Lindex](https://redis.io/commands/lindex/) - get element of list by inputted index (path: /.netlify/functions/api/person/:index - where ':index' is inputted index);
- [Lset](https://redis.io/commands/lset/) - set inputted element by required index (path: /.netlify/functions/api/person/lset/:index/:elem - where ':index' is required index, ':elem' is inputted element);
- [Lrem](https://redis.io/commands/lrem/) - remove inputted element 1 time (path: /.netlify/functions/api/person/lrem/:elem - where ':elem' is element what you need to remove from list). Command in Redis: LREM person -1 element - where 'element' is inputted element;
- [Lpush](https://redis.io/commands/lpush/) - push inputted element/elements into begin of list (path: /.netlify/functions/api/person/lpush/:elem - where ':elem' is new element or array of new elements). Command in Redis (one element): LPUSH person element - where 'element' is inputted element. Command in Redis (few elements): LPUSH person element1 element2 ... - where 'element1' is first inputted element, where 'element2' is second inputted element, where '...' is infinite count of new elements (depends on your wish).
---
# Example of use Lpush in browser

One element: /person/lpush/test

Few elements: /person/lpush/test1,test2

---
# Used stack technology 
- NodeJS;
- Redis;
- HTML;
- JS;
- Libraries: dotenv, Express, ioredis, node-fetch.
---
[URL](https://test-api-redis.netlify.app/) .