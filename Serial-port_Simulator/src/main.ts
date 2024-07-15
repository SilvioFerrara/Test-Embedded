import { Serial } from "@devicescript/core"
import { LightBulb } from "@devicescript/core"

const serial = new Serial()

//await serial.enabled.write(await serial.enabled.read())

const value = await serial.enabled.read()
console.log(`Value: ${value}`)
await serial.enabled.write(value)

const lightBulbs = [
    new LightBulb(),
    new LightBulb(),
    new LightBulb(),
    new LightBulb()
];

async function handleCommand(command: string) {
    const [lightBulbNumberStr, state] = command.split(' ');

    const lightBulbNumber = parseInt(lightBulbNumberStr);
    if (isNaN(lightBulbNumber) || lightBulbNumber < 0 || lightBulbNumber >= lightBulbs.length) {
        console.error("Error: Invalid LightBulb number. Must be between 0 and 3.");
        return;
    }

    const lightBulb = lightBulbs[lightBulbNumber];

    if (state === 'on') {
        if (await lightBulb.intensity.read() > 0) {
            console.error("Error: LightBulb is already on.");
        } else {
            await lightBulb.on(1.0); // assuming on method takes a brightness parameter
            console.log(`LightBulb ${lightBulbNumber} turned on.`);
        }
    } else if (state === 'off') {
        if ((await lightBulb.intensity.read() === 0)) {
            console.error("Error: LightBulb is already off.");
        } else {
            await lightBulb.off();
            console.log(`LightBulb ${lightBulbNumber} turned off.`);
        }
    } else {
        console.error("Error: Invalid state. Must be 'on' or 'off'.");
    }
}

/*
// Subscribe to changes in serial connection status
serial.enabled.subscribe(async (value) => {
    console.log(`Serial enabled state changed: ${value}`);
});

// Subscribe to changes in connection name
serial.connectionName.subscribe(async (value) => {
    console.log(`Serial connection name: ${value}`);
});

// Subscribe to changes in baud rate
serial.baudRate.subscribe(async (value) => {
    console.log(`Baud rate changed to: ${value}`);
});

// Subscribe to changes in data bits
serial.dataBits.subscribe(async (value) => {
    console.log(`Data bits changed to: ${value}`);
});

// Subscribe to changes in stop bits
serial.stopBits.subscribe(async (value) => {
    console.log(`Stop bits changed to: ${value}`);
});

// Subscribe to changes in parity mode
serial.parityMode.subscribe(async (value) => {
    console.log(`Parity mode changed to: ${value}`);
});

// Subscribe to changes in buffer size
serial.bufferSize.subscribe(async (value) => {
    console.log(`Buffer size changed to: ${value}`);
});
*/

// Initial state setup for LightBulbs
await lightBulbs[0].on(0.5);
await lightBulbs[1].off();
await lightBulbs[2].toggle();
await lightBulbs[3].toggle();
await lightBulbs[3].toggle();

await handleCommand('0 on') //Error: LightBulb is already on.
await handleCommand('1 on') //LightBulb 1 turned on.
await handleCommand('4 on') //Error: Invalid LightBulb number. Must be between 0 and 3.
