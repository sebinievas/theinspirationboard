/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
jooCounter = 0;
AppConfig = {
    API: {
        LOAD :"ajax/load.php",
        SAVE: "ajax/save.php"
    },
    ROTATE_ICON: "images/rotateimage.png",
    ANCHOR_WIDTH: 8,
    ANCHOR_COLOR: "white",
    RESOURCE_PATH: "bundles/tibinspirationboard/",
    STAGE: {
        FRAME: {
            width: 860,
            height: 618
        },
        BACKGROUND:{
            width: 860,
            height: 623
        }
    }
}
AppConfig.ROTATE_ICON = AppConfig.RESOURCE_PATH+AppConfig.ROTATE_ICON;