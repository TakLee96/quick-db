var Qdb = (function () {

    if (window.localStorage) {
        var local = {};
        local.set = function (name, obj) {
            localStorage.setItem(name, JSON.stringify(obj));
        };
        local.get = function (name) {
            return JSON.parse(localStorage.getItem(name));
        };
        local.rm = function (name) {
            return localStorage.removeItem(name);
        };
        local.clear = function () {
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
        request('GET', name, callback);
    };
    Remote.prototype.rm = function (name, callback) {
        request('DELETE', name, callback);
    };
    Remote.prototype.clear = function (callback) {
        request('DELETE', null, callback);
    };

    return function (userid) {
        this.local = local;
        this.remote = new Remote(userid);
    };
})();