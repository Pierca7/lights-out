import {Casilla, EstadoCasilla} from "../models/casilla.js";

const filaHTML = `<div id="fila{0}" class="fila"></div>`;
const casillaHTML = `<div id="{0}" class="{1}"></div>`;
const estiloCasillaPrendida = "casilla prendida";
const estiloCasillaApagada = "casilla apagada";

const casillas: Casilla[][] = [];
const tamano: number = 3;

window.onload = () => {
    crearTablero();
}

function crearTablero(): void {
    const tablero = document.getElementById("tablero");

    for(let i = 0; i< tamano; i++) {
        casillas.push([]);        
        const nuevaFila = filaHTML.replace("{0}", i.toString());
        tablero.innerHTML += nuevaFila;
        const filaElement = document.getElementById(`fila${i}`);

        for(let j = 0; j< tamano; j++) {
            const estadoInicial: EstadoCasilla = Math.round(Math.random());
            const id = `${i}-${j}`;  

            let nuevaCasilla = casillaHTML.replace("{0}", id );

            switch (estadoInicial) {
                case EstadoCasilla.Apagada:
                    nuevaCasilla = nuevaCasilla.replace("{1}", estiloCasillaApagada);
                    break;
                case EstadoCasilla.Prendida:
                    nuevaCasilla = nuevaCasilla.replace("{1}", estiloCasillaPrendida);
                    break;
                default:
                    break;
            }
            
            filaElement.innerHTML += nuevaCasilla;

            casillas[i][j] = {
                id: id,
                estado: estadoInicial
            }     
        }
    }
    agregarEventos();
}

function agregarEventos(): void {
    casillas.forEach((fila) => {
        fila.forEach((casilla) => {
            const elemento = document.getElementById(casilla.id);
            elemento.addEventListener("click", (evento: Event) => cambiarEstado(evento));
        })
    })
}

function cambiarEstado(evento: Event): void {
    const casilla = evento.srcElement;
    const casillasACambiar = buscarCasillasACambiar(casilla);

    casillasACambiar.forEach(casillaACambiar => setearEstado(casillaACambiar));

    function setearEstado(casillaACambiar: Casilla){
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