import mqtt from 'mqtt';
import Blockchain from '../blockchain/blockchain.js';

export function startMQTT(chain) {
  const client = mqtt.connect('mqtt://broker.hivemq.com:1883');

  client.on('connect', () => {
    console.log('MQTT conectado');
    client.subscribe('esp32/sensores', (err) => {
      if (!err) console.log('Suscrito a esp32/sensores');
    });
  });

  client.on('message', (topic, message) => {
    console.log('MQTT mensaje recibido:', message.toString());
    const data = JSON.parse(message.toString());
    chain.addBlock(data);
    console.log('Nuevo bloque agregado por MQTT');
  });

  return client;
}
