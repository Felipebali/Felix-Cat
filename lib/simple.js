// lib/simple.js
import { makeWASocket as baileysMakeWASocket, protoType as baileysProtoType, serialize as baileysSerialize } from '@whiskeysockets/baileys';

// Exportar funciones que tu index.js necesita
export const makeWASocket = baileysMakeWASocket;
export const protoType = baileysProtoType;
export const serialize = baileysSerialize;

// Ejemplo de función adicional
export function example() {
    return 'Hola desde simple.js';
}
