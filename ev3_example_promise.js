const ev3 = require('./ev3');

// change me
const deviceName = '/dev/tty.EV3-SerialPort';


function delay(seconds, brick) {
    return new Promise(resolve => {
        setTimeout(() => resolve(brick), seconds)
    })
}

ev3({deviceName, logLevel: 'trace', startupSplash: true})
    .then(b => b.startMotors("A+D", 10))
    .then(b => delay(5000, b))
    .then(b => b.halt())
    .then(b => b.disconnect())
    .then(() => process.exit());


