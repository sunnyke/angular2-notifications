import { Component, EventEmitter, ViewEncapsulation, Input, Output } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
var SimpleNotificationsComponent = (function () {
    function SimpleNotificationsComponent(_service) {
        this._service = _service;
        this.onCreate = new EventEmitter();
        this.onDestroy = new EventEmitter();
        this.notifications = [];
        this.position = ['bottom', 'right'];
        // Received values
        this.lastOnBottom = true;
        this.maxStack = 8;
        this.preventLastDuplicates = false;
        this.preventDuplicates = false;
        // Sent values
        this.timeOut = 0;
        this.maxLength = 0;
        this.clickToClose = true;
        this.showProgressBar = true;
        this.pauseOnHover = true;
        this.theClass = '';
        this.rtl = false;
        this.animate = 'fromRight';
    }
    Object.defineProperty(SimpleNotificationsComponent.prototype, "options", {
        set: function (opt) {
            this.attachChanges(opt);
        },
        enumerable: true,
        configurable: true
    });
    SimpleNotificationsComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Listen for changes in the service
        this.listener = this._service.getChangeEmitter()
            .subscribe(function (item) {
            switch (item.command) {
                case 'cleanAll':
                    _this.notifications = [];
                    break;
                case 'clean':
                    _this.cleanSingle(item.id);
                    break;
                case 'set':
                    if (item.add)
                        _this.add(item.notification);
                    else
                        _this.defaultBehavior(item);
                    break;
                default:
                    _this.defaultBehavior(item);
                    break;
            }
        });
    };
    // Default behavior on event
    SimpleNotificationsComponent.prototype.defaultBehavior = function (value) {
        this.notifications.splice(this.notifications.indexOf(value.notification), 1);
        this.onDestroy.emit(this.buildEmit(value.notification, false));
    };
    // Add the new notification to the notification array
    SimpleNotificationsComponent.prototype.add = function (item) {
        item.createdOn = new Date();
        var toBlock = this.preventLastDuplicates || this.preventDuplicates ? this.block(item) : false;
        // Save this as the last created notification
        this.lastNotificationCreated = item;
        // Override icon if set
        if (item.override && item.override.icons && item.override.icons[item.type]) {
            item.icon = item.override.icons[item.type];
        }
        if (!toBlock) {
            // Check if the notification should be added at the start or the end of the array
            if (this.lastOnBottom) {
                if (this.notifications.length >= this.maxStack)
                    this.notifications.splice(0, 1);
                this.notifications.push(item);
            }
            else {
                if (this.notifications.length >= this.maxStack)
                    this.notifications.splice(this.notifications.length - 1, 1);
                this.notifications.splice(0, 0, item);
            }
            this.onCreate.emit(this.buildEmit(item, true));
        }
    };
    // Check if notifications should be prevented
    SimpleNotificationsComponent.prototype.block = function (item) {
        var toCheck = item.html ? this.checkHtml : this.checkStandard;
        if (this.preventDuplicates && this.notifications.length > 0) {
            for (var i = 0; i < this.notifications.length; i++) {
                if (toCheck(this.notifications[i], item)) {
                    return true;
                }
            }
        }
        if (this.preventLastDuplicates) {
            var comp = void 0;
            if (this.preventLastDuplicates === 'visible' && this.notifications.length > 0) {
                if (this.lastOnBottom) {
                    comp = this.notifications[this.notifications.length - 1];
                }
                else {
                    comp = this.notifications[0];
                }
            }
            else if (this.preventLastDuplicates === 'all' && this.lastNotificationCreated) {
                comp = this.lastNotificationCreated;
            }
            else {
                return false;
            }
            return toCheck(comp, item);
        }
        return false;
    };
    SimpleNotificationsComponent.prototype.checkStandard = function (checker, item) {
        return checker.type === item.type && checker.title === item.title && checker.content === item.content;
    };
    SimpleNotificationsComponent.prototype.checkHtml = function (checker, item) {
        return checker.html ? checker.type === item.type && checker.title === item.title && checker.content === item.content && checker.html === item.html : false;
    };
    // Attach all the changes received in the options object
    SimpleNotificationsComponent.prototype.attachChanges = function (options) {
        var _this = this;
        Object.keys(options).forEach(function (a) {
            if (_this.hasOwnProperty(a)) {
                _this[a] = options[a];
            }
            else if (a === 'icons') {
                _this._service.icons = options[a];
            }
        });
    };
    SimpleNotificationsComponent.prototype.buildEmit = function (notification, to) {
        var toEmit = {
            createdOn: notification.createdOn,
            type: notification.type,
            icon: notification.icon,
            id: notification.id
        };
        if (notification.html) {
            toEmit.html = notification.html;
        }
        else {
            toEmit.title = notification.title;
            toEmit.content = notification.content;
        }
        if (!to) {
            toEmit.destroyedOn = new Date();
        }
        return toEmit;
    };
    SimpleNotificationsComponent.prototype.cleanSingle = function (id) {
        var indexOfDelete = 0;
        var doDelete = false;
        this.notifications.forEach(function (notification, idx) {
            if (notification.id === id) {
                indexOfDelete = idx;
                doDelete = true;
            }
        });
        if (doDelete) {
            this.notifications.splice(indexOfDelete, 1);
        }
    };
    SimpleNotificationsComponent.prototype.ngOnDestroy = function () {
        if (this.listener) {
            this.listener.unsubscribe();
        }
    };
    return SimpleNotificationsComponent;
}());
export { SimpleNotificationsComponent };
SimpleNotificationsComponent.decorators = [
    { type: Component, args: [{
                selector: 'simple-notifications',
                encapsulation: ViewEncapsulation.None,
                template: "\n        <div class=\"simple-notification-wrapper\" [ngClass]=\"position\">\n            <simple-notification\n                *ngFor=\"let a of notifications; let i = index\"\n                [item]=\"a\"\n                [timeOut]=\"timeOut\"\n                [clickToClose]=\"clickToClose\"\n                [maxLength]=\"maxLength\"\n                [showProgressBar]=\"showProgressBar\"\n                [pauseOnHover]=\"pauseOnHover\"\n                [theClass]=\"theClass\"\n                [rtl]=\"rtl\"\n                [animate]=\"animate\"\n                [position]=\"i\"\n                >\n            </simple-notification>\n        </div>\n    ",
                styles: ["\n        .simple-notification-wrapper {\n            position: fixed;\n            width: 300px;\n            z-index: 1000;\n        }\n        \n        .simple-notification-wrapper.left { left: 20px; }\n        .simple-notification-wrapper.top { top: 20px; }\n        .simple-notification-wrapper.right { right: 20px; }\n        .simple-notification-wrapper.bottom { bottom: 20px; }\n        \n        @media (max-width: 340px) {\n            .simple-notification-wrapper {\n                width: auto;\n                left: 20px;\n                right: 20px;\n            }\n        }\n    "]
            },] },
];
/** @nocollapse */
SimpleNotificationsComponent.ctorParameters = function () { return [
    { type: NotificationsService, },
]; };
SimpleNotificationsComponent.propDecorators = {
    'options': [{ type: Input },],
    'onCreate': [{ type: Output },],
    'onDestroy': [{ type: Output },],
};
//# sourceMappingURL=simple-notifications.component.js.map