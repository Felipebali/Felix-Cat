import fs from 'fs';

let blacklist = [];

// Cargar la lista negra desde JSON
export const loadBlacklist = () => {
    try {
        const data = fs.readFileSync('./blacklist.json', 'utf-8');
        blacklist = JSON.parse(data);
    } catch (err) {
        blacklist = [];
    }
};

// Guardar la lista negra en JSON
export const saveBlacklist = () => {
    fs.writeFileSync('./blacklist.json', JSON.stringify(blacklist, null, 2));
};

// Agregar un usuario a la lista negra
export const addToBlacklist = (userId, reason = 'Sin motivo') => {
    if (!blacklist.find(u => u.id === userId)) {
        blacklist.push({ id: userId, reason });
        saveBlacklist();
        return true;
    }
    return false;
};

// Revisar si un usuario está en la lista negra
export const isBlacklisted = (userId) => {
    return blacklist.find(u => u.id === userId);
};

// Cargar al iniciar el bot
loadBlacklist();
