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

function agregarEventos(): void {
    casillas.forEach((fila) => {
        fila.forEach((casilla) => {
            const elemento = document.getElementById(casilla.id);

            elemento.addEventListener("click", (evento: Event) => {
                cambiarEstado(casilla, elemento, evento);
            })
        })
    })
}

function cambiarEstado(casilla:Casilla, elementoOriginal: Element, evento: Event): void {
    const casillasACambiar = buscarAdyacentes(casilla);

    casillasACambiar.forEach(casillaACambiar => {
        const elemento = document.getElementById(casillaACambiar.id);
        setearEstado(casillaACambiar, elemento);
    });
    setearEstado(casilla, elementoOriginal);

    function setearEstado(casillaACambiar: Casilla, elemento: Element){
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



function buscarAdyacentes(casilla: Casilla): Casilla[] {
    const posiciones = casilla.id.split("-");
    const posX = Number(posiciones[0]);
    const posY = Number(posiciones[1]);
    const casillasAdyacentes: Casilla[] = [];

    if (posX - 1 >= 0) casillasAdyacentes.push(casillas[posX - 1][posY]);
    if (posX + 1 < tamano) casillasAdyacentes.push(casillas[posX + 1][posY]);
    if (posY - 1 >= 0) casillasAdyacentes.push(casillas[posX][posY - 1]); 
    if (posY + 1 < tamano) casillasAdyacentes.push(casillas[posX][posY + 1]);

    return casillasAdyacentes;
}