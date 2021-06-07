'use strict'

let number = '';
let prevNumber = '';
let tempPrevNum = '';
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
                number = '';
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
    if(number || prevNumber) {
        if(tempPrevNum) {
            number = Number(`${prevNumber}${operator}${number}`);
            operator = prevOperator;
            prevNumber = tempPrevNum;
    
            tempPrevNum = '';
            prevOperator = '';
        }
        
        switch(operator) {
            case '+':
                strToNumber();
                number = prevNumber + number;
                if(isNotFloat(number)) {
                    printNum(number);
                } else {
                    number = number.toPrecision(4);
                    printNum(number);
                }
                break;
                
            case '-':
                strToNumber();
                number = prevNumber - number;
                if(isNotFloat(number)) {
                    printNum(number);
                } else {
                    number = number.toPrecision(4);
                    printNum(number);
                }
                break;
                
            case '×':
                strToNumber();
                number = prevNumber * number;
                if(isNotFloat(number)) {
                    printNum(number);
                } else {
                    number = number.toPrecision(4);
                    printNum(number);
                }
                break;
                
            case '/':
                strToNumber();
                if(number !== 0) {
                    number = prevNumber / number;
                    if(isNotFloat(number)) {
                        printNum(number);
                    } else {
                        number = number.toPrecision(4);
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
}

// FORMATTING FUNCTIONS
function updateNumber(num) {
    number += num;
    
    if(tempPrevNum) {
        printNum(`${tempPrevNum}${prevOperator}${prevNumber}${operator}${number}`);
    } else if(operator) {
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
            number = '';
            printNum(`${tempPrevNum}${prevOperator}${prevNumber}${operator}`);
        } else {
            prevNumber = number;
            number = '';
            printNum(`${prevNumber}${operator}`);
        }
    } else {
        prevNumber = number;
        number = '';
        printNum(`${prevNumber}${operator}`);
    }
}

function printNum(num) {
    if(isNotFloat(number) && isNotFloat(prevNumber) && !tempPrevNum)
        num = numberWithCommas(num);
    $('.display').text(num);
}

let flag = true;
function deleteNum() {
    numberToStr();
    if(!number.includes('e')) {
        if(prevNumber && !number && !tempPrevNum) {
            number = prevNumber;
            clearCache();
            printNum(number);
        } else {
            if(flag) number = number.slice(0,-1);
            else flag = true;
    
            if(prevOperator) {
                if(number) {
                    printNum(`${tempPrevNum}${prevOperator}${prevNumber}${operator}${number}`);
                } else {
                    printNum(`${tempPrevNum}${prevOperator}${prevNumber}${operator}`);
                    number = prevNumber;
                    operator = prevOperator;
                    prevNumber = tempPrevNum;
                    prevOperator = '';
                    tempPrevNum = '';
                    flag = false;
                }            
            } else {
                if(operator)
                    if(number)
                        printNum(`${prevNumber}${operator}${number}`);
                    else
                        printNum(`${prevNumber}${operator}`); 
                else 
                    printNum(number);
            }
        }
    } else {
        number = '';
        clearCache();
        printNum(number);
    }
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
    prevNumber = '';
    tempPrevNum = '';
}

function animateKey(key) {
    key.classList.add('pressed');
    setTimeout(() => {
        key.classList.remove('pressed');
    }, 100);
}

function isNotFloat(num) {
    num = Number(num);
    return num === Math.floor(num);
}

function strToNumber() {
    number = Number(number);
    prevNumber = Number(prevNumber);
    tempPrevNum = Number(tempPrevNum);
}

function numberToStr() {
    number = String(number);
    prevNumber = String(prevNumber);
    tempPrevNum = String(tempPrevNum);
}