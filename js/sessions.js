var sessions_count = 0;

function newSession(res) {
    sessions_count++;
    $('#sessions_count').html(sessions_count);

    var ip = res.transport.peer.split(':')[1];
    
    var html = '<tr id="'+res.session+'"><td class="session-col-id">'+res.session+'</td>';
    
    html += '<td class="session-col-role">'+res.authrole+'</td><td>'+res.authmethod+'</td>';
    html += '<td class="session-col-ip">'+ip+'</td><td class="session-col-protocol">'+res.transport.type;
    html += '</td></tr>';

    $('#sessions_list').append(html);
}

function sessionOnJoin(res) {
    for (var each in res) {
        if (res[each] != wsSub.id && res[each] != wsPub.id) {
            newSession(res[each]);
        }
    }
}

function sessionOnLeave(res) {
    for (var each in res) {
        if (res[each] != wsSub.id && res[each] != wsPub.id) {
            sessions_count--;
            $('#sessions_count').html(sessions_count);

            $('#'+res[each]).remove();
        }
    }
}

function displaySessions() {
    wsPub.call("wamp.session.list").then(
        function (res) {
            for (var each in res) {
                if (res[each] != wsSub.id && res[each] != wsPub.id) {
                    wsPub.call("wamp.session.get", [res[each]]).then(
                        function (res) {
                            newSession(res);
                        },
                        displayError
                    );
                }
            }
        },
        displayError
    );

    wsPub.subscribe('wamp.session.on_join', sessionOnJoin);
    wsPub.subscribe('wamp.session.on_leave', sessionOnLeave);
}

