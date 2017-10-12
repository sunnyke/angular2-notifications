import { Pipe } from '@angular/core';
var MaxPipe = (function () {
    function MaxPipe() {
    }
    MaxPipe.prototype.transform = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!value)
            return value;
        var allowed = args[0];
        var received = value.length;
        if (received > allowed && allowed !== 0) {
            var toCut = allowed - received;
            return value.slice(0, toCut);
        }
        return value;
    };
    return MaxPipe;
}());
export { MaxPipe };
MaxPipe.decorators = [
    { type: Pipe, args: [{ name: 'max' },] },
];
/** @nocollapse */
MaxPipe.ctorParameters = function () { return []; };
//# sourceMappingURL=max.pipe.js.map