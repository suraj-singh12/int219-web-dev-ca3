// initial variables 
let timer = 50;    // delay timer in sorting visualizer
let values = [];
let w = null;
let started = false;
let states = [];
let sort_start = false;
let screenWidthMargin = 10;
let screenHeightMargin = 10;

// just animations on gear button and overflow by that
document.querySelector(".gear").addEventListener("click", function () {
  document.querySelector(".set").classList.toggle("opened");  // bring drop down
  document.querySelector(".gear").classList.toggle("click");  // rotate gear button
});


// fill array with random values on clicking `random` button
document.querySelector("#rand").addEventListener("click", randomiz);
function randomiz() {
  if (sort_start != true) {
    document.getElementsByClassName('initial-instr')[0].style.display = 'none';   // hide the initial instruction
    // set the required global values
    started = true;
    w = 50;

    // create a canvas in current window
    createCanvas(windowWidth - screenWidthMargin, windowHeight - screenHeightMargin);

    // create empty arrays of n = (windowWidth - 10) / W 
    values = new Array(floor((windowWidth - screenWidthMargin) / w));    // to store values
    states = new Array(floor((windowWidth - screenHeightMargin) / w));    // to store states (while sorting)

    console.log('height: ', height);

    // fill the values and initialize state with -1
    for (let i = 0; i < values.length; i++) {
      values[i] = random(height - 120);   // generate a random number b/w [0, height - 120] and fill in values[i]
      states[i] = -1;
    }
  }
}

// fill the user entered values on clicking `manual` button
document.querySelector("#man").addEventListener("click", manual);
function manual() {
  if (sort_start != true) {

    document.getElementsByClassName('initial-instr')[0].style.display = 'none'; // hide the initial instruction

    started = true;

    let textarr = []
    // if user has entered manual values, then get the space separated values
    if (document.querySelector(".arr-inp").value != "") {
      textarr = document.querySelector(".arr-inp").value.trim().split(/\s+/);
    }


    createCanvas(windowWidth - screenWidthMargin, windowHeight - screenHeightMargin);    // createCanvas() provided by p5

    values = new Array(textarr.length);
    states = new Array(textarr.length);

    const temp = []
    for (let i = 0; i < textarr.length; i++) {
      temp[i] = parseInt(textarr[i]);
    }
    w = ((windowWidth - screenWidthMargin) / temp.length);


    let max = Math.max(...temp);    // find maximum of all elements

    for (let i = 0; i < temp.length; i++) {
      values[i] = (temp[i] / max) * (height - 110);
      states[i] = -1;
    }
  }
}

// start the algorithm on clicking play button
document.querySelector(".btn").addEventListener("click", start); // attach the play button to algorithm starter function
function start() {
  document.querySelector(".set").classList.remove("opened");  // hide drop down
  console.log(sort_start, " : ", started);
  if (sort_start != true && started == true) {
    sort_start = true;
    insertionSort(values, values.length);   // call the algo
  }
}

// recursive insertion sort function (Bottom Up approach)
async function insertionSort(arr, n) {
  if (n <= 1)   // base case
    return;

  await insertionSort(arr, n - 1);    // recursively call untill n = 1

  let last = arr[n - 1];
  let j = n - 2;

  states[j] = 1;

  while (j >= 0 && arr[j] > last) {
    // shift all the elements to right by one step, so as to make room for last element
    // so it can be placed at its sorted position
    await sleep(timer);
    arr[j + 1] = arr[j];

    // change the colors
    temp = states[j];
    states[j] = 1;        // current state = red (element moving to its sorted place from unsorted)
    states[j + 1] = temp;   // next state = previous current state
    j--;
  }

  // turn red element to blue as it reaches its sorted place
  states[j + 1] = 2;
  await sleep(timer);

  arr[j + 1] = last;            // put the last element to it's sorted place

  //Turn all the sorted elements to green
  //color red=1 blue=2 green=3
  for (let k = 0; k <= j + 1; k++) {
    states[k] = 3;
  }

  // if this is the last last element of the array then make it green too (happens in the outermost recursion call (last call))
  if (n == arr.length) {
    states[n - 1] = 3
    sort_start = false;
  }
}

// re-draw every time on screen so that it appears like animation while sorting is running
function draw() {     // for creaeCanvas() to work
  if (started) {
    // background 
    background('#7494EA');

    // draw according to states (color: 1, 2, 3 : red, blue, green)
    for (let i = 0; i < values.length; i++) {
      // yeh kabab ke bich ki haddi 
      stroke(0);
      if (states[i] == 1) {
        fill("#B9314F");
      }
      if (states[i] == 2) {
        fill("#255C99");
      }
      else if (states[i] == 3) {
        fill("#68EDC6");
      }
      else if (states[i] == -1) {
        fill("#DEC3BE");    // default color
      }
      // create the rectangle with given values
      rect(i * w, height - values[i], w, values[i]);
    }
  }
}

// for delay in animation 
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
