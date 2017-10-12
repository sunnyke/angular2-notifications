import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleNotificationsComponent } from './simple-notifications/components/simple-notifications.component';
import { NotificationComponent } from './simple-notifications/components/notification.component';
import { MaxPipe } from './simple-notifications/pipes/max.pipe';
import { NotificationsService } from './simple-notifications/services/notifications.service';
export * from './simple-notifications/interfaces/icons';
export * from './simple-notifications/components/simple-notifications.component';
export * from './simple-notifications/components/notification.component';
export * from './simple-notifications/pipes/max.pipe';
export * from './simple-notifications/services/notifications.service';
var SimpleNotificationsModule = (function () {
    function SimpleNotificationsModule() {
    }
    SimpleNotificationsModule.forRoot = function () {
        return {
            ngModule: SimpleNotificationsModule,
        };
    };
    return SimpleNotificationsModule;
}());
export { SimpleNotificationsModule };
SimpleNotificationsModule.decorators = [
    { type: NgModule, args: [{
                providers: [NotificationsService],
                imports: [
                    CommonModule
                ],
                declarations: [
                    SimpleNotificationsComponent,
                    NotificationComponent,
                    MaxPipe
                ],
                exports: [SimpleNotificationsComponent]
            },] },
];
/** @nocollapse */
SimpleNotificationsModule.ctorParameters = function () { return []; };
//# sourceMappingURL=simple-notifications.module.js.map