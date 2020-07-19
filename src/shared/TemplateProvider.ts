import http from "../logic/Http.js";

class Templates {
    private readonly _board: string;
    private readonly _clueButton: string;
    private readonly _congratulations: string;
    private readonly _controls: string;
    private readonly _row: string;
    private readonly _tile: string;

    private constructor(board: string, clueButton: string, congratulations: string, controls: string, row: string, tile: string) {
        this._board = board;
        this._clueButton = clueButton;
        this._congratulations = congratulations;
        this._controls = controls;
        this._row = row;
        this._tile = tile;
    }

    public static async create(): Promise<Templates> {
        const board = await http.get<string>("public/views/components/board.html");
        const clueButton = await http.get<string>("public/views/components/clueButton.html");
        const congratulations = await http.get<string>("public/views/components/congratulations.html");
        const controls = await http.get<string>("public/views/components/controls.html");
        const row = await http.get<string>("public/views/components/row.html");
        const tile = await http.get<string>("public/views/components/tile.html");

        return new Templates(board, clueButton, congratulations, controls, row, tile);
    }

    public get board(): string {
        return this._board;
    }

    public get clueButton(): string {
        return this._clueButton;
    }

    public get congratulations(): string {
        return this._congratulations;
    }

    public get controls(): string {
        return this._controls;
    }

    public get row(): string {
        return this._row;
    }

    public get tile(): string {
        return this._tile;
    }
}

export default Templates;