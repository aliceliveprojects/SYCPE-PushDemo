window.FCMKEY = "key=AAAA2MBUecI:APA91bG4FOVHW4VDmlWud27Xh6hK5bGxcdfIl1cfGRETw-M24ElT1VvglHn3z3TSKUiGwzOquhDhE_1kgZHiBKFRF4SdH2bfKhU60OcRz8_yGAag6AJBqt4QSlkBRYInZhB7QksDKHa8";

(function() {
  'use strict';
  console.log("pushSrvc executed");

  angular
    .module('push', [])
    .factory('pushSrvc', pushSrvc)
  ;

  pushSrvc.$inject = [
//    '$q',
//    '$timeout',
//    '$sce',
    '$http'
  ];
  function pushSrvc(
//    $q,
//    $timeout,
//    $sce,
    $http,
  ) {
    var service = {};

    service.push = undefined;
    service.registrationId = undefined;
    service.callbackHandler = undefined;

    service.initialisePush = function initialisePush( registeredCallback ) {
      service.push = PushNotification.init({
        android:{}
      });
      service.push.on('registration',function(data){
        console.log("push.registration event, ", data);
        console.log("DEVICE ID: "+data.registrationId);
        service.registrationId = data.registrationId;
        if( registeredCallback !== undefined ) {
          //service.setCallback( registeredCallback );
          registeredCallback( data );
        }
      });
      service.push.on('notification', function(data){
        console.log("push.notification event, ", data);
        service.callbackHandler( data );
      });

      service.push.on('error', function (error) {
        console.log(error);
      });
    };

    service.send = function send( recipient, title,  payload ) {
      var encodedPayload = JSON.stringify({
        'to': recipient,
        'title': title,
        'message': payload,
        'foreground': 'false',
        'coldstart': 'true',
        'content-available': '1',
        'data': payload,
        'priority': 'high'
      });
      var headers = {
        'Content-Type':'application/json',
        'Authorization':'key='+window.FCMKEY
      };
      console.log("sending "+encodedPayload);
      $http.post('https://fcm.googleapis.com/fcm/send',
                 encodedPayload,
                 headers ).then(
                   function success(result) {
                     console.log('POSTED SUCCESS', result);
                   },
                   function fail( error ) {
                     console.log("POSTED WITH PROVISIOS", error);
                   }
                 );
    };

    service.setCallback = function setCallback( handler ) {
      service.callbackHandler = handler;
    };

    return service;
  }

})();
