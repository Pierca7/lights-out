import http from "../logic/Http.js";
import BoardManager from "../logic/BoardManager.js";
import constants from "../shared/constants.js";
import "../models/CustomElement.js"

export default class AppController {
    private _controlsTemplate: string;
    private _congratulationsTemplate: string;
    private _clueButtonTemplate: string;
    private _minValue: number = 3;
    private _boardManager: BoardManager;

    public constructor() {
        this.createControls();
        this._boardManager = new BoardManager(this);
    }

    public async createControls(): Promise<void> {
        if (!this._controlsTemplate){
            this._controlsTemplate = await http.get("public/views/controls.html");
        }

        document.getElementById(constants.appId).appendHTMLString(this._controlsTemplate);

        this._addInputAttributes(this._minValue);
        this._addButtonAttributes();
    }

    public async createCongratulations(): Promise<void> {
        if (!this._congratulationsTemplate){
            this._congratulationsTemplate = await this._getCongratulationsTemplate();
        }
        
        const actualRecord = document.getElementById(constants.recordId).innerHTML;
        const newScore = this._boardManager.getMovements().toString();

        if (actualRecord === "-" || Number(newScore) < Number(actualRecord)) {
            document.getElementById(constants.recordId).innerHTML = newScore;
        }

        const congratulations = this._congratulationsTemplate.replace("{0}", newScore);

        document.getElementById(constants.boardId).className += " hidden";
        document.getElementById(constants.appId).appendHTMLString(congratulations);  
        document.getElementById(constants.resetButtonId).addEventListener("click", () => {
            this._boardManager.resetBoard();
        })                  
    }

    private _addInputAttributes(minValue: number): void {
        const boardSizeInput = <HTMLInputElement>document.getElementById(constants.tileInputId);
        const minValueString = String(minValue);

        boardSizeInput.value = minValueString;
        boardSizeInput.min = minValueString;
        boardSizeInput.max = String(minValue * 2);
    }

    private _addButtonAttributes(): void {
        document.getElementById(constants.playButtonId).addEventListener("click", async (event: Event) => {
            const boardSize = Number((<HTMLInputElement>document.getElementById(constants.tileInputId)).value);

            if (boardSize > this._minValue * 2) {
                return;
            }

            document.getElementById(constants.controlsId).remove();

            await this._boardManager.createBoard(boardSize);
            await this._createClueButton();
            
            this._boardManager.addBoardEvents();
            this._addClueButtonAttributes();
        });
    }

    private async _createClueButton(): Promise<void> {
        if (!this._clueButtonTemplate) {
            this._clueButtonTemplate = await this._getClueButtonTemplate();
        }

        document.getElementById(constants.boardId).appendHTMLString(this._clueButtonTemplate);
    }

    private async _addClueButtonAttributes(): Promise<void> {
        document.getElementById(constants.clueButtonId).addEventListener("click", () => {
            this._boardManager.giveClue();
        });
    }

    private _getClueButtonTemplate(): Promise<string> {
        return http.get("public/views/clueButton.html");
    }

    private _getCongratulationsTemplate(): Promise<string> {
        return http.get("public/views/congratulations.html");
    }
}

