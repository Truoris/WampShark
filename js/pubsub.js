var subList = [];
var _dataList = [];
var _dataIndex = 0;
var _toggleAll = "sub";
var _topic;

function checkTopic(topic, sub) {
    $('#check-sub-'+sub.getTopicID()).prop('checked', true);
    
    addPtrToList(topic, sub);
}

function addPtrToList(topic, sub) {
    subList[topic] = sub.getPtr();
}

function addTopic() {
    var topic = $('#sub-topic').val();

	if (!(topic in subList)) {
		var sub = new Subscribe(topic);

    	setTimeout(addPtrToList, 500, topic, sub);
	}
	
    $('#addTopic').modal('hide')
    $('#sub-topic').val('');
}

function changeTopicSub(topic, id) {
    if($('#check-sub-'+id).is(":checked")) {
        subscribeTopic(topic);
    } else {
        stopListener(topic);
    }
}

function subscribeTopic(topic) {
    if (!(topic in subList)) {
		var sub = new Subscribe(topic);

    	setTimeout(addPtrToList, 500, topic, sub);
	}
}

function topicPublish(topic) {
    _topic = topic;

    $('#topic-name').html(topic);
    $('#pubTopic').modal('show');
}

function pubTopicClose() {
    $('#pubTopic').hide();
}

function pubTopicExec() {
    var args = [];

    for(var i=1 ; i<=5 ; i++) {
        var value = $('#pub-arg'+i).val();

        if (value != "") {
            args.push(value);
        }
    }

    wsPub.publish(_topic, args, {}, {acknowledge: true}).then(
	   function (res) {},
	   displayError
	);
	
    $('#pubTopic').modal('hide');
}

function stopListener(topic) {
    wsSub.unsubscribe(subList[topic]);
    delete subList[topic];
}

function onCreate(args) {
    var details = args[1];

    wsPub.call("wamp.subscription.list_subscribers", [details.id]).then(
        function (sessions) {
            for (var i in sessions) {
                if (sessions[i] == wsSub.id || sessions[i] == wsPub.id) {
                    delete sessions[i];
                }
            }

            details.subscribers = sessions;

            newTopic(details);
        },
        displayError
    );
}

function onDelete(args) {
    for (var each in args) {
        $('#'+args[each]).remove();
    }
}

function onSubscribe(args) {
    var sessionID = args[0];
    var topicID = args[1];

    if (sessionID != wsSub.id && sessionID != wsPub.id) {
        var subscribers = parseInt($('#subscribers-list-'+topicID).html());
        $('#subscribers-list-'+topicID).html(subscribers+1);
    }
}

function onUnsubscribe(args) {
    var sessionID = args[0];
    var topicID = args[1];

    if (sessionID != wsSub.id && sessionID != wsPub.id) {
        var subscribers = parseInt($('#subscribers-list-'+topicID).html());
        $('#subscribers-list-'+topicID).html(subscribers-1);
    }
}

function newTopic(details) {
    var html = '<tr id="'+details.id+'"><td class="topic-col-sub"><input type="checkbox" id="check-sub-'+details.id+'" onchange="changeTopicSub(\''+details.uri+'\', \''+details.id+'\')"></td><td>'+details.uri+'</td>';
    html += '<td class="topic-col-created">'+details.created+'</td>';
    html += '<td class="topic-col-subscribers"><span id="subscribers-list-'+details.id+'" class="sessions-details" onclick="getSessionsDetails(\''+details.uri+'\', \''+details.id+'\', \'sub\');">' + 
    			details.subscribers.length+'</span></td>';
    html += '<td class="topic-col-actions"><button class="btn btn-info btn-compact" onclick="topicPublish(\''+details.uri+'\');">Publish</button></td>';
    html += '</tr>';

    $('#topic-list').append(html);

    //subscribeTopic(details.uri)
}

function getAllSubscription() {
    wsPub.call("wamp.subscription.list").then(
        function (list) {
            for (var each in list.exact) {
                wsPub.call("wamp.subscription.get", [list.exact[each]]).then(
                    function (res) {
                        wsPub.call("wamp.subscription.list_subscribers", [res.id]).then(
                            function (sessions) {
                                for (var i in sessions) {
                                    if (sessions[i] == wsSub.id || sessions[i] == wsPub.id) {
                                        delete sessions[i];
                                    }
                                }

                                res.subscribers = sessions;

                                newTopic(res);
                            },
                            displayError
                        );
                    },
                    displayError
                );
            }
        },
        displayError
    );
}

function runSubListener() {
    wsPub.subscribe('wamp.subscription.on_create', onCreate).then(
    	function (res) {},
    	displayError
    );
    wsPub.subscribe('wamp.subscription.on_delete', onDelete).then(
    	function (res) {},
    	displayError
    );
    wsPub.subscribe('wamp.subscription.on_subscribe', onSubscribe).then(
    	function (res) {},
    	displayError
    );
    wsPub.subscribe('wamp.subscription.on_unsubscribe', onUnsubscribe).then(
    	function (res) {},
    	displayError
    );
}

function displayData (index, topic, date, publisher) {
    $('#json-data').html(jsonHighlight(_dataList[index]));
    
    var html = '<p><strong>Topic :</strong> '+topic+'</p>';
    html += '<p><strong>Date :</strong> '+date+'</p>';
    html += '<p><strong>Publisher :</strong> '+publisher+'</p>';
    
    $('#topic-info').html(html);
}

function clearListener() {
    $('#listener').html('');
    _dataIndex = 0;
}

function suballTopic() {
    var topicList = [];
    
    if (_toggleAll == "sub") {
    	_toggleAll  = "unsub";
        $("#suball").attr('class', 'glyphicon glyphicon-check');
        wsPub.call("wamp.subscription.list").then(
            function (list) {
                for (var each in list.exact) {
                    wsPub.call("wamp.subscription.get", [list.exact[each]]).then(
                        function (res) {
                            if (typeof subList[res.uri] === "undefined") {
                                subscribeTopic(res.uri);
                                $('#check-sub-'+res.id).prop('checked', true);
                            }
                        },
                        displayError
                    );
                }
            },
            displayError
        );   
    } else if (_toggleAll == "unsub") {
    	_toggleAll  = "sub";
    	$("#suball").attr('class', 'glyphicon glyphicon-unchecked');
        for (var topic in subList) {
        	$('#check-sub-'+subList[topic].id).prop('checked', false);
        	stopListener(topic);
        }
    }
}

function getSessionsDetails(uri, id, domain) {
	$('#sessions-details-list').html('');
	var target = '';
	
	if (domain == "sub") {
		$('#sessions-details-title').html('Subscribers list for '+uri);
		target = 'wamp.subscription.list_subscribers';
	} else if (domain == "rpc") {
		$('#sessions-details-title').html('Callees list for '+uri);
		target = 'wamp.registration.list_callees';
	} 
	
	wsPub.call(target, [parseInt(id)]).then(
        function (sessions) {
            for (var i in sessions) {
                if (sessions[i] != wsSub.id && sessions[i] != wsPub.id) {
                    wsPub.call("wamp.session.get", [sessions[i]]).then(
                    	function (details) {
                    		var ip = details.transport.peer.split(':')[1];
                    		
                    		var html = '<tr><td class="session-col-id">'+details.session+'</td>';
						    html += '<td class="session-col-role">'+details.authrole+'</td><td>'+details.authmethod+'</td>';
						    html += '<td class="session-col-ip">'+ip+'</td><td class="session-col-protocol">'+details.transport.type;
						    html += '</td></tr>';
						    
						    $('#sessions-details-list').append(html);
                    	},
                    	displayError
                	);
                } 
            }
           	
           	$('#sessionsDetails').modal('show');
        },
        displayError
    );
}
