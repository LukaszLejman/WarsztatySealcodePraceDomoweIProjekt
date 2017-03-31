function wyszukaj (tab, x)
{
  var a=0;
  while( (tab[a]!=x) && (a<tab.length) )
  {
    a++;
  }
  if(tab[a]==x)
  {
    return([tab[a],a]);
  }
  else
  {
    return([x,-1]);
  }
}

var tablica = ['O', 'H', 'W', 'N', 'I', ' ', 'E', 'B', 'E', 'W', 'L', 'T', 'C', 'G', 'O', 'E', 'O', 'E'];
console.log(wyszukaj(tablica,'H'));
