// lib/simple.js
import pkg from '@whiskeysockets/baileys';
const { makeWASocket } = pkg;

// Exportamos directamente la función para crear el socket
export { makeWASocket };

// Puedes agregar utilidades extras según tu bot
export function example() {
    return 'Hola desde simple.js';
}
