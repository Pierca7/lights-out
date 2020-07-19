import BoardManager from "../logic/BoardManager.js";
import Constants from "../shared/Constants.js";
import Templates from "../shared/TemplateProvider.js";
import "../models/CustomElement.js"

class AppController {
    private _minValue: number = 3;
    private _boardManager: BoardManager;
    private _templates: Templates;

    public constructor(templates: Templates) {
        this._templates = templates;
        this._boardManager = new BoardManager(this, templates);
        this.createControls();
    }

    public async createControls(): Promise<void> {
        document.getElementById(Constants.appId).appendHTMLString(this._templates.controls);

        this._addInputAttributes(this._minValue);
        this._addButtonAttributes();
    }

    public async createCongratulations(): Promise<void> {
        const actualRecord = document.getElementById(Constants.recordId).innerHTML;
        const newScore = this._boardManager.getMovements().toString();

        if (actualRecord === "-" || Number(newScore) < Number(actualRecord)) {
            document.getElementById(Constants.recordId).innerHTML = newScore;
        }

        const congratulations = this._templates.congratulations.replace("{0}", newScore);

        document.getElementById(Constants.scorePanelId).className += " hidden";
        document.getElementById(Constants.boardId).className += " hidden";
        document.getElementById(Constants.appId).appendHTMLString(congratulations);
        document.getElementById(Constants.resetButtonId).addEventListener("click", () => {
            const scorePanel = document.getElementById(Constants.scorePanelId);
            scorePanel.className = scorePanel.className.replace(" hidden", "");
            
            this._boardManager.resetBoard();
        })
    }

    private _addInputAttributes(minValue: number): void {
        const boardSizeInput = <HTMLInputElement>document.getElementById(Constants.tileInputId);
        const minValueString = String(minValue);

        boardSizeInput.value = minValueString;
        boardSizeInput.min = minValueString;
        boardSizeInput.max = String(minValue * 2);
    }

    private _addButtonAttributes(): void {
        document.getElementById(Constants.playButtonId).addEventListener("click", async (event: Event) => {
            const boardSize = Number((<HTMLInputElement>document.getElementById(Constants.tileInputId)).value);

            if (boardSize > this._minValue * 2) {
                return;
            }

            const scorePanel = document.getElementById(Constants.scorePanelId);
            scorePanel.className = scorePanel.className.replace(" hidden", "");
            document.getElementById(Constants.controlsId).remove();

            await this._boardManager.createBoard(boardSize);
            await this._createClueButton();

            this._boardManager.addBoardEvents();
            this._addClueButtonAttributes();
        });
    }

    private async _createClueButton(): Promise<void> {
        document.getElementById(Constants.boardId).appendHTMLString(this._templates.clueButton);
    }

    private async _addClueButtonAttributes(): Promise<void> {
        document.getElementById(Constants.clueButtonId).addEventListener("click", () => {
            this._boardManager.giveClue();
        });
    }
}


export default AppController;