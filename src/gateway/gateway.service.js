// src/gateway/gateway.service.js
import { nanoid } from 'nanoid';
import blockchain from '../blockchain/blockchain.js';  // tu instancia
import jwt from 'jsonwebtoken';

class GatewayService {
    constructor() {
        this.allowedDevices = new Map(); // Lista blanca
    }

    registerDevice(deviceId, publicKey) {
        this.allowedDevices.set(deviceId, { publicKey });
        return { success: true };
    }

    verifyDevice(deviceId) {
        return this.allowedDevices.has(deviceId);
    }

    normalizeData(data) {
        return {
            id: nanoid(),
            deviceId: data.deviceId,
            type: data.type,
            value: data.value,
            timestamp: Date.now()
        };
    }

    processIncomingData(data) {
        if (!this.verifyDevice(data.deviceId)) {
            throw new Error("❌ Dispositivo NO autorizado.");
        }

        const normalized = this.normalizeData(data);

        // Agregarlo a la blockchain
        blockchain.addTransaction(normalized);

        return {
            success: true,
            message: "Dato recibido y enviado al blockchain",
            transaction: normalized
        };
    }
}

export default new GatewayService();
