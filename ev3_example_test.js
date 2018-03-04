const ev3 = require('./ev3');

// change me
const deviceName = '/dev/tty.EV3-SerialPort';

async function delay(ms) {
    await new Promise(r => setTimeout(r, ms));
}

async function driveLoop(brick) {
    while(true) {

        await brick.startMotors("A+D", 10);
        await delay(5000);
        await brick.halt();
        await delay(5000);

        await brick.startMotors("A+D", -10);
        await delay(5000);
        await brick.halt();
        await delay(5000);

        await brick.steerMotors("A+D", "left", 1);
        await delay(5000);



        await brick.steerMotors("A+D", "right", 1);
        await delay(5000);
    }
}

async function sensorLoop(brick) {

    while(true){
        console.log('touch', await brick.readTouchSensor('1'));
        console.log('gyro angle', await brick.readGyroGensor( '2', 'angle'));
        console.log('color', await brick.readColorSensor('3', 'color'));
        console.log('distance', await brick.readDistanceSensor('4'));
        await delay(1400);
    }
}

async function main() {
    let brick = await ev3({deviceName});

    driveLoop(brick);
    sensorLoop(brick);
}

main();




