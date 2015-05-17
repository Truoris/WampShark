function Subscribe(topic) {
    this.topic = topic;
    var color = getRandomColor();
    var ptr;

    this.callback = function (args, kwargs, details) {
        var data = JSON.stringify(args);
        var date = getCurrentTime();
        _dataList[_dataIndex] = JSON.stringify(args, undefined, 4);

        var html = '<tr onclick="displayData('+_dataIndex+', \''+this.topic+'\', \''+date+'\', \''+details.publisher+'\');" style="background-color: rgba('+color[0]+', '+color[1]+', '+color[2]+', 0.4);">'
        html += '<td>'+this.topic+'</td><td class="flow-col-date">'+date+'</td>';
        html += '<td class="flow-col-publisher">'+details.publisher+'</td><td class="flow-col-data"><span>'+data.slice(0, 34)+' ...</span></td></tr>';

        $('#listener').prepend(html);
        
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