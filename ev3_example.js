const ev3 = require('./ev3');

// change me
const deviceName = '/dev/tty.EV3-SerialPort';


ev3({deviceName, logLevel: 'trace', startupSplash: true})
    .then(brick => {

        brick.startMotors("A+D", 10);

        setTimeout(function () {
            brick.halt();
            brick.disconnect().then(function () {
                process.exit()
            });
        }, 5000);
    });



