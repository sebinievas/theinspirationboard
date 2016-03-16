Tib = {
    getMaxZIndex: function(selector){
        var index = 0;
        selector.each(function(){
            if (parseInt($(this).css('z-index')) > index) index = parseInt($(this).css('z-index'));
        });
        return index;
    },
    drawer: {
        show: function(){
            $('#tib-drawer').animate({
                height: 305
            }, {
                queue: false
            });
        },
        hide: function(){
            $('#tib-drawer').animate({
                height: 84
            }, {
                queue: false
            });
        }
    },
    stage: {
        currentFrame: '',
        selectedFrame: '',
        currentBackground: '',
        selectedBackground: ''
    }
};