export class GameSolver {

    private casillas: any[][] = [[1,1,1], [1,1,1], [1,1,1]];

    private getMatrixLength(): number {
        return this.casillas.length;
    }


    public solve() {
        for(let goal = 0; goal < 2; goal++){
            const anscols: any = [];
            for (let i = 0; i < this.getMatrixLength(); i++) {
            }
        }
    }

    private solveProblem() {
        const matrixLength = this.getMatrixLength();
        const size = Math.pow(matrixLength, 2);

    }

}