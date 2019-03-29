import {Casilla, EstadoCasilla} from "../models/casilla.js";

const estiloCasillaPrendida = "casilla prendida";
const estiloCasillaApagada = "casilla apagada";

const casillas: Casilla[][] = [];
const tamano: number = 3;

function get(url: string): Promise<any> {
    const request = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
        request.open("GET", url);

        request.onload = () => {
            if (request.status >= 200 && request.status < 300) {
                resolve(request.response);
            } else {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }
        };

        request.onerror = () => {
            reject({
                status: request.status,
                statusText: request.statusText
            });
        };
        
        request.send();
    });
}

window.onload = () => {
    crearTablero();
}

function crearFila(): Promise<string> {
    return get("public/views/fila.html");
}

function crearCasilla(): Promise<string> {
    return get("public/views/casilla.html");
}

async function crearTablero(): Promise<void> {
    const tablero = document.getElementById("tablero");
    const filaHTML = await crearFila().then((fila: string) => fila);
    const casillaHTML = await crearCasilla().then((casilla: string) => casilla);

    for(let x = 0; x< tamano; x++) {
        casillas.push([]);

        tablero.innerHTML += filaHTML.replace("{0}", x.toString());
        const filaElement = document.getElementById(`fila${x}`);

        for(let y = 0; y< tamano; y++) {
            const estadoInicial: EstadoCasilla = Math.round(Math.random());
            const id = `${x}-${y}`;  

            let nuevaCasilla = casillaHTML.replace("{0}", id );

            switch (estadoInicial) {
                case EstadoCasilla.Apagada:
                    nuevaCasilla = nuevaCasilla && nuevaCasilla.replace("{1}", estiloCasillaApagada) || "";
                    break;
                case EstadoCasilla.Prendida:
                    nuevaCasilla = nuevaCasilla && nuevaCasilla.replace("{1}", estiloCasillaPrendida) || "";
                    break;
                default:
                    break;
            }
            
            filaElement.innerHTML += nuevaCasilla;

            casillas[x][y] = {
                id: id,
                estado: estadoInicial
            }     
        }
    }
    agregarEventos();
}

function agregarEventos(): void {
    [].concat(...casillas).forEach((casilla: Casilla) => {
        const elemento = document.getElementById(casilla.id);
        elemento.addEventListener("click", (evento: Event) => cambiarEstado(evento));
    });
}

function cambiarEstado(evento: Event): void {
    const casilla = evento.srcElement;
    const casillasACambiar = buscarCasillasACambiar(casilla);

    casillasACambiar.forEach(casillaACambiar => setearEstado(casillaACambiar));
}

function setearEstado(casillaACambiar: Casilla): void {
    const elemento = document.getElementById(casillaACambiar.id);

    switch (casillaACambiar.estado) {
        case EstadoCasilla.Apagada:
            casillaACambiar.estado = EstadoCasilla.Prendida;
            elemento.className = estiloCasillaPrendida;            
            break;
        case EstadoCasilla.Prendida:
            casillaACambiar.estado = EstadoCasilla.Apagada;
            elemento.className = estiloCasillaApagada;
            break;
        default:
            break;
    }
}

function buscarCasillasACambiar(elemento: Element): Casilla[] { 
    const posiciones = elemento.id.split("-");
    const posX = Number(posiciones[0]);
    const posY = Number(posiciones[1]);
    const casillasACambiar: Casilla[] = [];

    casillasACambiar.push(casillas[posX][posY]);
    if (posX - 1 >= 0) casillasACambiar.push(casillas[posX - 1][posY]);
    if (posX + 1 < tamano) casillasACambiar.push(casillas[posX + 1][posY]);
    if (posY - 1 >= 0) casillasACambiar.push(casillas[posX][posY - 1]); 
    if (posY + 1 < tamano) casillasACambiar.push(casillas[posX][posY + 1]);

    return casillasACambiar;
}