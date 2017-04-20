function login() {
    var url = $('#serv').val();
    var realm = $('#realm').val();
    var auth = $('#auth').val();

    if (auth == 'no') {
        $('#login-btn').html('...');
        wsConnectAnonymous(url, realm);
    } else if (auth == 'wampcra') {
        var id = {
            user: $('#user').val(),
            password: $('#password').val()
        }

        if (id.user != '' && id.password != '') {
            $('#login-btn').html('...');
            $('#user').val('');
            $('#password').val('');

            wsConnectWampcra(url, realm, id);
        }
    } else if (auth === 'ticket') {
        var id = {
            user: $('#user').val(),
            ticket: $('#ticket').val()
        }

        if (id.ticket != '') {
            $('#login-btn').html('...');

            wsConnectTicket(url, realm, id);
        }
    }
}

function loginSuccess(url, realm) {
    var history = JSON.parse(localStorage.history);

    if (history.urls.indexOf(url) <= -1) {
        history.urls.push(url);

    }

    if (history.realms.indexOf(realm) <= -1) {
        history.realms.push(realm);

    }

    localStorage.history = JSON.stringify(history);

    $('#login-page').hide();
    $('#login-margin').hide();
    $('#dashboard').show();

    $('#login-btn').html('Connection');

    $('#connection-state').html('You are connected on <a href="" class="logout glyphicon glyphicon-log-out" aria-hidden="true"></a><br>'+url+' (Realm : '+realm+')');

    displaySessions();
    getAllSubscription();
    runSubListener();
    getAllRpc();
}

function loginError(reason, details) {
    var msg = reason;
    if (details.message != null) {
        msg += '<br>'+details.message;
    }

    $('#login-btn').html('Connection');
    $('#connection-state').html('');
    $('#dashboard').hide();
    $('#login-margin').show();
    $('#login-page').show();

    $('#login-error').html('Error : '+msg);
    $('#login-error').show();

    subList = [];
    _dataList = [];
    _dataIndex = 0;
    _toggleAll = "sub";
    sessions_count = 0;
    _callURI = "";

    $('#sessions_list').html('');
    $('#rpc-list').html('');
    $('#topic-list').html('');
    $('#listener').html('');

    $("#suball").attr('class', 'glyphicon glyphicon-unchecked');
}

function changeAuthType() {
    var auth = $('#auth').val();

    if (auth === "wampcra" || auth === "ticket") {
        if (auth === "wampcra") {
            $(".pwinput").show();
            $(".tktinput").hide();
        } else {
            $(".pwinput").hide();
            $(".tktinput").show();
        }
        $('#auth-wampcra').show();
    } else {
        $('#auth-wampcra').hide();
    }
}

function getServersHistory() {
    if (!("history" in localStorage)) {
        localStorage.history = JSON.stringify({
            "realms": ["realm1"],
            "urls": ["ws://127.0.0.1:8080/ws"]
        });
    }

    var history = JSON.parse(localStorage.history);

    for (var each in history.urls) {
        $('#servers').append('<option>'+history.urls[each]+'</option>');
    }

    for (var each in history.realms) {
        $('#realms').append('<option>'+history.realms[each]+'</option>');
    }
}
