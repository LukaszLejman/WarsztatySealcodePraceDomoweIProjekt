function binarny(liczba)
{
  var wynik="";
  while(liczba>0){
    wynik=liczba%2+wynik;
    liczba=Math.floor(liczba /2);
  }
  return wynik;
}

console.log(binarny(126));
