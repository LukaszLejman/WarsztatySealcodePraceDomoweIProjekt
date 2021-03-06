var _date=document.getElementById('date'); //poczatek wstawiania daty
var today=new Date();
var month = ["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"];
_date.innerHTML=(
  today.getDate()+" "
  +month[today.getMonth()]+" "
  +today.getFullYear()+" r."
);    //koniec wstawiania daty

var url='http://sealcode.org:8082/api/v1/resources/task';

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
			title: task,
			is_done: false,
			archiwalne: false //zamiast usuwania zadan, beda one ukrywane w celu zachowania statystyk :D
		};			
		qwest.post(url, {title: tasklist[alltasks].title, is_done: tasklist[alltasks].is_done}, {cache: true});
		getTasks();
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
			var nowyParagraf = document.createElement('p');
			var newText = document.createTextNode(tasklist[i].body.title);
			nowyParagraf .appendChild(newText );
			newElement.appendChild(nowyParagraf );
			var nowyPrzycisk = document.createElement('input');
			nowyPrzycisk.setAttribute('type', 'button');
			nowyPrzycisk.setAttribute('value', 'Usuń');
			nowyPrzycisk.setAttribute('class', 'usun');
			nowyPrzycisk.setAttribute('id', 'btnzad'+i);
			newElement .appendChild(nowyPrzycisk );
			var nowyCheckbox = document.createElement('input');
			nowyCheckbox.setAttribute('type', 'checkbox');
			nowyCheckbox.setAttribute('name', 'zad'+i);
			nowyCheckbox.setAttribute('value', 'done');
			nowyCheckbox.setAttribute('id', 'task'+i);
			newElement .appendChild(nowyCheckbox );
			var nowyLabel = document.createElement('label');
			nowyLabel.setAttribute('for', 'task'+i);
			newElement .appendChild(nowyLabel);
			if(tasklist[i].body.is_done==true) newElement.lastChild.previousSibling.checked=true;
			listazadan.appendChild(newElement);
			licznik++;
			var checklistener = nowyCheckbox;
			if (checklistener) checklistener.addEventListener('change',checkedUnchecked, false);
			var removelistener = nowyPrzycisk;
			if (removelistener) removelistener.addEventListener('click',removeTask, false);
			
		}
	}
	console.log(licznik);
	if(licznik==0){
		var BrakZadanInfo = document.createElement('h5');
		BrakZadanInfo.innerHTML="Aktualnie nie masz żadnych zadań. ";
		listazadan.appendChild(BrakZadanInfo);
	}
}

function removeTask(e){ //szukam numeru w id za pomoca wyrażeń regularnych i usuwam (chowam) zadanie i na koniec odswiezam stan zadan
	x = e.target.id;
	var r = /\d+/;
	y=x.match(r);
	tasklist[y].archiwalne=true;
	qwest.delete(url+'/'+tasklist[y].id, null, {cache: true}).then(function(xhr, response) { // usuwamy zadanie o danym identyfikatorze (tym razem nie musimy przesyłać ciała takiego zadania)
		getTasks(); // odświeżamy stan strony
		});
}

function checkedUnchecked(e){ //taka sama zasada jak w removeTask
	x = e.target.id;
	var r = /\d+/;
	y=x.match(r);
	tasklist[y].body.is_done=!tasklist[y].body.is_done;
	qwest.map('PATCH', url+'/'+tasklist[y].id, tasklist[y].body, {cache: true}).then(function(xhr, response) { 
		getTasks(); // odświeżamy stan strony
	});
}

function getTasks() { // pobieramy listę zadań po wystąpieniu odpowiedniego zdarzenia
	tasklist= [];
	alltasks=0;
	qwest.get(url, {}, {cache: true}).then(
		function(xhr, response) {
			response.forEach(function(element) { // wywołujemy dla każdego pobranego zasobu
				tasklist.push(element);
				tasklist[alltasks].archiwalne=false;
				alltasks++;	
				
				Reload();	
	})});
	
				Reload();	
}

var addtask = document.getElementById('dodaj');
addtask.addEventListener('click', newTask, false);
var addtaskenter = document.getElementById('dodajtext');
addtaskenter.addEventListener('keypress', function (e) {if (e.keyCode == 13) newTask()},false);
document.onload = getTasks();
