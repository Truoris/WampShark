function Subscribe(topic) {
    this.topic = topic;
    var color = getRandomColor();
    var ptr;

    this.callback = function (args, kwargs, details) {
      console.log({ args, kwargs, details });
        var dataObj = args.length ? args : kwargs;
        var data = JSON.stringify(dataObj, undefined, 1);
        var date = getCurrentTime();
        var idx = _dataIndex;
        _dataList[idx] = JSON.stringify(dataObj, undefined, 4);

        var tr = $('<tr>', { class: 'flow-tr' });
        tr.css('background-color', 'rgba('+color[0]+', '+color[1]+', '+color[2]+', 0.4)');
        tr.click(function() { displayData(idx, topic, date, details.publisher); });
        
        $('<td>', { class: 'flow-col-topic', text: topic }).appendTo(tr);
        $('<td>', { class: 'flow-col-date', text: date }).appendTo(tr);
        $('<td>', { class: 'flow-col-publisher', text: '' + details.publisher }).appendTo(tr);
        $('<td>', { class: 'flow-col-data', text: data.substr(0, 120) }).appendTo(tr);

        $('#listener').prepend(tr);
        
        _dataIndex++;
    };

    this.getPtr = function() {
        return ptr;
    };
    this.getTopicID = function() {
        return ptr.id;
    };
    

    wsSub.subscribe(topic, this.callback).then(
        function (sub) {
            ptr = sub;
        },
    	displayError
    );
}
