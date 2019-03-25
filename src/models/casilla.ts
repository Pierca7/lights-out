export interface Casilla {
    id: string;
    estado: EstadoCasilla;
}

export enum EstadoCasilla {
    Apagada,
    Prendida    
}

export const filaHTML = `<div id="fila{0}" class="fila"></div>`;
export const casillaHTML = `<div id="{0}" class="{1}"></div>`;
export const estiloCasillaPrendida = "casilla prendida";
export const estiloCasillaApagada = "casilla apagada";