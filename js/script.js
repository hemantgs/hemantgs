/**
 * Created by GS on 2/18/2017.
 */

function onLoadFunction(){
    gapi.client.setApiKey('AIzaSyDvgd5CxBtwmEuudpIDh6F909Sa9oTRmZk');
    gapi.client.load('plus','v1',function(){});
}


window.fbAsyncInit = function() {
    FB.init({
        appId      : '1292497704171994',
        xfbml      : true,
        version    : 'v2.8'
    });
    FB.getLoginStatus(function(response){
        if(response.status === 'connected'){

        }
        else if (response.status === 'not_authorised'){

        }
        else {

        }
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));