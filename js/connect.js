function wsConnectAnonymous(url, realm)
{
    var connectionPub = new autobahn.Connection({
        url: url,
        realm: realm
    });

    connectionPub.onopen = function (session) {
        wsPub = session;
    };

    connectionPub.onclose = function(reason, details) {
        loginError(reason);
    };

    connectionPub.open();


    var connectionSub = new autobahn.Connection({
        url: url,
        realm: realm
    });

    connectionSub.onopen = function (session) {
        wsSub = session;

        loginSuccess(url, realm);
    };

    connectionSub.onclose = function(reason, details) {
        loginError(reason);
    };

    connectionSub.open();
}
