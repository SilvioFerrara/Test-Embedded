import { SerialPort } from 'serialport'

const serialport = new SerialPort({ path: 'baud/8?1', baudRate: 115200 })
//serialport.write(0, 'off')
//serialport.write(1, 'on')

// Scrive un messaggio sulla porta seriale con la codifica 'utf8'
serialport.write((0, 'off'), 'utf8', (err) => {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
  
  // Aggiungi un listener per gli errori
  serialport.on('error', (err) => {
    console.log('Error: ', err.message);
  });