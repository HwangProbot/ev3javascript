# ev3-direct

Using Javascript running on a host computer, send direct commands across bluetooth serial port to a LEGO Mindstorms EV3 brick running stock firmware.
Supports motor operations and all EV3 stock sensors. Supports async/await, making it much easier to handle non-blocking I/O.



Currently just a thin wrapper around https://github.com/kaspesla/ev3_scratch (thanks Ken!).

## Prerequistes

NodeJS 7.10 or better. Tested with 9.x.

NodeJS 6.x should work, but you won't be able to run the examples that use aysnc/await.

## Installation

### Connect to your EV3 using bluetooth

The only trick is that you have to enable ipad/iphone in the bluetooth settings 
on your EV3 during pairing. But after pairing, you have to uncheck the ipad/iphone option OR IT WON'T WORK -- on Windows
especially it doesn't fail fast! (From the console output it will look like the EV3 isn't sending any data back.)

After pairing, your computer will show the EV3 as disconnected -- this is normal; when the connection to the EV3 is open, the
status will change to connected.

If you name the brick "EV3" -- which I believe is the default -- the examples should work without modification on Mac OS. 
On Windows, you will have to mess with the sample program and specify the device name as "COM3" or some such.

### Clone this repo

    cd <repo>
    yarn install # alternatively, npm install should work too
    node ev3_example
    
 
## Examples

There are four examples that all do the same thing (spin the A+D motor for 5 seconds), but use different approaches for handling non-blocking
execution, and one example that tests all the sensors and motor operations.

* ev3_example - uses NodeJS-style callbacks, and would be considered the most standard/basic
* ev3_example_promise - uses promises to do the same thing
* ev3_example_obs - uses observable (RxJS) 
* ev3_example_async - uses ES 2017 async/await; requires NodeJS >7.10 (9.x is what I tested on)
* ev3_example_test - tests all the sensors and motor outputs

For the examples, set up your large motors on ports A an D, and use the conventional sensor port mappings, 
port 1 = touch, port 2 = gyro, port 3 = color, port 4 = infrared or ultrasonic.

# API

### setup

    const ev3 = require('./ev3');


### ev3({options..}) => Promise\<brick\>

    ev3({options...})
    
options:
* deviceName - the path to the device; on Windows it will be a string such as "COM3"; on Mac Os it will be "/dev/tty..."
* logLevel - set the console logging level. Values are one of: trace, debug, info, warn, error
* startupSplash - true/false. Wehether to display a splash screen and play tones at start up

return:
* promise which will resolve to `brick` if EV3 is successfully initialized; `brick` is how you communicate with the EV3.

### brick.startMotors(which, speed) => Promise

which:
    
    "whichMotorPort":   ["A", "B", "C", "D", "A+D", "B+C", "all"],
    "whichMotorIndividual":   ["A", "B", "C", "D"],
    "dualMotors":       ["A+D", "B+C"]
speed: 

    0 (min), 100 (max)

### brick.pulseMotors(which, speed, degrees, howStop) => Promise

### brick.stopMotors(which, duration) => Promise

### brick.steerMotors(ports, what, duration) => Promise

### brick.readMotor(which, mode) => Promise

### brick.readColorSensor(port, mode) => Promise\<string\>
    
port:

    "whichInputPort": ["1", "2", "3", "4"],
mode:

    "lightSensorMode":  ["reflected", "ambient", "color"],
    
return:

For "color" mode, the returned values are 
    
    "red", "green", "blue", "yellow", "back", "white", or "none"


### brick.playTone(tone, duration) => Promise

### brick.playFreq(freq, duration) => Promise



### brick.isButtonPressed(port)

### brick.isRemoteButtonPressed(irButton, port) => Promise

### brick.readTouchSensor(port) => Promise

### brick.waitUntilDarkLine(port) => Promise

### brick.readGyroSensor(port, mode) => Promise

### brick.readDistanceSensor(port) => Promise

### brick.readRemoteButton(port) => Promise

### brick.readBatterLevel() => Promise

### brick.setLED(pattern) => Promise

### brick.halt() => Promise

### brick.disconnect() => Promise


   
    
