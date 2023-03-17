import random

def generate_valid_sudoku():
    # Initialize empty 9x9 grid
    grid = [[0 for _ in range(9)] for _ in range(9)]
    
    # Helper function to check if a given number can be placed in a cell
    def is_valid(row, col, num):
        # Check if number is already present in row
        if num in grid[row]:
            return False
        # Check if number is already present in column
        if num in [grid[i][col] for i in range(9)]:
            return False
        # Check if number is already present in 3x3 subgrid
        subgrid_row, subgrid_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(subgrid_row, subgrid_row + 3):
            for j in range(subgrid_col, subgrid_col + 3):
                if grid[i][j] == num:
                    return False
        # If number can be placed in cell, return True
        return True
    
    # Helper function to generate a list of valid numbers for a cell
    def valid_numbers(row, col):
        candidates = list(range(1, 10))
        random.shuffle(candidates)
        for num in candidates:
            if is_valid(row, col, num):
                yield num
    
    # Fill in grid with valid numbers using backtracking
    def fill_grid():
        for row in range(9):
            for col in range(9):
                if grid[row][col] == 0:
                    for num in valid_numbers(row, col):
                        grid[row][col] = num
                        if fill_grid():
                            return True
                        grid[row][col] = 0
                    return False
        return True
    
    # Fill in grid and return result
    fill_grid()
    return grid


def generate_sudoku_puzzle(valid_sudoku):
    # Copy valid sudoku to avoid modifying it
    puzzle = [row[:] for row in valid_sudoku]
        
    # Remove random cells from each row
    for row in puzzle:
        indices_to_remove = random.sample(range(9), random.randint(4, 7))
        for index in indices_to_remove:
            row[index] = 0
    
    return puzzle
