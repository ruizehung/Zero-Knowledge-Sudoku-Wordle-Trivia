fn main(solution:[u4;81], puzzle: pub [u4;81]) {
    constrain check_puzzle(solution, puzzle) & check_line(solution) & check_square(solution) & check_column(solution);
}

fn check_puzzle(solution: [u4;81], puzzle: [u4;81]) -> bool {
    for i in 0..9 {
        for j in 0..9 {
            constrain (puzzle[9*i+j] == 0) | (puzzle[9*i+j] == solution[9*i+j]) ;
        };
    };
	true
}

//checks the lines of the solution are valid
fn check_line(a: [u4;81]) -> bool {
    for i in 0..9 {
      let mut line = [0;9];
        for j in 0..9 {
          line[j] = a[9*i+j];
        };
      check_cards(line);
    };
    true
}

fn check_square(a: [u4;81]) -> bool {
  let N3 = 9 / 3;
  for i in 0..N3 {
    for j in 0..N3 {
      let mut square = [0;9];
      for u in 0..N3 {
        for v in 0..N3 {
          square[N3*u+v] =a[9*(N3*i+u)+N3*j+v];
        };
      };
      check_cards(square);
    };
  };
 true
}

//checks the columns of the solution are valid
fn check_column(a: [u4;81]) -> bool {
    for j in 0..9 {
        let mut col = [0;9];
        for i in 0..9 {
          col[i] = a[9*i+j];
        };
        check_cards(col);
    };
 true
}
    
fn check_cards(a: [u4;9]) {
    let mut s : Field = 0;
    for k in 1..9+1 {
        let mut p : Field = 1;
  	    for j in 0..9 {
          p = p * (k -  a[j] as Field);
        };
        s = s + p;
    };

    let mut p : Field = 1;
    for j in 0..9-1 {
        p = p * (a[j] as Field);
    };
    constrain p != 0;
    constrain s == 0;
}
