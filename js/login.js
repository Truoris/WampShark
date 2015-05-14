function login() {
    var url = $('#serv').val();
    var realm = $('#realm').val();
    var auth = $('#auth').val();

    if (auth == 'no') {
        $('#login-btn').html('...');
        wsConnectAnonymous(url, realm);
    }
}

function loginSuccess(url, realm) {
    $('#login-page').hide();
    $('#login-margin').hide();
    $('#dashboard').show();
    
    $('#login-btn').html('Connection');
    
    $('#connection-state').html('You are connected on<br>'+url+' (Realm : '+realm+')');

    displaySessions();
    getAllSubscription();
    runSubListener();
    getAllRpc();
}

function loginError(msg) {
    $('#login-btn').html('Connection');
    $('#connection-state').html('');
    $('#dashboard').hide();
    $('#login-margin').show();
    $('#login-page').show();

    $('#login-error').html('Connection close : '+msg);
    $('#login-error').show();
}