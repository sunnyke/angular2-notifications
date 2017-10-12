import { NgModule } from '@angular/core';
import { PushNotificationsService } from './push-notifications/services/push-notifications.service';
export * from './push-notifications/services/push-notifications.service';
var PushNotificationsModule = (function () {
    function PushNotificationsModule() {
    }
    return PushNotificationsModule;
}());
export { PushNotificationsModule };
PushNotificationsModule.decorators = [
    { type: NgModule, args: [{
                providers: [PushNotificationsService],
                exports: []
            },] },
];
/** @nocollapse */
PushNotificationsModule.ctorParameters = function () { return []; };
//# sourceMappingURL=push-notifications.module.js.map