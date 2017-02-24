/**
 * Created by GS on 2/18/2017.
 */

function onLoadFunction(){
    gapi.client.setApiKey('AIzaSyDvgd5CxBtwmEuudpIDh6F909Sa9oTRmZk');
    gapi.client.load('plus','v1',function(){});
}
