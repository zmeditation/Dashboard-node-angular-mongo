
module.exports = ( length ) => {
    
    let capLetters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
        
    let smallLetters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
       
    let numbers = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
        
    let specialChars = [ '!', '@', '#', '^', '_', '%', '$', '?', '/', '*' ];

    let maxSpecChar = 0;
    let scopeNum = 4;
    let countSpecChar = 0;

    let charRandom = () => {

        let switchRes = ''; 
        
        ++countSpecChar;
        
        let resMath = Math.floor( Math.random() * scopeNum ) + 1;

        if ( !resMath && countSpecChar <= length ) {
            return charRandom(); 
        }
        
        if ( resMath == 4 ) {
            ++maxSpecChar;
        }
        
        if ( maxSpecChar == 2 && scopeNum == 4 ) {
            --scopeNum;
        }
        
        if ( maxSpecChar < 2 && ( length / 2 ) < countSpecChar ) {
            ++maxSpecChar;
            resMath = 4;
        }

        switch ( resMath ) {
            
            case 1:

                switchRes = capLetters[ Math.floor( Math.random() * 26 ) ];
                break;
            case 2:

                switchRes = smallLetters[ Math.floor( Math.random() * 26 ) ];
                break;
            case 3:

                switchRes = numbers[ Math.floor( Math.random() * 10 ) ];
                break;
            case 4:

                switchRes = specialChars[ Math.floor( Math.random() * 10 ) ];
                break;
            
        }
        if ( !switchRes && countSpecChar <= length ) { 
            
           return charRandom();
        }

        return switchRes;
        }

    let output = "";
    
    for (let i = 0; i < length; ++i ) {    
        output += charRandom();
    }
    
        return output;
}
