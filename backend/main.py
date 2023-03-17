import subprocess
from typing import List, Union

import requests
from fastapi import FastAPI
from pydantic import BaseModel

from aleo import *

class SudokuInput(BaseModel):
    private_key: str
    puzzle: List[List[int]]
    solution: List[List[int]]

class DecryptRecordInput(BaseModel):
    view_key: str
    ciphertext: str

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/leo/transaction/{transaction_id}")
async def read_transaction(transaction_id: str):
    try:
        return requests.get("http://0.0.0.0:3030/testnet3/transaction/at1qpzjqmzddcnzd4fncm3dldh840f2flfvq64f89v06lc3cfdeks9snjwnjz").json()
    except Exception as e:
        return {"error": str(e)}

@app.post("/leo/decrypt")
async def decrypt_record(decrypt_record_input: DecryptRecordInput):
    return {"output": decrypt_ciphertext(decrypt_record_input.view_key, decrypt_record_input.ciphertext)}

@app.get("/sudoku")
async def get_new_sudoku():
    sudoku = generate_valid_sudoku()
    puzzle = generate_sudoku_puzzle(sudoku)
    return {"puzzle": puzzle, "solution": sudoku}

@app.post("/leo/sudoku")
async def solve_sudoku_leo(sudoku_input: SudokuInput):
    output = solve_puzzle(sudoku_input.puzzle, sudoku_input.solution, sudoku_input.private_key)
    if "Successfully broadcast execution" in output:
        return {"success": True, "output": output}
    else:
        return {"success": False, "output": output}

@app.post("/noir/sudoku")
async def solve_sudoku_noir(sudoku_input: SudokuInput):
    return sudoku_input


