
//function that takes an object and returns an array
export default function ToArray(firebaseObj){
    let array = [];
    for(let item in firebaseObj){
      array.push({key: item, value: firebaseObj[item]}) //här måste man sätta varje enskilt objekt till value för att sen enkelt komma åt alla värden 
    }
    return array;
  }
