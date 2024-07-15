# Test Embedded
### Obiettivo del Test
Realizzare un'applicazione Desktop che comunichi con un "dispositivo virtuale" tramite porta seriale, simulando l'invio e la ricezione di dati. L'applicazione dovrà gestire la comunicazione in modo asincrono e rispondere a eventi specifici, modificando l'interfaccia utente in base ai dati ricevuti dal dispositivo.
### Errori
- La comunicazione tramite porta seriale non funziona
---


## Documentazione per il Simulatore della Porta Seriale

### Introduzione

Questo documento fornisce una guida completa per l'installazione, configurazione e utilizzo del "Simulatore della Porta Seriale", sviluppato in DeviceScript. DeviceScript offre un'esperienza di sviluppo in TypeScript per dispositivi basati su microcontrollori con risorse limitate, compilando a un bytecode personalizzato che può essere eseguito in ambienti molto limitati, utilizzando l'API `serial` di DeviceScript. L'applicazione ascolta i comandi inviati dall'applicazione principale e risponde con il comando ricevuto seguito da "+OK".

### Prerequisiti

1. **Node.js**: Assicurati di avere installato Node.js versione 20 o successiva.
2. **Visual Studio Code**: Scarica e installa Visual Studio Code.

### Installazione dell'Estensione DeviceScript per Visual Studio Code

#### Installazione Automatica

1. Apri Visual Studio Code.
2. Vai al Marketplace delle estensioni.
3. Cerca "DeviceScript" e installa l'estensione.

### Avvio del Simulatore DeviceScript

#### Passo 1: Avvio del Simulatore

1. Apri Visual Studio Code.
2. Vai al pannello DeviceScript.
3. Clicca sull'icona del plug per avviare il simulatore DeviceScript.
![devs-plug](https://github.com/user-attachments/assets/90cee771-126c-42e3-9f99-b25abb4d3ac5)

#### Passo 2: Esplorazione del Simulatore

Una volta avviato, il simulatore apparirà nell'albero dei dispositivi. Puoi esplorare i suoi servizi e lo stato direttamente da lì.
![devs-tree](https://github.com/user-attachments/assets/36d5bd12-a7c5-46fc-8e95-16a2e48e5e1e)

### Dashboard delle Periferiche

#### Passo 1: Avvio del Dashboard

1. Nel pannello DeviceScript, clicca sull'icona della dashboard per avviare la vista del dashboard delle periferiche.
![devs-devices2](https://github.com/user-attachments/assets/44e4e9e1-4cf1-42d9-8bcc-ab6fd4dd1b0e)

#### Passo 2: Utilizzo del Dashboard

Il dashboard permette di visualizzare qualsiasi dispositivo connesso e di lanciare periferiche del simulatore. Queste periferiche del simulatore sono tipicamente interattive e permettono di modificare i valori utilizzando i controlli dell'interfaccia utente.
![devs-simulators](https://github.com/user-attachments/assets/8e58e6fe-ee73-4a36-8685-990e85973f7c)


#### Codice di `main.ts`

```typescript
import { Serial } from "@devicescript/core"
import { LightBulb } from "@devicescript/core"

// Dichiarazione del client Serial
const serial = new Serial()

// Leggere e scrivere lo stato di abilitazione della connessione seriale
const value = await serial.enabled.read()
console.log(`Serial enabled state: ${value}`)
await serial.enabled.write(value)

// Dichiarazione delle lampadine
const lightBulbs = [
    new LightBulb(),
    new LightBulb(),
    new LightBulb(),
    new LightBulb()
]

// Funzione per gestire i comandi ricevuti
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
            await lightBulb.on(1.0);
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

// Impostazione iniziale dello stato delle lampadine
await lightBulbs[0].on(0.5)
await lightBulbs[1].off()
await lightBulbs[2].toggle()
await lightBulbs[3].toggle()
await lightBulbs[3].toggle()

// Comandi di esempio
await handleCommand('0 on') // Error: LightBulb is already on.
await handleCommand('1 on') // LightBulb 1 turned on.
await handleCommand('4 on') // Error: Invalid LightBulb number. Must be between 0 and 3.
```

### Scelte Architetturali

- **Uso di TypeScript**: TypeScript è stato scelto per la sua robustezza e per i vantaggi offerti dalla tipizzazione statica, che aiuta a prevenire errori e migliora la manutenibilità del codice.
- **DeviceScript:**: Offre un'esperienza di sviluppo in TypeScript per dispositivi con risorse limitate, compilando a un bytecode personalizzato.
- **API Client Serial:**: Utilizzata per la gestione della comunicazione seriale, permettendo l'invio e la ricezione asincrona di dati.

### Dettagli sui Comandi

L'applicazione ascolta i comandi inviati tramite la porta seriale e li interpreta per controllare lo stato di quattro "LightBulbs" virtuali. Ogni comando ha il formato `<numero_lampadina> <stato>`, dove:

- `<numero_lampadina>` è un numero da 0 a 3 che identifica la lampadina.
- `<stato>` può essere `on` o `off`.

### Esempi di Comandi

- `0 on`: Accende la lampadina 0.
- `1 off`: Spegne la lampadina 1.
- `2 on`: Accende la lampadina 2.
- `3 off`: Spegne la lampadina 3.

### Fonti
DeviceScript 
https://microsoft.github.io/devicescript/

---


## Documentazione del Progetto SerialPort

### Introduzione

Questo progetto Node.js utilizza il modulo `serialport` per comunicare con un dispositivo seriale. L'applicazione apre una porta seriale specificata, invia un comando al dispositivo e gestisce eventuali errori di comunicazione.

### Funzionamento dell'Applicazione

L'applicazione si connette a una porta seriale specificata e invia un messaggio di comando al dispositivo collegato. Se la scrittura del messaggio ha successo, viene stampato un messaggio di conferma sulla console. In caso di errore, viene stampato un messaggio di errore.

### Codice

Il file principale dell'applicazione è `index.js`:

```js
import { SerialPort } from 'serialport'

const serialport = new SerialPort({ path: 'baud/8?1', baudRate: 115200 })

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
```
Per risolvere l'errore ERR_UNKNOWN_ENCODING, è stato specificato esplicitamente la codifica durante la scrittura.
L'errore ERR_UNKNOWN_ENCODING indica che c'è un problema con la codifica utilizzata per la scrittura sulla porta seriale. Questo può accadere se Node.js tenta di utilizzare una codifica non valida.


Modifica del `package.json`:

Il file package.json è stato modificato per aggiungere il supporto per i moduli ES6. E' stato aggiunto il seguente campo:

```js
Copy code
{
  "type": "module"
}
```


In alternativa, puoi rinominare il file index.js in index.mjs, e in questo caso non è necessario aggiungere "type": "module" nel package.json.
### Scelte Architetturali

- **Modularità:** L'applicazione utilizza il modulo `serialport` per gestire la comunicazione seriale.
- **ES6 Modules:** Il codice utilizza i moduli ES6 per una struttura moderna e pulita.
- **Gestione degli Errori:** Vengono gestiti gli errori sia in fase di scrittura sulla porta seriale che durante l'apertura della porta.

## Istruzioni per Eseguire l'Applicazione

### Prerequisiti

- Node.js e npm installati
- Dispositivo seriale connesso
- Permessi per accedere alla porta seriale (su Linux/macOS)

### Esecuzione Locale

1. **Clona il repository**

   ```sh
   git clone <URL_DEL_REPOSITORY>
   cd my-serialport-project
   ```

2. **Installa le dipendenze**

   ```sh
   npm install
   ```

3. **Modifica il percorso della porta seriale**

   Apri `index.js` e sostituisci `'baud/8?1'` con il percorso della tua porta seriale.

4. **Esegui l'applicazione**

   ```sh
   node index.js
   ```

### Fonti
**Node SerialPort**
https://serialport.io/docs/api-serialport
