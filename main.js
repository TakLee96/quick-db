var db = new Qdb('main');

var setLocal = function () {
    var value = document.getElementById('value').value;
    var key = document.getElementById('key').value;
    db.local.set(key, value);
    alert("local save success!");
};

var setRemote = function () {
    var value = document.getElementById('value').value;
    var key = document.getElementById('key').value;
    db.remote.set(key, value, function (err) {
        if (err) {
            alert(err); console.dir(err);
        } else {
            alert("remote save success!");
        }
    });
};

var getLocal = function () {
    var key = document.getElementById('key').value;
    var value = db.local.get(key);
    document.getElementById('local').innerHTML = value || 'null';
    alert("local retrieve success!");
};

var getRemote = function () {
    var key = document.getElementById('key').value;
    db.remote.get(key, function (err, value) {
        if (err) {
            alert(err); console.dir(err);
        } else {
            document.getElementById('remote').innerHTML = value || 'null';
            alert("remote retrieve success!");
        }
    });
};

var delLocal = function () {
    var key = document.getElementById('key').value;
    db.local.rm(key);
    alert("local delete success!")
};

var delRemote = function () {
    var key = document.getElementById('key').value;
    db.remote.rm(key, function (err) {
        if (err) {
            alert(err); console.dir(err);
        } else {
            alert("remote delete success!")
        }
    });
};