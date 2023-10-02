export const ajax = (path) => {
    let result = null;
    fetch(path)
        .then(response => response.text())
        .then(data => {
            result = data;
        })
        .catch((error) => {
            result = `Fehler beim Laden der SVG-Datei: ${error}`;
            console.error(result);
        });
    return result;
}