import { Subject } from 'rxjs/Subject';
import { NotificationEvent } from '../interfaces/notification-event.type';
import { Notification } from '../interfaces/notification.type';
import { Icons } from '../interfaces/icons';
export declare class NotificationsService {
    private emitter;
    icons: Icons;
    set(notification: Notification, to: boolean): Notification;
    getChangeEmitter(): Subject<NotificationEvent>;
    success(title: string, content?: string, override?: any): Notification;
    error(title: string, content?: string, override?: any): Notification;
    alert(title: string, content?: string, override?: any): Notification;
    info(title: string, content?: string, override?: any): Notification;
    warn(title: string, content?: string, override?: any): Notification;
    bare(title: string, content?: string, override?: any): Notification;
    create(title: string, content?: string, type?: string, override?: any): Notification;
    html(html: any, type?: string, override?: any): Notification;
    remove(id?: string): void;
}
