function getCurrentTime() {
    var d = new Date();

    var heures = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();

    if (heures < 10) {
        heures = "0"+heures;
    }

    if (minutes < 10) {
        minutes = "0"+minutes;
    }

    if (seconds < 10) {
        seconds = "0"+seconds;
    }

    return heures+":"+minutes+":"+seconds;
}

function getRandomColor() {
    var r = Math.ceil(Math.random()*255);
    var g = Math.ceil(Math.random()*255);
    var b = Math.ceil(Math.random()*255);
    
    return [r, g, b];
}

function jsonHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="json-' + cls + '">' + match + '</span>';
    });
}

function displayError(err) {
	console.log(err);
	if (typeof err.kwargs.message != "undefined") {
		$.notify(err.kwargs.message, {
			 autoHide: false,
			 className: 'error'
		});
	} else if (typeof err.args[0] != "undefined") {
		$.notify(err.args[0], {
			 autoHide: false,
			 className: 'error'
		});
	} else {
		$.notify(err, {
			 autoHide: false,
			 className: 'error'
		});
	}
	
}