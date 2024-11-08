export function eliminarNoSerializable(obj) {
    const plainObject = Object.assign({}, obj);
    for (let prop in plainObject) {
        if (plainObject.hasOwnProperty(prop)) {
            if (prop === "transformResponse" || prop === "transformRequest") {
                delete plainObject[prop];
                continue;
            }
            if (typeof plainObject[prop] === 'function') {
                // Si la propiedad es una función, la elimina y pasa a la siguiente propiedad
                delete plainObject[prop];
                continue;
            }
            if (typeof plainObject[prop] !== 'object' || plainObject[prop] === null) {
                // Si la propiedad no es un objeto, pasa a la siguiente propiedad
                continue;
            }
            try {
                plainObject[prop] = eliminarNoSerializable(plainObject[prop]); // Intenta eliminar las propiedades no serializables de los objetos hijos
                JSON.stringify(plainObject[prop]); // Verifica si la propiedad es serializable
            } catch (error) {
                delete plainObject[prop]; // Si no es serializable, la elimina
            }
        }
    }
    return plainObject;
}