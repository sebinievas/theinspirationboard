var stageId = "frame-canvas";
var app = {};

$(document).ready(function(){
    
    JooLib.initStage(stageId, AppConfig.STAGE.FRAME.width, AppConfig.STAGE.FRAME.height);
    $('#'+stageId+' canvas').each(function(){
        $(this).css('position', 'relative');
    });
    
    Tib.drawer.items = {
        'paperclips': ['paperclips-1.png'],
        'labels1': ['labels1-teal.png', 'labels1-white.png', 'labels1-pink.png', 'labels1-yellow.png', 'labels1-green.png'],
        'labels2': ['labels2-teal.png', 'labels2-yellow.png', 'labels2-green.png', 'labels2-grey.png', 'labels2-pink.png'],
        'clothespins': ['clothespins-1.png'],
        'pushpins': ['pushpins-teal.png','pushpins-pink.png','pushpins-yellow.png','pushpins-green.png', 'pushpins-grey.png'],
        'spool': ['spool-blue_dot.png', 'spool-green_check.png', 'spool-grey_chevron.png', 'spool-pink_stripes.png', 'spool-red_dot.png', 'spool-red_double.png', 'spool-yellow_check.png']
    };
    
    
    $('#tib-drawer .items .item span').draggable({
        revert: 'invalid',
        addClass: 'drawer-item',
        appendTo: 'body',
        cursorAt: {
            top: -10,
            left: -10
        },
        helper: function(e, ui){
            var itemType = $(this).attr('data-type');
            var items = Tib.drawer.items[itemType];
            var randomSlot = Math.floor(Math.random()*items.length);
            
            return $('<img src="'+AppConfig.RESOURCE_PATH+'images/drawer/items/'+Tib.drawer.items[itemType][randomSlot]+'" style="max-width: 150px;" />');
        },
        zIndex: 5000,
        containment: 'document'
    });
    $('#frame-canvas').droppable({
        accept: '.item span',
        drop: function(e,ui){
            var itemSrc = ui.helper.attr('src');
            var sOffset = JooLib.getStageOffset();
            var pos = {};
            pos.x = e.pageX - sOffset.left + ui.helper.width()/2;
            pos.y = e.pageY - sOffset.top + ui.helper.height()/2;
            JooLib.addToStage({
                type: 'image',
                url: itemSrc,
                position: { x: pos.x, y: pos.y, rotate: 0 },
                height: ui.helper.height(),
                width: ui.helper.width()
            });
            Tib.drawer.hide();
        }
    });
    
    $('#tib-drawer').hover(function(){
       Tib.drawer.show();
    }, function(){
       Tib.drawer.hide();
    });
    
    $('#myCanvas').draggable({
        containment: '#frame-canvas'
    });
    
    $('#frame-container').contextMenu({
        'menu': 'frame-menu',
        'beforeShow': function(){
            // hide all by default
            $('#frame-menu ul li.hidden').hide();
            
            selected = JooUtils.getSelectedObjects();
            
            if (selected.length > 0) { $('#frame-menu ul li.remove').show(); }
            if (selected.length > 1) { $('#frame-menu ul li.group').show(); }
            
        }
    }, function(action, el, pos){
        switch (action)
        {
            case 'change-background': {
                alert('change-background');
                break;
            }
            
            case 'change-frame': {
                alert('change-frame');
                break;
            }
            
            case 'change-text': {
                alert('change-text');
                break;
            }

            case 'change-image': {
                alert('change-image');
                break;
            }
            
            case 'group': {
                JooLib.groupSelectedItems();
                break;
            }
            
            case 'ungroup': {
                JooLib.unGroupSelection();
                break;
            }
            
            case 'remove': {
                JooLib.removeObject();
                break;
            }
        }
    });
    
    var background = $('#background-gallery').royalSlider({
        captionShowEffects:["fade"],
        controlNavThumbs: true,
        controlNavEnabled: true,
        controlNavThumbsNavigation: true,
        imageAlignCenter:true,
        directionNavEnabled: true,
        welcomeScreenEnabled: false,
        hideArrowOnLastSlide: true,
        afterSlideChange: function(){
            var slides = $('#background-gallery li.royalSlide');
            Tib.stage.selectedBackground = $(slides[this.currentSlideId]).attr('data-target');
            JooLib.setBackgroundImage(Tib.stage.selectedBackground);
        }
    }).data("royalSlider");
	    
    var frame = $('#frame-gallery').royalSlider({
        captionShowEffects:["fade"],
        controlNavThumbs: true,
        controlNavEnabled: true,
        controlNavThumbsNavigation: true,
        imageAlignCenter:true,
        directionNavEnabled: true,
        welcomeScreenEnabled: false,
        hideArrowOnLastSlide: true,
        afterSlideChange: function(){
            var slides = $('#frame-gallery li.royalSlide');
            Tib.stage.selectedFrame = $(slides[this.currentSlideId]).attr('data-target');
            JooLib.setFrameImage(Tib.stage.selectedFrame);
        }
    }).data("royalSlider");
    
    $('.fancybox').fancybox({
        centerOnScroll: true
    });
    
    
    $('a.control-picture').click(function(){
        mcImageManager.browse({
            relative: true,
            oninsert: function(data){
                var file = data.focusedFile;
                
                JooLib.addToStage({
                    type: 'image',
                    url: AppConfig.RESOURCE_PATH+'js/imagemanager/files/'+file.name,
                    position: { x: 100, y: 100, rotate: 0 },
                    height: file.custom.height,
                    width: file.custom.width
                });
            }
        });
    });
    
    $('.fancybox-wrapper').hide();
    
    $('#dialog-text form').submit(function(){
        JooLib.addText({
            text: $(this).find('#label_text').val()
        });
        $.fancybox.close();
        return false;
    });
    
    $('#trigger-createboard').click(function(){
       $.fancybox.open($('#dialog-create-board'));
    });
    
    $('#trigger-about').click(function(){
       $.fancybox.open($('#dialog-about'));
    });
    
    $('#trigger-credentials').click(function(){
       $.fancybox.open($('#dialog-credentials'));
    });
});
