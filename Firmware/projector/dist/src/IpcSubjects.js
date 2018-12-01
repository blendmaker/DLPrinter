"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var electron_1 = require("electron");
var IpcMainSubject = /** @class */ (function (_super) {
    __extends(IpcMainSubject, _super);
    //private _sendFunc: (channel: string, msg: any)=>void;
    function IpcMainSubject(_sendFunc) {
        var _this = _super.call(this, {}) || this;
        _this._sendFunc = _sendFunc;
        electron_1.ipcMain.on('message', function (e, args) {
            _this.next(JSON.parse(args));
        });
        return _this;
    }
    IpcMainSubject.prototype.send = function (msg) {
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg);
        }
        this._sendFunc('message', msg);
    };
    return IpcMainSubject;
}(rxjs_1.BehaviorSubject));
exports.IpcMainSubject = IpcMainSubject;
var IpcRendererSubject = /** @class */ (function (_super) {
    __extends(IpcRendererSubject, _super);
    function IpcRendererSubject() {
        var _this = _super.call(this, {}) || this;
        electron_1.ipcRenderer.on('message', function (e, args) {
            _this.next(JSON.parse(args));
        });
        return _this;
    }
    IpcRendererSubject.prototype.send = function (object) {
        if (typeof object !== 'string') {
            object = JSON.stringify(object);
            electron_1.ipcRenderer.send('message', object);
        }
    };
    return IpcRendererSubject;
}(rxjs_1.BehaviorSubject));
exports.IpcRendererSubject = IpcRendererSubject;
//# sourceMappingURL=IpcSubjects.js.map