function dashboard() {
    var width = $( document ).width();
    var height = $( document ).height();
    
    var heightTopics = height-410;
    var heightRPC = height-150;
    var heightTopicList = heightTopics*(40/100);
    
    $('#box-topic-flow').height(heightTopics*(60/100));
    $('#box-topic-list').height(heightTopicList);
    
    $('#box-rpc-list').height(heightRPC);
    $('#box-session-list').height(heightRPC);
    
    
    $('#clear-listener').css('top', heightTopicList+115);


    // Popups //
    $('#addTopic').css('top', (height-$('#addTopic').height())/2);
    $('#addTopic').css('left', (width-$('#addTopic').width())/2);

    $('#pubTopic').css('top', (height-$('#pubTopic').height())/2);
    $('#pubTopic').css('left', (width-$('#pubTopic').width())/2);

    $('#rpc-popup').css('top', (height-$('#rpc-popup').height())/2);
    $('#rpc-popup').css('left', (width-$('#rpc-popup').width())/2);
}
