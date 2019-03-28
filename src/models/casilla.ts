export interface Casilla {
    id: string;
    estado: EstadoCasilla;
}

export enum EstadoCasilla {
    Apagada,
    Prendida    
}