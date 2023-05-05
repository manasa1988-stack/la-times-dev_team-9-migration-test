var AdSS = AdSS || {};
AdSS.Ssor = AdSS.Ssor || {};

AdSS.getCookie = function (name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  }
  else {
    begin += 2;
  }
  var end = document.cookie.indexOf(";", begin);
  if (end == -1) {
    end = dc.length;
  }
  return unescape(dc.substring(begin + prefix.length, end));
};

AdSS.removeCookie = function (name)
{
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + location.host + ";";
}

AdSS.Ssor = new function () {
  // Create IE + others compatible event handler
  var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  var meteringCookieIntervalTimeout = 250,
    meteringCookieIntervalMaxCnt = 5000 / meteringCookieIntervalTimeout, // 5 seconds
    hideMessageIntervalInMS = 9000; // 9 seconds
  var reloadTriggered = false;

  // waits for c_mli cookie to be set before submitting form (if on login page) or refreshing page
  // ideally, reg_after_login is only fired after c_mli cookie is set, but that is not currently the case (2/13/2013)
  this.refreshAfterTrueLogin = function () {
      // if the user is on the login page, the login form will be submitted, which will call AuthenticateAndRedirect
      // if not on the login page, we need to ensure the user's master id is associated with his orders, so we call authenticate
      meteringCookieIntervalCurrentCnt = 4500;
    var isUserLoggedIn = registration.user.isLoggedIn();
    //TODO: Find out true value
      var isUserOnLoginPage = this.isUserOnLoginPage();

      if (!isUserOnLoginPage) {
          if (!reloadTriggered && isUserLoggedIn) {
            var zip = registration.user.getZipCode();
            if(zip !== ""  && zip.length > 0){
                reloadTriggered = true;
                window.location.reload();
                meteringCookieIntervalCurrentCnt = 0;
            }
          }
      }

      var meteringCookieIntervalHandle = setInterval(function () {
          if (isUserOnLoginPage) {
              clearInterval(meteringCookieIntervalHandle);
          }
          AdSS.Ssor.UserLoginUpdates();

      }, meteringCookieIntervalTimeout);
  };

  this.isUserOnLoginPage = function () {
    var path = window.location.pathname;
    return (path.indexOf("/login") >= 0);
  };

};

AdSS.Ssor.SsorManager = function () {
  var eventManager = registration.events;
    this.loginUser = function () {
        // requires c_mId to exist. sets required cookies after login, e.g. c_mli
        var encmId = AdSS.getCookie('c_mId');

        if (encmId) {
            registration.manager.user.login(encmId);
            eventManager.fire('reg_after_login');
        }
    };
    this.initLoginHeader = function () {
        AdSS.Ssor.UserLoginUpdates();
      registration.nav.signUpHandler = function () {
        if ($('.reg-close').length > 0) {
          $('.reg-close').click();
        }        
      };

      eventManager.on('reg_after_login', function () {
        console.log('reg_after_login is fired');
        AdSS.Ssor.refreshAfterTrueLogin();
      });

      eventManager.on('reg_after_logout', function () {
        console.log('reg_after_logout is fired');  
        var encmId = AdSS.getCookie('c_mId');
        console.log(encmId);
        if (!encmId) {
          var returnUrl = window.location.pathname;
          window.location.href = '/login?return=' + returnUrl;
        }
      });

    };
};

AdSS.Ssor.UserLoginUpdates = function ()
{
    var isUserLoggedIn = registration.user.isLoggedIn();
    if (isUserLoggedIn) {
        $("#mobLogin1").html();
        $("#mobLogin1").attr("class", "signoutUser");
        $("#mobLogin1").attr("href", "#");
        $("#mobLogin1").attr("data-reg-handler", "signOutHandler");
        $("#mobLogin1").attr("data-reg-text", "Sign Out");
        $("#spanLogin").hide();
        $("#mobLogin2").hide();
    }
}

window.onload = function () {
    if (typeof(registration) != 'undefined') {
        var ssorMgr = new AdSS.Ssor.SsorManager();
        ssorMgr.initLoginHeader();

        $('#mobLogin1.signoutUser').click(() => {

            AdSS.removeCookie('c_mId');
            window.location.reload();
        });

        var loginSection = $('#adss-userSection .zone-user-section');
        if (loginSection.length > 0) {
            $('#sslUser').prependTo(loginSection);
            $('#sslUser').show();
            if ($('#sslUser #sslMiniModal').length > 0 || $('#sslUser.ssor4').length > 0) {
                $('#sslUser').attr('style', "display:block !important");
            }
            if ($('#sslMiniModal').length > 0) {
                $('#sslUser').click(function () {
                    $('#sslMiniModal', this).toggle();
                });
            }
        }

        var data = $('#sslUser div.menu > a:nth-of-type(3)').attr("data-reg-username")
        if (data && data.trim().length > 0) {
            var liUserName = "<li class=\"mobileMenu-visible-only\"><a href=\"#\" style=\"cursor:default\">" + data + "</a></li>";
            $(liUserName).insertBefore($("#mobLogin1").parent());
        }

    }
 }


$(function(){
    $(document).keydown(function (t) {
        t.ctrlKey && t.altKey && t.shiftKey && $("#adssVersion").toggle();

        t.ctrlKey && t.altKey && t.shiftKey && $("#adminMenu").toggle();
    });
});
