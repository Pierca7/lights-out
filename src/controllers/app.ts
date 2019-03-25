import {Casilla, EstadoCasilla, casillaHTML, filaHTML, estiloCasillaApagada, estiloCasillaPrendida} from "../models/casilla.js";

const casillas: Casilla[][] = [];
const tamano: number = 3;

window.onload = () => {
    crearTablero();
    agregarEventos();
}

function crearTablero(): void {
    const tablero = document.getElementById("app");

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
}

function agregarEventos() {
    casillas.forEach((fila) => {
        fila.forEach((casilla) => {
            const elemento = document.getElementById(casilla.id);

            elemento.addEventListener("click", (evento: Event) => {
                cambiarEstado(casilla, elemento, evento);
            })
        })
    })
}

function cambiarEstado(casilla:Casilla, elemento: Element, evento: Event) {
    switch (casilla.estado) {
        case EstadoCasilla.Apagada:
            casilla.estado = EstadoCasilla.Prendida;
            elemento.className = "casilla prendida";
            break;
        case EstadoCasilla.Prendida:
            casilla.estado = EstadoCasilla.Apagada;
            elemento.className = "casilla apagada";
            break;
        default:
            break;
    }
}