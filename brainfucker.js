// pointer and array
let pointer = 0;
let array = new Uint8Array(30000);

// output and input
let output = [];
let input = [];

// code map
let codeMap = new Map();
let schar = '[';
let echar = ']';

let register = (chars) => {
  schar = chars[6];
  echar = chars[7];
  chars.forEach((elt, ind) => {
    codeMap.set(elt, ind);
  });
};

// mapping
register(['>', '<', '+', '-', '.', ',', '[', ']']);

// inner status
let dests = new Map();
let setDests = (spos, epos) => {
  dests.set(spos, epos + 1);
  dests.set(epos, spos + 1);
};
let getDests = (pos) => {
  return dests.get(pos);
};

let parenStack = [];
let code = [];
let pos = 0;

// inner functions
let jump = () => {pos =  getDests(pos);};

// eight commands
let incp = () => {pointer++;pos++;};
let decp = () => {pointer--;pos++;};
let incv = () => {array[pointer]++;pos++;};
let decv = () => {array[pointer]--;pos++;};
let put = () => {output.push(array[pointer]);pos++;};
let get = () => {array[pointer] = Number(input.shift());pos++;};
let start = () => {
  if (array[pointer] === 0) {
    jump();
  } else {
    pos++;
  }
};
let end = () => {
  if (array[pointer] !== 0) {
    jump();
  } else {
    pos++;
  }
};

let commands = [incp, decp, incv, decv, put, get, start, end];

// main loop
let brainfuck = () => {
  for (let command = commands[code[pos]];command;command  = commands[code[pos]]) {
    command();
  }
};

// interface
//// read token and make code
let makeCode = (codeStr) => {
  return codeStr.replace(/\s+/, '')
    .split('')
    .map((elt, ind) => {
      let command = codeMap.get(elt);
      if (elt === schar) {
        parenStack.push(ind);
      } else if (elt === echar) {
        setDests(parenStack.pop(), ind);
      }
      return command;
    });
};

let readInput = (inStr) => {
  return inStr.split(' ')
    .map((elt) => {
      if (Number.isInteger(elt) && 0 <= elt && elt <= 255){
        return elt;
      } else if (0 <= Number(elt) && Number(elt) <= 255) {
        return Number(elt);
      } else if (elt.length === 1 && 33 <= String.charCodeAt(elt) <= 126) {
        return String.charCodeAt(elt);
      } else {
        return 0;
      }
    });
};

let read = () => {
  input = readInput(document.getElementById('input').value);
  code = makeCode(document.getElementById('code').value);
};

//// show output
let toAsciiChar = (int) => {
  if (32 <= int && int <= 126) {
    return String.fromCharCode(int);
  } else {
    return '';
  }
};

let show = () => {
  document.getElementById('output').value = output.join(' ') + '\nASCII: ' + output.map((elt) => toAsciiChar(elt)).join('');
};

// run !!
let run = () => {
  console.log('STRAT');
  read();
  brainfuck();
  show();
  console.log('END');
};
