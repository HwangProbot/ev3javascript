const Rx = require('rxjs/Rx');
const ev3 = require('./ev3');

// change me
const deviceName = '/dev/tty.EV3-SerialPort';

const brick$ = Rx.Observable
    .fromPromise(ev3({deviceName, logLevel: 'trace', startupSplash: true}))
    .mergeMap(b => b.startMotors("A+D", 10))
    .delay(5000)
    .mergeMap(b => b.halt())
    .mergeMap(b => b.disconnect());



brick$.subscribe(() => process.exit());