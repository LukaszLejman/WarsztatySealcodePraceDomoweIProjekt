var _date=document.getElementById('date'); //poczatek wstawiania daty
var today=new Date();
var month = ["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"];
_date.innerHTML=(
  today.getDate()+" "
  +month[today.getMonth()]+" "
  +today.getFullYear()+" r."
);    //koniec wstawiania daty

var tasklist= []; //tablica z zadaniami
var alltasks=0; //liczba wszystkich zadan (widocznych i ukrytych)
var listazadan = document.getElementById('listazadan'); //lista z zadaniami

function newTask() {
	var task= document.getElementById('dodajtext').value;
	document.getElementById('dodajtext').value = "";
	task=task.replace(/\s+/g,' ').trim();
	
	if (task==0) alert("Nie możesz dodać pustego zadania!");
	else {
		tasklist[alltasks] ={
			zadanie: '<input type="button" value="Usuń" class="usun" id="btnzad'+alltasks+'"><p>'+task+'</p><input type="checkbox" name="zad'+alltasks+'" value="done" id="task'+alltasks+'"/><label for="task'+alltasks+'"></<label>',
			zrobione: false,
			archiwalne: false //zamiast usuwania zadan, beda one ukrywane w celu zachowania statystyk :D
		};			
		alltasks++;
		Reload();
	}
}

function Reload(){ //przeładowanie strony (najpierw musze usunac wszystkie li, a nastepnie dodac zaktualizowana liste)
	while(listazadan.firstChild){
		listazadan.removeChild(listazadan.firstChild);
	}
	var licznik = 0;
	for (var i=0; i<alltasks; i++){
		if (tasklist[i].archiwalne!=true){
			var newElement = document.createElement('li');
			newElement.id='zad'+i;
			newElement.innerHTML=tasklist[i].zadanie;
			if(tasklist[i].zrobione==true) newElement.lastChild.previousSibling.checked=true;
			listazadan.appendChild(newElement);
			licznik++;
			var checklistener = newElement.lastChild.previousSibling;
			if (checklistener) checklistener.addEventListener('change',checkedUnchecked, false);
			var removelistener = newElement.firstChild;
			if (removelistener) removelistener.addEventListener('click',removeTask, false);
			
		}
	}
	if(licznik==0){
		var BrakZadanInfo = document.createElement('h5');
		BrakZadanInfo.innerHTML="Aktualnie nie masz żadnych zadań. Od początku używania tej aplikacji dodałeś: "+alltasks+" zadań. Nie poddawaj się i dodawaj kolejne! :)";
		listazadan.appendChild(BrakZadanInfo);
	}
}

function removeTask(e){ //szukam numeru w id za pomoca wyrażeń regularnych i usuwam (chowam) zadanie i na koniec odswiezam stan zadan
	x = e.target.id;
	var r = /\d+/;
	y=x.match(r);
	tasklist[y].archiwalne=true;
	Reload();
}

function checkedUnchecked(e){ //taka sama zasada jak w removeTask
	x = e.target.id;
	var r = /\d+/;
	y=x.match(r);
	tasklist[y].zrobione=!tasklist[y].zrobione;
	Reload();
	
	
}

var addtask = document.getElementById('dodaj');
addtask.addEventListener('click', newTask, false);
var addtaskenter = document.getElementById('dodajtext');
addtaskenter.addEventListener('keypress', function (e) {if (e.keyCode == 13) newTask()},false);
document.onload = Reload();
