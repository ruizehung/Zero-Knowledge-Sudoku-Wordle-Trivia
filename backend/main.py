from typing import List, Union

from fastapi import FastAPI
from pydantic import BaseModel

class Sudoku(BaseModel):
    puzzle: List[List[int]]
    solution: List[List[int]]

app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/leo/sudoku")
async def solve_sudoku_leo(sudoku: Sudoku):
    return sudoku

@app.post("/noir/sudoku")
async def solve_sudoku_noir(sudoku: Sudoku):
    return sudoku