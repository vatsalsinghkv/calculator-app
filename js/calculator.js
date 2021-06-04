'use strict'

let number = 0;
let prevNumber = 0;
let tempPrevNum = 0;
let prevOperator = '';
let operator = '';

let specialKeysValues = ['+', '-', '*', '/', '.', 'Enter', 'Backspace', 'Reset'];
let validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ...specialKeysValues];

// EVENT LISTENERS
$('.key-pad').click(function(e) {
    let keyClicked = e.target;
    let keyClickedClass = Array.from(keyClicked.classList);

    if(!keyClickedClass.includes('key-pad')) {
        animateKey(keyClicked);

        let keyValue = keyClicked.id;

        if(!checkSpecialKeys(keyValue)) {
            updateNumber(keyValue);
        }
    }
});

$(document).keypress((e) => {
    if(validKeys.includes(e.key)) {
        animateKey((document.getElementById(e.key)));
        if(!checkSpecialKeys(e.key)) {
            updateNumber(e.key);
        }
    }
});

$(document).keydown((e) => {
    if(e.key === 'Backspace') {
        animateKey((document.getElementById(e.key)));
        checkSpecialKeys(e.key);
    }

    if(e.ctrlKey && e.key === 'z') {
        checkSpecialKeys('Reset');
    }
})

// FUNCTIONS
function checkSpecialKeys(keyValue) {
    if(specialKeysValues.includes(keyValue)) {
        switch(keyValue) {
            case 'Backspace':
                deleteNum();
                break;

            case 'Reset':
                number = 0;
                clearCache();
                printNum(number);
                break;

            case 'Enter':
                if(operator) performOperation();
                break;

            case '.': 
                if(operator !== '.' && isNotFloat(number)) {
                    prevOperator = operator;
                    operator = '.';
                    printOperation();
                }
                break;
                
            case '+':
                if(operator) performOperation();
                operator = '+';
                printOperation();
                break;

            case '-':
                if(operator) performOperation();
                operator = '-';
                printOperation();
                break;

            case '*':
                if(operator) performOperation();
                operator = '×';
                printOperation();
                break;

            case '/':
                if(operator) performOperation();
                operator = '/';
                printOperation();
                break;
        }
        return true;
    }
    return false;
}

function performOperation() {
    switch(operator) {
        case '+':
            number = prevNumber + number;
            if(isNotFloat(number)) {
                printNum(number);
            } else {
                number = number.toPrecision(5);
                printNum(number);
            }
            break;

        case '-':
            number = prevNumber - number;
            if(isNotFloat(number)) {
                printNum(number);
            } else {
                number = number.toPrecision(5);
                printNum(number);
            }
            break;

        case '×':
            number = prevNumber * number;
            if(isNotFloat(number)) {
                printNum(number);
            } else {
                number = number.toPrecision(5);
                printNum(number);
            }
            break;

        case '/':
            if(number !== 0) {
                number = prevNumber / number;
                if(isNotFloat(number)) {
                    printNum(number);
                } else {
                    number = number.toPrecision(5);
                    printNum(number);
                }
            } else {
                alert("Cannot be divided by 0");
                printNum(0);
            }
            break;

        case '.':
            number = Number(`${prevNumber}${operator}${number}`);
            break;
    }
    clearCache();
}

// FORMATTING FUNCTIONS
function updateNumber(num) {
    if(isNotFloat(number)) {
        number = (number * 10) + Number(num);
    } else {
        number = Number(`${number}${num}`);
    }

    // if 35 + 3.5
    if(tempPrevNum) {
        number = Number(`${prevNumber}${operator}${number}`);
        operator = prevOperator;
        prevNumber = tempPrevNum;

        tempPrevNum = null;
        prevOperator = '';
    }

    if(operator) {
        printNum(`${prevNumber}${operator}${number}`);
    } else {
        printNum(number);
    }
}

function printOperation() {
   if(operator === '.') {
        if(prevNumber) {
            tempPrevNum = prevNumber;
            prevNumber = number;
            number = 0;
            printNum(`${tempPrevNum}${prevOperator}${prevNumber}${operator}`);
        } else {
            prevNumber = number;
            number = 0;
            printNum(`${prevNumber}${operator}`);
        }
   } else {
    prevNumber = number;
    number = 0;
    printNum(`${prevNumber}${operator}`);
   }
}

function printNum(num) {
    if(isNotFloat(number) && isNotFloat(prevNumber)) {
        num = numberWithCommas(num);
    }
    $('.display').text(num);
}

// SMALL FUNCTIONS
// http://www.mredkj.com/javascript/nfbasic.html
function numberWithCommas(nStr) { 
	nStr += '';
	let x = nStr.split('.');
	let x1 = x[0];
	let x2 = x.length > 1 ? '.' + x[1] : '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function clearCache() {
    prevOperator = '';
    operator = '';
    prevNumber = 0;
}

function animateKey(key) {
    key.classList.add('pressed');
    setTimeout(() => {
        key.classList.remove('pressed');
    }, 150);
}

function isNotFloat(num) {
    return num === Math.floor(num);
}

// function deleteNum() {
//     //before deleting anything 2 _ (where prev = 2 & number = 0 (by default), _ deleted (operator))
//     if(prevNumber && number === 0) {
//         number = prevNumber;
//         clearCache();
//         printNum(number);
//     } else {
//         //  delete last digit (23 + 3_) where prev = 23 num & number = 3
//         if(isNotFloat(number)) {
//             number = Math.floor(number / 10);   
//         } else {
//             number = Number(`${number}`.slice(0, `${number}`.length - 1));
//         }

//         // after deleting: 2 + 3 (where pre = 2 & number = 3)
//         if(prevNumber) {
//             // 2 + _ (num is deleted = 0)
//             if(number === 0) {
//                 printNum(`${prevNumber}${operator}`);
//             } else {
//                 printNum(`${prevNumber}${operator}${number}`);
//             }
//         } else if(number && number !== Infinity) {
//             printNum(number)
//         } else {
//             number = 0;
//             printNum(number);
//         }
//     }
// }

function deleteNum() {
    //before deleting anything 2 _ (where prev = 2 & number = 0 (by default), _ deleted (operator))
    if(tempPrevNum && prevNumber) {
        number = Number(`${number}`.slice(0, `${number}`.length - 1));
    } else if(prevNumber === 0 && operator === '.') {
        number = Number(`${number}`.slice(0, `${number}`.length - 1));
        
        if(!(number === 0)) {
            printNum(`${prevNumber}${operator}${number}`);
        } else {
            clearCache();
            printNum(number);
        }
    } else if(prevNumber && number === 0) {
        number = prevNumber;
        clearCache();
        printNum(number);
    } else {
        number = Number(`${number}`.slice(0, `${number}`.length - 1));
        // after deleting: 2 + 3 (where pre = 2 & number = 3)
        if(prevNumber) {
            printNum(`${prevNumber}${operator}${number}`);
            
        } else {
            printNum(number)
        } 
    }
}