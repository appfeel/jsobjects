
// http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
export const getObjectByPath = (obj, path, pathReplacements, offset) => {
    const replacements = (pathReplacements || []).slice(0); // Don't touch my array!
    const normalizedPath = path.replace(/^\./, '');           // strip a leading dot
    const pathArray = normalizedPath.split('.');
    const pathArrayLen = pathArray.length - (offset || 0);
    let i;
    let key;

    for (i = 0; i < pathArrayLen; i += 1) {
        key = pathArray[i].replace(/\['(.*)'\]/g, '$1').replace(/\["(.*)"\]/g, '$1'); // convert indexes to properties
        if (key === '*' && replacements && replacements.length) {
            key = replacements.shift();
        }

        if (key in obj) {
            obj = obj[key]; // eslint-disable-line no-param-reassign
        } else {
            return null;
        }
    }

    return obj;
};

/**
 * Converteix 'attrs.*.options.*.dn.*.ap' en
 * Array [
 *     "attrs.0.options.0.dn.0.ap",
 *     "attrs.0.options.0.dn.1.ap",
 *     "attrs.0.options.1.dn.0.ap",
 *     "attrs.0.options.2.dn.0.ap",
 *     "attrs.1.options.0.dn.0.ap",
 *     "attrs.1.options.1.dn.0.ap"
 * ]
 */
export const expandPath = (obj, path, cb = (a, b) => b) => {
    const parts = (path || '').split('.*.');
    const partsLen = parts.length;
    let expandedPaths = [];
    let i;
    let pathParts;
    const expandPathPart = partIdx => (pathPart) => {
        let objPath = [];
        pathPart = pathPart.replace(/\.\*$/i, ''); // eslint-disable-line no-param-reassign
        try {
            objPath = getObjectByPath(obj, pathPart);
        } catch (e) { } // eslint-disable-line no-empty

        (objPath || []).forEach((item, index) => {
            let newPath = `${pathPart}.${index}`;
            newPath = parts[partIdx] ? `${newPath}.${parts[partIdx].replace(/\.\*$/i, '')}` : newPath;
            if (partIdx === parts.length - 1) {
                if (/\.\*$/ig.test(parts[partIdx])) {
                    let objPath1 = [];
                    try {
                        objPath1 = getObjectByPath(obj, newPath);
                    } catch (e) { } // eslint-disable-line no-empty
                    newPath = newPath.replace('.*', '');
                    (objPath1 || []).forEach((item1, index1) => {
                        expandedPaths.push(`${newPath}.${index1}`);
                        cb(`${newPath}.${index1}`, item1);
                    });
                } else {
                    expandedPaths.push(newPath);
                    let objPath2 = [];
                    try {
                        objPath2 = getObjectByPath(obj, newPath);
                    } catch (e) { } // eslint-disable-line no-empty
                    cb(newPath, objPath2);
                }
            } else {
                expandedPaths.push(newPath);
            }
        });
    };
    pathParts = [parts[0]];

    if (partsLen === 1) {
        expandPathPart(1)(pathParts[0]);
    } else {
        for (i = 1; i < partsLen; i += 1) {
            if (expandedPaths.length) {
                pathParts = expandedPaths;
                expandedPaths = [];
            }
            pathParts.forEach(expandPathPart(i));
        }
    }

    return expandedPaths;
};

export const updateObjectByPath = (obj, path, newValue, pathReplacements) => {
    const normalizedPath = path.replace(/^\./, '');
    const lastKey = normalizedPath.split('.').slice(-1)[0];
    try {
        const selectedObject = getObjectByPath(obj, path, pathReplacements, 1);
        selectedObject[lastKey.replace(/'/g, '').replace(/(\['|\["|'\]|"\])/g, '')] = newValue;
    } catch (e) { } // eslint-disable-line no-empty
    return obj;
};
