import http from "./Http.js";
import "../models/CustomElement.js"

export default class RowManager {
    private _board: HTMLElement;
    private _rowTemplate: string;

    public constructor(board: HTMLElement) {
        this._board = board;
    }

    public async createRow(rowIndex: number): Promise<HTMLElement> {
        if (!this._rowTemplate) {
            this._rowTemplate = await this.getRowTemplate();
        }

        const newRow = this._rowTemplate.replace("{0}", rowIndex.toString());
        this._board.appendHTMLString(newRow);
        const newRowElement = document.getElementById(`fila${rowIndex}`);

        return newRowElement;
    }

    private async getRowTemplate(): Promise<string> {
        return http.get("public/views/fila.html");
    }   
}