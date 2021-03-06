import { ModuleWithProviders } from '@angular/core';
export * from './simple-notifications/interfaces/notification.type';
export * from './simple-notifications/interfaces/options.type';
export * from './simple-notifications/interfaces/icons';
export * from './simple-notifications/components/simple-notifications.component';
export * from './simple-notifications/components/notification.component';
export * from './simple-notifications/pipes/max.pipe';
export * from './simple-notifications/services/notifications.service';
export declare class SimpleNotificationsModule {
    static forRoot(): ModuleWithProviders;
}
