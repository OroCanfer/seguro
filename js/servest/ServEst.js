var comboServ, aux, nombreestudio, precioestudio, proceso, comboEst, servMod;

window.onload=function inicializar(){
	comboServ = document.getElementById('servElegido');
	comboEst = document.getElementById('estElegido');
	cargarServicios();
	aux = 0;
	document.getElementById('estudio').disabled = true;
	document.getElementById('precio').disabled = true;
	document.getElementById('altaEst').disabled = true;
	document.getElementById('estudioEdit').disabled = true;
	document.getElementById('precioEdit').disabled = true;
	document.getElementById('modEst').disabled = true;
	document.getElementById('servMod').disabled = true;
}

function revisar(){
	if(comboServ.selectedIndex!=0){
		document.getElementById('estudio').disabled = false;
		document.getElementById('precio').disabled = false;
		document.getElementById('altaEst').disabled = false;
		aux = 1;
	}else{
		aux = 0;
		resetAlta();
	}
}

function revisarEdit(){
	if(comboEst.selectedIndex!=0){
		document.getElementById('estudioEdit').disabled = false;
		document.getElementById('estudioEdit').value = comboEst.options[comboEst.selectedIndex].text;
		document.getElementById('precioEdit').disabled = false;
		document.getElementById('servMod').disabled = false;
		document.getElementById('modEst').disabled = false;
	}else{
		resetEdit();
	}
}

function validardatos(tipo){
	proceso = tipo;
	if(proceso==1){
		nombreestudio = document.getElementById('estudio').value;
		precioestudio = document.getElementById('precio').value;
	}else{
		nombreestudio = document.getElementById('estudioEdit').value;
		precioestudio = document.getElementById('precioEdit').value;
	}
	if(validarLetras(nombreestudio) && validarDinero(precioestudio)){
		if(proceso==1){
			addEst();
		}else if(proceso==2 && servMod.selectedIndex!=0){
			editEst();
		}else{
			alert('Algún dato ingresado es incorrecto y/o ha dejado algún campo vacio, por favor, verifique los datos introducidos.');
		}
	}else{
		alert('Algún dato ingresado es incorrecto y/o ha dejado algún campo vacio, por favor, verifique los datos introducidos.');
	}
}

function addEst(){
	var pasar= 'opc='+4+"&estudio="+nombreestudio+"&precio="+precioestudio+"&servicio="+comboServ.selectedIndex;
	con = crearXMLHttpRequest();
	con.onreadystatechange = respuesta;
	con.open('POST','../php/serviciosestudios.php',true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}

function editEst(){
	var pasar= 'opc='+5+"&estupdate="+nombreestudio+"&precio="+precioestudio+"&servicio="+servMod.selectedIndex+"&estudio="+comboEst.selectedIndex;
	con = crearXMLHttpRequest();
	con.onreadystatechange = respuesta;
	con.open('POST','../php/serviciosestudios.php',true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}

function addServ(){
	var newServ = prompt("Introduzca el nombre del nuevo servicio.", "");
	if(newServ!=null){
		if(newServ!="" && validarLetras(newServ)){
			proceso = 1;
			var pasar= 'opc='+1+"&servicio="+newServ;
			con = crearXMLHttpRequest();
			con.onreadystatechange = respuesta;
			con.open('POST','../php/serviciosestudios.php',true);
			con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			con.send(pasar);
		}else{
			alert('El dato ingresado es incorrecto y/o ha dejado el campo vacio, por favor, verifique los datos introducidos.');
		}
	}
}

function respuesta(){
	if(con.readyState == 4){
		alert(con.responseText);
		aux = 0;
		if(proceso == 1){
			resetAlta();
			cargarServicios();
		}else{
			resetEdit();
			cargarServiciosMod();
			comboEst.selectedIndex = 0;
		}
	}
}

function modServ(){
	if(aux == 1){
		var modifServ = prompt("Introduzca el nuevo nombre del servicio.", comboServ.options[comboServ.selectedIndex].text);
		if(modifServ!=null){
			if(modifServ!="" && validarLetras(modifServ)){
				proceso = 1;
				var pasar= 'opc='+2+"&servupdate="+modifServ+"&servicio="+comboServ.selectedIndex;
				con = crearXMLHttpRequest();
				con.onreadystatechange = respuesta;
				con.open('POST','../php/serviciosestudios.php',true);
				con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				con.send(pasar);
			}else{
				alert('El dato ingresado es incorrecto y/o ha dejado el campo vacio, por favor, verifique los datos introducidos.');
			}
		}
	}else{
		alert("No hay ningún servicio seleccionado. Por favor, primero elija el servicio que desea modificar.");
	}
}

function cargarServicios(){
	var pasar= 'opc='+3;
	con = crearXMLHttpRequest();
	con.onreadystatechange = mostrarServicios;
	con.open('POST','../../php/serviciosestudios.php',true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}

function mostrarServicios(){
	if(con.readyState == 4){
		comboServ.innerHTML = con.responseText;
	}
}

function cargarEstudios(){
	var pasar= 'opc='+6;
	con = crearXMLHttpRequest();
	con.onreadystatechange = mostrarEstudios;
	con.open('POST','../php/serviciosestudios.php',true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}

function mostrarEstudios(){
	if(con.readyState == 4){
		comboEst.innerHTML = con.responseText;
	}
}

function cargarServiciosMod(){
	var pasar= 'opc='+3;
	x = crearXMLHttpRequest();
	x.onreadystatechange = mostrarServiciosMod;
	x.open('POST','../php/serviciosestudios.php',true);
	x.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	x.send(pasar);
}

function mostrarServiciosMod(){
	if(x.readyState == 4){
		servMod = document.getElementById('servMod');
		servMod.innerHTML = x.responseText;
	}
}
function crearXMLHttpRequest(){
	var xmlHttp=null;
	if (window.ActiveXObject) 
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	else 
		if (window.XMLHttpRequest) 
			xmlHttp = new XMLHttpRequest();
	return xmlHttp;
}

function temp(){
	cargarEstudios();
	cargarServiciosMod();
}

function resetAlta(){
	document.getElementById('estudio').disabled = true;
	document.getElementById('precio').disabled = true;
	document.getElementById('altaEst').disabled = true;
	document.getElementById('estudio').value = null;
	document.getElementById('precio').value = null;
	comboServ.selectedIndex = 0;
}

function resetEdit(){
	document.getElementById('estudioEdit').disabled = true;
	document.getElementById('estudioEdit').disabled = true;
	document.getElementById('servMod').disabled = true;
	document.getElementById('modEst').disabled = true;
	document.getElementById('estudioEdit').value = null;
	document.getElementById('precioEdit').value = null;
	document.getElementById('servMod').selectedIndex = 0;
}