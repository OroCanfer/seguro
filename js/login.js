var user, pass, respuesta;
var expregular = new RegExp(/^([\w\\@\\.\\-\\#]+)*$/);
var cargo = 0;
function getUsernPass(){
	respuesta = document.getElementById('respuesta');
	respuesta.innerHTML = '';
	
	user = document.getElementById('user').value;
	pass = document.getElementById('pass').value;

	if(!isNaN(user) && largoMatricula(user) && validarCampoText(pass)){
		iniciarsesion();
	}else{
		respuesta.innerHTML = 'Ha dejado algún campo vacio o ha ingresado caracteres NO permitidos.<br><br>El nombre de usuario debe ser solo número con un largo mínimo de 7 caracteres.';
	}
}
function largoMatricula(mat){
	if(mat.length>=7 && mat.length<=10){
		return true;
	}
	return false;
}
function validarCampoText(parametro){
	if(parametro.match(expregular)){
		return true;
	}
	return false;
}
function iniciarsesion(){
	var pasar = 'matricula='+user+'&password='+pass;
	con = crearXMLHttpRequest();
	con.onreadystatechange = procesarEventosLog;
	con.open("POST", '../../php/logica.php', true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}
function procesarEventosLog(){
	var load = document.createElement('img');
	load.src = '../../img/loader3.gif';
	if(con.readyState == 4){
		cargo = con.responseText;
		if(cargo!=0){
			respuesta.innerHTML = '';
			respuesta.appendChild(load);
			setTimeout(function (){window.location="../subrogacion/SSS.html";},1500);
		}else{
			respuesta.innerHTML = "Datos de sesión incorrectos.";
		}
	}
	else {
		respuesta.innerHTML = "Estamos validando los datos de inicio de sesión, por favor espere."
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
/*-------------------------------------------------------------------------------------------------------------------------*/