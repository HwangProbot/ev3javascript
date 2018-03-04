const scratch = require('./ev3_scratch');
const SerialPort = require('serialport');

module.exports = function(options) {
    return new Promise((resolve, reject) => createBrick(options, (err, brick) => err ? reject(err) : resolve(brick)));
};


function createBrick(options, callback) {

    var deviceName = options.deviceName || '/dev/tty.EV3-SerialPort';

    var port = new SerialPort(deviceName, {
        baudRate: 57600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false,
        autoOpen: false});

    var device = {
        id: 'COM',

        open: function () {

        },

        set_receive_handler: function (handler) {
            port.on("data", handler);
        },

        send: function (data) {
            port.write(Buffer.from(data), function (err) {
                if (err) console.log("write", err);
                port.drain(function(err) {
                    if (err) console.log("drain", err);
                });
            });

        }
    };


    port.open(function (err) {

        if (err) return callback(err);

        scratch(options, function(err, ext) {

            if (err) return callback(err);

            ext._deviceConnected(device);

            // todo: callback when initialized; for now we wait a bit
            setTimeout(function () {
                callback(null, createBrickFrom(ext, (brick) =>
                    new Promise((resolve, reject) => port.close(err => err ? reject(err) : resolve(brick)))))
            }, 3000);
        });

    });

};

// return a more convenient representation of brick
function createBrickFrom(ext, closePort) {
    let brick =  {
        startMotors: (which, speed) => new Promise(resolve => {ext.startMotors(which, speed); return resolve(brick)}),
        pulseMotors: (which, speed, degrees, howStop) => new Promise(resolve => {ext.motorDegrees(which, speed, degrees, howStop); return resolve(brick)}),
        playTone: (tone, duration) => new Promise(resolve => ext.playTone(tone, duration, result => resolve(result))),
        playFreq: (freq, duration) => new Promise(resolve => ext.playFreq(freq, duration, result => resolve(result))),
        stopMotors: (which, how) => new Promise(resolve => {ext.motorsOff(which, how); return resolve(brick)}),
        steerMotors: (ports, what, duration) => new Promise(resolve => ext.steeringControl(ports, what, duration, result => resolve(result))),
        isButtonPressed: (port) => new Promise(resolve => resolve(ext.whenButtonPressed(port))),
        isRemoteButtonPressed: (irButton, port) => new Promise(resolve => resolve(ext.whenRemoteButtonPressed(irButton, port))),
        readTouchSensor: (port) => new Promise(resolve => ext.readTouchSensorPort(port, result => resolve(result))),
        readColorSensor: (port, mode) => new Promise(resolve => ext.readColorSensorPort(port, mode, result => resolve(result))),
        waitUntilDarkLine: (port) => new Promise(resolve => ext.waitUntilDarkLinePort(port, result => resolve(result))),

        // note the ext reverses the port and mode for the gyro reading
        readGyroGensor: (port, mode) => new Promise(resolve => ext.readGyroPort(mode, port, result => resolve(result))),

        readDistanceSensor: (port) => new Promise(resolve => ext.readDistanceSensorPort(port, result => resolve(result))),
        readRemoteButton: (port) => new Promise(resolve => ext.readRemoteButtonPort(port, result => resolve(result))),
        readMotor: (which, mode) => new Promise(resolve => ext.readFromMotor(mode, which, result => resolve(result))),
        readBatteryLevel: () => new Promise(resolve => ext.readBatteryLevel(result => resolve(result))),
        setLED: (pattern) => new Promise(resolve => ext.setLED(pattern, result => resolve(result))),

        halt: (...a) => new Promise(resolve => {ext._stop(); return resolve(brick)}),

        // these pauses are work-around for over-lapping operations
        disconnect: () =>
            new Promise(r => setTimeout(r, 400))
                .then(() => closePort(brick))
                .then(() => new Promise(r => setTimeout(r, 400))),
    };
    return brick;

}







