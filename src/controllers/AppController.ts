import http from "../logic/Http.js";
import BoardManager from "../logic/BoardManager.js";
import "../models/CustomElement.js"

export default class AppController {
    private _controlsTemplate: string;
    private _minValue: number = 3;
    private _boardManager: BoardManager;

    public constructor() {
        this.createControls();
    }

    private async createControls(): Promise<void> {
        if (!this._controlsTemplate){
            this._controlsTemplate = await http.get("public/views/controls.html");
        }

        document.getElementById("app").appendHTMLString(this._controlsTemplate);

        this.addInputAttributes(this._minValue);
        this.addButtonAttributes();
    }

    private addInputAttributes(minValue: number): void {
        const boardSizeInput = <HTMLInputElement>document.getElementById("cantidadFilas");
        const minValueString = String(minValue);

        boardSizeInput.min = minValueString;
        boardSizeInput.value = minValueString;
    }

    private addButtonAttributes(): void {
        document.getElementById("boton").addEventListener("click", (event: Event) => {
            document.getElementById("controles").hidden = true;
            const boardSize = Number((<HTMLInputElement>document.getElementById("cantidadFilas")).value);
            
            this._boardManager = new BoardManager(boardSize);
            this._boardManager.createBoard();
        });
    }    
}

