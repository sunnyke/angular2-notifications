import { ChangeDetectorRef, Component, Input, NgZone, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService } from '../services/notifications.service';
var NotificationComponent = (function () {
    function NotificationComponent(notificationService, domSanitizer, changeRef, zone) {
        var _this = this;
        this.notificationService = notificationService;
        this.domSanitizer = domSanitizer;
        this.changeRef = changeRef;
        this.zone = zone;
        // Progress bar variables
        this.progressWidth = 0;
        this.stopTime = false;
        this.count = 0;
        this.instance = function () {
            _this.diff = (new Date().getTime() - _this.start) - (_this.count * _this.speed);
            if (_this.count++ === _this.steps)
                _this.remove();
            else if (!_this.stopTime) {
                if (_this.showProgressBar)
                    _this.progressWidth += 100 / _this.steps;
                _this.timer = setTimeout(_this.instance, (_this.speed - _this.diff));
            }
            _this.zone.run(function () { return _this.changeRef.detectChanges(); });
        };
    }
    NotificationComponent.prototype.ngOnInit = function () {
        if (this.item.override) {
            this.attachOverrides();
        }
        if (this.animate) {
            this.item.state = this.animate;
        }
        if (this.timeOut !== 0) {
            this.startTimeOut();
        }
        this.safeSvg = this.domSanitizer.bypassSecurityTrustHtml(this.icon || this.item.icon);
    };
    NotificationComponent.prototype.startTimeOut = function () {
        var _this = this;
        this.steps = this.timeOut / 10;
        this.speed = this.timeOut / this.steps;
        this.start = new Date().getTime();
        this.zone.runOutsideAngular(function () { return _this.timer = setTimeout(_this.instance, _this.speed); });
    };
    NotificationComponent.prototype.onEnter = function () {
        if (this.pauseOnHover) {
            this.stopTime = true;
        }
    };
    NotificationComponent.prototype.onLeave = function () {
        var _this = this;
        if (this.pauseOnHover) {
            this.stopTime = false;
            this.zone.runOutsideAngular(function () { return setTimeout(_this.instance, (_this.speed - _this.diff)); });
        }
    };
    NotificationComponent.prototype.setPosition = function () {
        return this.position !== 0 ? this.position * 90 : 0;
    };
    NotificationComponent.prototype.onClick = function ($e) {
        this.item.click.emit($e);
        if (this.clickToClose) {
            this.remove();
        }
    };
    // Attach all the overrides
    NotificationComponent.prototype.attachOverrides = function () {
        var _this = this;
        Object.keys(this.item.override).forEach(function (a) {
            if (_this.hasOwnProperty(a)) {
                _this[a] = _this.item.override[a];
            }
        });
    };
    NotificationComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
    };
    NotificationComponent.prototype.remove = function () {
        var _this = this;
        if (this.animate) {
            this.item.state = this.animate + 'Out';
            setTimeout(function () {
                _this.notificationService.set(_this.item, false);
            }, 310);
        }
        else {
            this.notificationService.set(this.item, false);
        }
    };
    return NotificationComponent;
}());
export { NotificationComponent };
NotificationComponent.decorators = [
    { type: Component, args: [{
                selector: 'simple-notification',
                encapsulation: ViewEncapsulation.None,
                animations: [
                    trigger('enterLeave', [
                        // Enter from right
                        state('fromRight', style({ opacity: 1, transform: 'translateX(0)' })),
                        transition('* => fromRight', [
                            style({ opacity: 0, transform: 'translateX(5%)' }),
                            animate('400ms ease-in-out')
                        ]),
                        state('fromRightOut', style({ opacity: 0, transform: 'translateX(-5%)' })),
                        transition('fromRight => fromRightOut', [
                            style({ opacity: 1, transform: 'translateX(0)' }),
                            animate('300ms ease-in-out')
                        ]),
                        // Enter from left
                        state('fromLeft', style({ opacity: 1, transform: 'translateX(0)' })),
                        transition('* => fromLeft', [
                            style({ opacity: 0, transform: 'translateX(-5%)' }),
                            animate('400ms ease-in-out')
                        ]),
                        state('fromLeftOut', style({ opacity: 0, transform: 'translateX(5%)' })),
                        transition('fromLeft => fromLeftOut', [
                            style({ opacity: 1, transform: 'translateX(0)' }),
                            animate('300ms ease-in-out')
                        ]),
                        // Rotate
                        state('scale', style({ opacity: 1, transform: 'scale(1)' })),
                        transition('* => scale', [
                            style({ opacity: 0, transform: 'scale(0)' }),
                            animate('400ms ease-in-out')
                        ]),
                        state('scaleOut', style({ opacity: 0, transform: 'scale(0)' })),
                        transition('scale => scaleOut', [
                            style({ opacity: 1, transform: 'scale(1)' }),
                            animate('400ms ease-in-out')
                        ]),
                        // Scale
                        state('rotate', style({ opacity: 1, transform: 'rotate(0deg)' })),
                        transition('* => rotate', [
                            style({ opacity: 0, transform: 'rotate(5deg)' }),
                            animate('400ms ease-in-out')
                        ]),
                        state('rotateOut', style({ opacity: 0, transform: 'rotate(-5deg)' })),
                        transition('rotate => rotateOut', [
                            style({ opacity: 1, transform: 'rotate(0deg)' }),
                            animate('400ms ease-in-out')
                        ])
                    ])
                ],
                template: "\n        <div class=\"simple-notification\"\n            [@enterLeave]=\"item.state\"\n            (click)=\"onClick($event)\"\n            [class]=\"theClass\"\n\n            [ngClass]=\"{\n                'alert': item.type === 'alert',\n                'error': item.type === 'error',\n                'warn': item.type === 'warn',\n                'success': item.type === 'success',\n                'info': item.type === 'info',\n                'bare': item.type === 'bare',\n                'rtl-mode': rtl\n            }\"\n\n            (mouseenter)=\"onEnter()\"\n            (mouseleave)=\"onLeave()\">\n\n            <div *ngIf=\"!item.html\">\n                <div class=\"sn-title\">{{item.title}}</div>\n                <div class=\"sn-content\">{{item.content | max:maxLength}}</div>\n\n                <div class=\"icon\" *ngIf=\"item.icon !== 'bare'\" [innerHTML]=\"safeSvg\"></div>\n            </div>\n            <div *ngIf=\"item.html\" [innerHTML]=\"item.html\"></div>\n\n            <div class=\"sn-progress-loader\" *ngIf=\"showProgressBar\">\n                <span [ngStyle]=\"{'width': progressWidth + '%'}\"></span>\n            </div>\n\n        </div>\n    ",
                styles: ["\n        .simple-notification {\n            width: 100%;\n            padding: 10px 20px;\n            box-sizing: border-box;\n            position: relative;\n            float: left;\n            margin-bottom: 10px;\n            color: #fff;\n            cursor: pointer;\n            transition: all 0.5s;\n        }\n\n        .simple-notification .sn-title {\n            margin: 0;\n            padding: 0 50px 0 0;\n            line-height: 30px;\n            font-size: 20px;\n        }\n\n        .simple-notification .sn-content {\n            margin: 0;\n            font-size: 16px;\n            padding: 0 50px 0 0;\n            line-height: 20px;\n        }\n\n        .simple-notification .icon {\n            position: absolute;\n            box-sizing: border-box;\n            top: 0;\n            right: 0;\n            width: 70px;\n            height: 70px;\n            padding: 10px;\n        }\n\n        .simple-notification .icon svg {\n            fill: #fff;\n            width: 100%;\n            height: 100%;\n        }\n\n        .simple-notification .icon svg g {\n            fill: #fff;\n        }\n\n        .simple-notification.rtl-mode {\n            direction: rtl;\n        }\n\n        .simple-notification.rtl-mode .sn-content {\n            padding: 0 0 0 50px;\n        }\n\n        .simple-notification.rtl-mode svg {\n            left: 0;\n            right: auto;\n        }\n\n        .simple-notification.error { background: #F44336; }\n        .simple-notification.success { background: #8BC34A; }\n        .simple-notification.alert { background: #ffdb5b; }\n        .simple-notification.info { background: #03A9F4; }\n        .simple-notification.warn { background: #ffdb5b; }\n\n        .simple-notification .sn-progress-loader {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 5px;\n        }\n\n        .simple-notification .sn-progress-loader span {\n            float: left;\n            height: 100%;\n        }\n\n        .simple-notification.success .sn-progress-loader span { background: #689F38; }\n        .simple-notification.error .sn-progress-loader span { background: #D32F2F; }\n        .simple-notification.alert .sn-progress-loader span { background: #edc242; }\n        .simple-notification.info .sn-progress-loader span { background: #0288D1; }\n        .simple-notification.warn .sn-progress-loader span { background: #edc242; }\n        .simple-notification.bare .sn-progress-loader span { background: #ccc; }\n\n        .simple-notification.warn div .sn-title { color: #444; }\n        .simple-notification.warn div .sn-content { color: #444; }\n    "]
            },] },
];
/** @nocollapse */
NotificationComponent.ctorParameters = function () { return [
    { type: NotificationsService, },
    { type: DomSanitizer, },
    { type: ChangeDetectorRef, },
    { type: NgZone, },
]; };
NotificationComponent.propDecorators = {
    'timeOut': [{ type: Input },],
    'showProgressBar': [{ type: Input },],
    'pauseOnHover': [{ type: Input },],
    'clickToClose': [{ type: Input },],
    'maxLength': [{ type: Input },],
    'theClass': [{ type: Input },],
    'rtl': [{ type: Input },],
    'animate': [{ type: Input },],
    'position': [{ type: Input },],
    'item': [{ type: Input },],
};
//# sourceMappingURL=notification.component.js.map