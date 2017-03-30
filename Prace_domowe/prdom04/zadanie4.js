function binarny(liczba)
{
  var wynik="";
  while(liczba>0){
    wynik+=liczba%2;
    liczba=Math.floor(liczba /2);
  }
  return ( wynik.split("").reverse().join(""));
}

console.log(binarny(126));
