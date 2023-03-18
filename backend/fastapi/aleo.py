import subprocess
from typing import List

from sudoku import *

def convert_to_PuzzleInfo(puzzle: List[List[int]]): 
    return """\"{ row1: {
    n1: %du8,
    n2: %du8,
    n3: %du8,
    n4: %du8,
    n5: %du8,
    n6: %du8,
    n7: %du8,
    n8: %du8,
    n9: %du8
  }, row2: {
    n1: %du8,
    n2: %du8,
    n3: %du8,
    n4: %du8,
    n5: %du8,
    n6: %du8,
    n7: %du8,
    n8: %du8,
    n9: %du8
  }, row3: {
    n1: %du8,
    n2: %du8,
    n3: %du8,
    n4: %du8,
    n5: %du8,
    n6: %du8,
    n7: %du8,
    n8: %du8,
    n9: %du8
  }, row4: {
    n1: %du8,
    n2: %du8,
    n3: %du8,
    n4: %du8,
    n5: %du8,
    n6: %du8,
    n7: %du8,
    n8: %du8,
    n9: %du8
  }, row5: {
    n1: %du8,
    n2: %du8,
    n3: %du8,
    n4: %du8,
    n5: %du8,
    n6: %du8,
    n7: %du8,
    n8: %du8,
    n9: %du8
  }, row6: {
    n1: %du8,
    n2: %du8,
    n3: %du8,
    n4: %du8,
    n5: %du8,
    n6: %du8,
    n7: %du8,
    n8: %du8,
    n9: %du8
  }, row7: {
    n1: %du8,
    n2: %du8,
    n3: %du8,
    n4: %du8,
    n5: %du8,
    n6: %du8,
    n7: %du8,
    n8: %du8,
    n9: %du8
  }, row8: {
    n1: %du8,
    n2: %du8,
    n3: %du8,
    n4: %du8,
    n5: %du8,
    n6: %du8,
    n7: %du8,
    n8: %du8,
    n9: %du8
  }, row9: {
    n1: %du8,
    n2: %du8,
    n3: %du8,
    n4: %du8,
    n5: %du8,
    n6: %du8,
    n7: %du8,
    n8: %du8,
    n9: %du8
  }
}\"""" % ( puzzle[0][0], puzzle[0][1], puzzle[0][2], puzzle[0][3], puzzle[0][4], puzzle[0][5], puzzle[0][6], puzzle[0][7], puzzle[0][8], 
         puzzle[1][0], puzzle[1][1], puzzle[1][2], puzzle[1][3], puzzle[1][4], puzzle[1][5], puzzle[1][6], puzzle[1][7], puzzle[1][8],
         puzzle[2][0], puzzle[2][1], puzzle[2][2], puzzle[2][3], puzzle[2][4], puzzle[2][5], puzzle[2][6], puzzle[2][7], puzzle[2][8],
         puzzle[3][0], puzzle[3][1], puzzle[3][2], puzzle[3][3], puzzle[3][4], puzzle[3][5], puzzle[3][6], puzzle[3][7], puzzle[3][8],
         puzzle[4][0], puzzle[4][1], puzzle[4][2], puzzle[4][3], puzzle[4][4], puzzle[4][5], puzzle[4][6], puzzle[4][7], puzzle[4][8],
         puzzle[5][0], puzzle[5][1], puzzle[5][2], puzzle[5][3], puzzle[5][4], puzzle[5][5], puzzle[5][6], puzzle[5][7], puzzle[5][8],
         puzzle[6][0], puzzle[6][1], puzzle[6][2], puzzle[6][3], puzzle[6][4], puzzle[6][5], puzzle[6][6], puzzle[6][7], puzzle[6][8],
         puzzle[7][0], puzzle[7][1], puzzle[7][2], puzzle[7][3], puzzle[7][4], puzzle[7][5], puzzle[7][6], puzzle[7][7], puzzle[7][8],
         puzzle[8][0], puzzle[8][1], puzzle[8][2], puzzle[8][3], puzzle[8][4], puzzle[8][5], puzzle[8][6], puzzle[8][7], puzzle[8][8] )


def solve_puzzle(puzzle: List[List[int]], solution: List[List[int]], private_key: str):
    cmd = f'snarkos developer execute sudoku.aleo solve_puzzle {convert_to_PuzzleInfo(puzzle)} {convert_to_PuzzleInfo(solution)} --private-key {private_key} --query "http://localhost:3030" --broadcast "http://localhost:3030/testnet3/transaction/broadcast"'
    output = subprocess.check_output(cmd, shell=True, timeout=240)
    return output.decode("utf-8")

def decrypt_ciphertext(view_key: str, ciphertext: str):
    cmd = f'snarkos developer decrypt  -v {view_key} -c {ciphertext}'
    output = subprocess.check_output(cmd, shell=True, timeout=10)
    return output.decode("utf-8")
