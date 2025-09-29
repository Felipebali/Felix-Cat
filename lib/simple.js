// lib/simple.js
import pkg from '@whiskeysockets/baileys';
const { makeWASocket: baileysMakeWASocket, protoType: baileysProtoType, serialize: baileysSerialize } = pkg;

// Exportar funciones que tu index.js usa
export function makeWASocket(...args) {
    return baileysMakeWASocket(...args);
}

export function protoType() {
    return baileysProtoType();
}

export function serialize() {
    return baileysSerialize();
}

// Aquí puedes agregar otras funciones que tu bot necesite
