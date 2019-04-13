import {Casilla} from "../models/casilla.js";
import solve from "./solve.js";

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
    document.getElementById("boton").addEventListener("click", async (evento: Event) => {
        document.getElementById("controles").className = "hidden";
        const tablero = await getTablero();
        document.getElementById("app").innerHTML += tablero;
        crearTablero().then(() => {
            solve(casillas);
        });
    })


}

function crearFila(): Promise<string> {
    return get("public/views/fila.html");
}

function crearCasilla(): Promise<string> {
    return get("public/views/casilla.html");
}

function getTablero(): Promise<string> {
    return get("public/views/tablero.html");
}

async function crearTablero(): Promise<void> {
    const tablero = document.getElementById("tablero");
    const filaHTML = await crearFila();
    const casillaHTML = await crearCasilla();

    for(let x = 0; x< tamano; x++) {
        casillas.push([]);

        tablero.innerHTML += filaHTML.replace("{0}", x.toString());
        const filaElement = document.getElementById(`fila${x}`);

        for(let y = 0; y< tamano; y++) {
            const estadoInicial: boolean = Math.round(Math.random()) === 1;
            const id = `${x}-${y}`;  
            const nuevaCasilla = casillaHTML.replace("{0}", id )
            .replace("{1}", estadoInicial ? estiloCasillaPrendida : estiloCasillaApagada);
            
            filaElement.innerHTML += nuevaCasilla;

            casillas[x][y] = {
                id: id,
                encendida: estadoInicial
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
    const casilla = evento.srcElement as Element;
    const casillasACambiar = buscarCasillasACambiar(casilla);

    casillasACambiar.forEach(casillaACambiar => setearEstado(casillaACambiar));
}

function setearEstado(casillaACambiar: Casilla): void {
    const elemento = document.getElementById(casillaACambiar.id);
     
    casillaACambiar.encendida = !casillaACambiar.encendida;
    elemento.className = casillaACambiar.encendida ? estiloCasillaPrendida : estiloCasillaApagada;
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