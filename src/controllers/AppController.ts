import http from "../logic/Http.js";
import BoardManager from "../logic/BoardManager.js";
import "../models/CustomElement.js"

export default class AppController {
    private _controlsTemplate: string;
    private _clueButtonTemplate: string;
    private _minValue: number = 3;
    private _boardManager: BoardManager;

    public constructor() {
        this._createControls();
        this._boardManager = new BoardManager();
    }

    private async _createControls(): Promise<void> {
        if (!this._controlsTemplate){
            this._controlsTemplate = await http.get("public/views/controls.html");
        }

        document.getElementById("app").appendHTMLString(this._controlsTemplate);

        this._addInputAttributes(this._minValue);
        this._addButtonAttributes();
    }

    private _addInputAttributes(minValue: number): void {
        const boardSizeInput = <HTMLInputElement>document.getElementById("cantidadFilas");
        const minValueString = String(minValue);

        boardSizeInput.value = minValueString;
        boardSizeInput.min = minValueString;
        boardSizeInput.max = String(minValue * 2);
    }

    private _addButtonAttributes(): void {
        document.getElementById("boton").addEventListener("click", async (event: Event) => {
            document.getElementById("controles").hidden = true;
            const boardSize = Number((<HTMLInputElement>document.getElementById("cantidadFilas")).value);

            await this._boardManager.createBoard(boardSize);
            await this._createClueButton();
            
            this._boardManager.addTileEvents();
            this._addClueButtonAttributes();
        });
    }

    private async _createClueButton(): Promise<void> {
        if (!this._clueButtonTemplate) {
            this._clueButtonTemplate = await this._getClueButtonTemplate();
        }

        document.getElementById("tablero").appendHTMLString(this._clueButtonTemplate);
    }

    private async _addClueButtonAttributes(): Promise<void> {
        document.getElementById("clueButton").addEventListener("click", () => {
            this._boardManager.giveClue();
        });
    }

    private _getClueButtonTemplate(): Promise<string> {
        return http.get("public/views/clueButton.html");
    }
}

