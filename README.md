QuickDB
=======

A lightweight and very-easy-to-use key-value pair database. Data can be stored permanently at the front end or asynchronously at the backend.

## How to use: ##

- Import

```
<script type="text/javascript" src="https://quick-db.herokuapp.com/quick-db.js"></script>```

- Usage

```
var db = new Qdb('your-userid-here');

db.local.set('arr', [1, 2, 3]);
db.local.get('arr'); // returns the array [1, 2, 3]
db.local.rm('arr');
db.local.clear();

db.remote.set('obj', {a: 1}, function (err) { ... });
db.remote.get('obj', function (err, obj) { ... }); // obj is the object {a: 1}
db.remote.rm('obj', function (err) { ... });
db.remove.clear(function (err) { ... });
```
