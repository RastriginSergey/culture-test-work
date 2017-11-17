#Test project for [culture.ru](www.culture.ru)

How to use:
===========

* **npm install** or **npm i** to install dependencies
* **npm start** to start server on *localhost:3000*
* **npm run test** to run mocha
* **mongolab** uses as a storage
* **server** has only one route and it's POST /

Acceptable params:
-----------------
* **url** - http://www.reddit.com/r/javascript/.json
* **command** can be on of ['sorting', 'aggregate']
* **field** by which we will sort our data
* **order** can be 'asc' or 'desc'
* **delimiter** for csv format, comma by default
* **format** can be on of ['sql', 'csv']
* **tableName** for the sql output, reddit by default

Projection fields are hardcoded by exercise
-------------------------------

For sorting:
------------
```
const fields = ['id', 'title', 'created_utc', 'score'];
```

For aggregate:
-------------
```angular2html
const fields = ['domain', 'count', 'score'];
```