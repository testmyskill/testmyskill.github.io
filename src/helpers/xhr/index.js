export function doGet(url) {

    return new Promise((ressolve) => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                ressolve(JSON.parse(xhttp.responseText));
            }
        };
        xhttp.open("GET", url);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send();
    });
}
