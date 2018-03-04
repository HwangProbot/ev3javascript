const ev3 = require('./ev3');

// change me
const deviceName = '/dev/tty.EV3-SerialPort';


async function main() {
    let b = await ev3({deviceName, logLevel: 'trace', startupSplash: true});
    await b.startMotors("A+D", 10);
    await new Promise(r => setTimeout(r, 5000));
    await b.halt();
    await b.disconnect();
    process.exit();
}

main();




