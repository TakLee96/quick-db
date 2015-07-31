var Qdb = (function () {

    if (window.localStorage) {
        var Local = function (userid) {
            this.userid = userid;
        };
        Local.prototype.set = function (name, obj) {
            localStorage.setItem(this.userid + "." + name, JSON.stringify(obj));
        };
        Local.prototype.get = function (name) {
            return JSON.parse(localStorage.getItem(this.userid + "." + name));
        };
        Local.prototype.rm = function (name) {
            return localStorage.removeItem(this.userid + "." + name);
        };
        Local.prototype.clear = function () {
            localStorage.clear();
        };
    } else {
        console.error("Sorry, quick-db requires localStorage support of browser");
        return null;
    }

    var BASE_URL = "https://quick-db.herokuapp.com/";

    var request = function (userid, method, data, callback) {
        var xhr = new XMLHttpRequest();
        var url = BASE_URL + userid;
        xhr.open(method, url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(null, xhr.responseText);
                } else {
                    callback(new Error(method + " request to " + url + " failed with status " + xhr.status));
                }
            }
        };
        xhr.ontimeout = function () {
            callback(new Error(method + " request to " + url + " timed out"));
        };
        if (data) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    };

    var Remote = function (userid) {
        this.userid = userid;
    };
    Remote.prototype.set = function (name, obj, callback) {
        request(this.userid, 'POST', { name: name, obj: obj }, callback);
    };
    Remote.prototype.get = function (name, callback) {
        request(this.userid, 'GET', { name: name }, callback);
    };
    Remote.prototype.rm = function (name, callback) {
        request(this.userid, 'DELETE', name, callback);
    };
    Remote.prototype.clear = function (callback) {
        request(this.userid, 'DELETE', null, callback);
    };

    return function (userid) {
        this.local = new Local(userid);
        this.remote = new Remote(userid);
    };
})();