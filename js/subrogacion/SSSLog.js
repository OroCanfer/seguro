var user, pass, respuesta;
var expregular = new RegExp(/^([\w\\@\\.\\-\\#]+)*$/);
var expregularEspacio = new RegExp(/^([A-Za-z0-9\\.\\ \\,\\;\\:\\"\\ñÑ\\áÁéÉíÍóÓúÚ\\üÜ\\()\\¿?\\¡!]+)*$/);
var expresionNum = new RegExp("([0-9])");
var expresionSoloNum = new RegExp(/^([0-9])*$/);
var expresionNSS = new RegExp("([0-9\\-])");
var expresionLet = new RegExp(/^([A-Za-z\\ñÑ\\áÁéÉíÍóÓúÚ\\üÜ])*$/);
var expNumLet = new RegExp(/^([A-Z0-9])*$/);
var nSeguroS, ramoSeg, tiposerv, motsub, textDiagnostic, groupsub, servsub, servespecifico, contract, valorRamoS;
var llenarservicios, llenarcontrato;
var log = 0;
var nivel = 0;
var auxpac = 0;
var comb=0;
var nameP, firstNameP, lastNameP, nssP, ageP, curpP, edadAlta;
var OptionSelect, tipSegSelect;
var sexoalta, agregadoAlta, tipSegSelect;
var nssagreready;
var vec = [];
var cont = 0;
var respSession;
var opciones;

/*---------------------------------------------------*/
function validarCampo(parametro){
	if(parametro.match(expregular)){
		return true;
	}
	return false;
}
function validarNNS(parametro){
	if(parametro.match(expresionNum) && parametro.length==13){
		return true;
	}
	return false;
}
function validarNum(parametro){
	if(parametro.match(expresionNum)){
		return true;
	}
	return false;
}
function validarCampoE(parametro){
	if(parametro.match(expregularEspacio)){
		return true;
	}
	return false;
}
function validarLet(parametro){
	if(parametro.match(expresionLet)){
		return true;
	}
	return false;
}
function validarNumLet(parametro){
	if(parametro.match(expNumLet)){
		return true;
	}
	return false;
}
function validarAgrPaSeg(parametro){
	if(parametro.match(expresionSoloNum)){
		return true;
	}
	return false;
}
/*---------------------------------------------------*/
window.onload=function inicializar(){
generalMain();
cargarElementos();
session();
servsub = 0;
nSeguroS=document.getElementById("NSegureS");
nSeguroSAgre = document.getElementById("selectAgregado");
nssagreready = 0;
nSeguroSAgre.disabled=true;
}
function llenarcombos(){
	if(opt==1){
		var pasar = 'opc='+opt;
	}else{
		var pasar = 'opc='+opt+'&servespecifico='+servespecifico.options[servespecifico.selectedIndex].text;
	}
	con = crearXMLHttpRequest();
	con.onreadystatechange = processevents;
	con.open("POST", '../../php/solicitud.php', true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}
function processevents(){
	if(con.readyState == 4){
		if(opt==1){
			servsub = document.getElementById('textEspecific');
			servsub.innerHTML = con.responseText;
			servespecifico = document.getElementById('textStudio');
		}else{
			llenarcontrato = document.getElementById('optionContract');
			llenarcontrato.innerHTML = con.responseText;
		}
	}
}
function cambcont(){
	if(llenarcontrato.selectedIndex!=0){
		opt = 3;
		var pasar = 'opc='+opt+'&numero='+llenarcontrato.options[llenarcontrato.selectedIndex].text;
		con = crearXMLHttpRequest();
		con.onreadystatechange = datosproveedor;
		con.open("POST", '../../php/solicitud.php', true);
		con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		con.send(pasar);
	}else{
		resetDatosProve();
	}
}
function datosproveedor(){
	if(con.readyState == 4){
		var datos = con.responseText.split("*&*");
		document.getElementById('nameProv').innerHTML = "Nombre o razon social: "+datos[0];
		document.getElementById('domicileProv').innerHTML = "Domicilio: "+datos[1];
		document.getElementById('validityProv').innerHTML = "Vigencia del: "+datos[2]+" al "+datos[3];
		document.getElementById('rfcProv').innerHTML = "RFC: "+datos[4];
		document.getElementById('telProv').innerHTML = "Tel: "+datos[5];
	}
}
function cambServ(){
	if(servsub.selectedIndex!=0){
		opt = 5;
		var pasar = 'opc='+opt+'&servsub='+servsub.options[servsub.selectedIndex].text;
		con = crearXMLHttpRequest();
		con.onreadystatechange = llenarestudios;
		con.open("POST", '../../php/solicitud.php', true);
		con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		con.send(pasar);
	}else{
		servespecifico.innerHTML = "<option>Por favor, llene el campo anterior</option>"
	}
}
function resetDatosProve(){
	document.getElementById('nameProv').innerHTML = "Nombre o razon social:";
	document.getElementById('domicileProv').innerHTML = "Domicilio:";
	document.getElementById('validityProv').innerHTML = "Vigencia del:";
	document.getElementById('rfcProv').innerHTML = "RFC:";
	document.getElementById('telProv').innerHTML = "Tel:";
}
function llenarestudios(){
	if(con.readyState == 4){
		servespecifico.innerHTML = con.responseText;
	}
}
function procesarEventos(){
	if(con.readyState == 4){
		nivel = con.responseText;
	}else {
		contPBody.style.display="none";
		loading.appendChild(imgload);
		setTimeout(function(){ 
		loading.removeChild(imgload);},1500);
		contPBody.style.display="block";
	}
}
function valExistNSS(){
	var pasar = "opc=6&pac="+nSeguroS.value;
	con = crearXMLHttpRequest();
	con.onreadystatechange = mostrarAlta;
	con.open("POST", '../../php/solicitud.php', true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}
function mostrarAlta(){
	if(con.readyState == 4){
		var tmp = con.responseText.split("//");
		if(!validarAgrPaSeg(tmp[0])){
			alert("El paciente y/o el agregado del paciente no existe.\nPor favor, realice el alta del paciente y el agregado.");
			nSeguroSAgre.disabled=true;
			nSeguroSAgre.innerHTML = "<option>Llenar el campo anterior</option>";
			var agpac=document.getElementById('agregarpac');
			agpac.innerHTML = con.responseText;
            agpac.style.opacity="1";
			agpac.style.transition="opacity 2s";
			areaInsuAfect.style.marginTop="7.800em";
		    contPBodyPass[0].style.height="530px";
		    contPBodyPass[0].style.transition="height 0.65s";
			areaInsuAfect.style.transition="margin-top 0.65s";
			Dpicker();
			auxpac = 1;
		}else{
			nSeguroSAgre.disabled=false;
			opciones = tmp[1].split("&");
			var tempopc = "<option>Seleccionar una opción</option>";
			for(i=0; i<tmp[0]*2; i++){
				tempopc += "<option>"+opciones[i]+"</option>";
				i++;
			}
			nSeguroSAgre.innerHTML = tempopc;
		}
		if(auxpac == 1 && nssagreready == 1){
			removeralta();
		}
	}
}
function Dpicker(){
	$(function(){
		$('.datepicker').datepicker();
	});
}
/*-----------------------------------------------*/
function pESession(){
	var sessionCu = document.getElementById("sessionCu");
	if(x.readyState == 4){
		respSession = x.responseText;
		if(respSession != "0"){
			sessionCu.innerHTML = respSession.substring(0, respSession.length-1);	
		}else{
           window.location="../login/login.html";
		}
	}else{
		sessionCu.innerHTML= "Cargando...";
	}
}
function pECloseSession(){
	var cerrarSession= document.getElementById("cerrarSession");
	if(x.readyState == 4){
		window.location="../login/login.html";
	}else{
		cerrarSession.innerHTML= "Cargando...";
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
function session(){
	var op= 'op='+1;
	x = crearXMLHttpRequest();
	x.onreadystatechange = pESession;
	x.open('POST','../../php/sesiones.php',true);
	x.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	x.send(op);
}
/*-------------------------------------------------------------------------------------------------------------------------*/
function cerrarSession1(){
	var op= 'op='+2;
	x = crearXMLHttpRequest();
	x.onreadystatechange = pECloseSession;
	x.open('POST','../../php/sesiones.php',true);
	x.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	x.send(op);

}
/*-------------------------------------------------------------------------------------------------------------------------*/
function validarPaso1(){
	var ban=0;
	ramoSeg = document.getElementsByName("opc");
	tiposerv = document.getElementById('optionServ');
	motsub = document.getElementById('optionReason');
	for(var e=0; e< ramoSeg.length;e++){
		if(ramoSeg[e].checked){
			valorRamoS = ramoSeg[e].value;
			ban=1;
			break;
		}else{
			ban=0;
		}
	}
	if(nssagreready == 1 && ban!=0 && tiposerv.selectedIndex!=0 && motsub.selectedIndex!=0){
		return true;
	}
	alert('Algún dato ingresado es incorrecto y/o ha dejado algún campo vacio, por favor, verifique los datos introducidos.');
	return false;
}
function paso1RegPac(){
	nameP = document.getElementById("nameP");
	firstNameP = document.getElementById("firstNameP");
	lastNameP = document.getElementById("lastNameP");
	nssP= document.getElementById("nssP");
	curpP = document.getElementById("curpP");
	ageP = document.getElementById("ageP");
	sexoalta = document.getElementById("sexoalta");
	agregadoAlta = document.getElementById("agregadoalta");
	tipSegSelect = document.getElementById("tipoSegAlta");
	validarRegPac(nameP,validarLet(nameP.value));
	validarRegPac(firstNameP,validarLet(firstNameP.value));
	validarRegPac(lastNameP,validarLet(lastNameP.value));
	validarRegPac(nssP,validarAgrPaSeg(nssP.value));
	validarRegPac(curpP,validarNumLet(curpP.value));
	validarSelect(sexoalta);
	validarSelect(agregadoAlta);
	validarSelect(tipSegSelect);
	if(vec[0] == 1 && vec[1] == 1 && vec[2] == 1 && vec[3] == 1 && vec[4] == 1 && vec[5] == 1 && vec[6] == 1 && vec[7] == 1){
		altapaciente();
	}else{
		alert("Algún dato ingresado es incorrecto y/o ha dejado algún campo vacio, por favor, verifique los datos introducidos.");
	}
}
function altapaciente(){
	cont = 0;
	var pasar = "opc=7&name="+nameP.value+"&primerApe="+firstNameP.value+"&segundoApe="+lastNameP.value+"&nssAlta="+nssP.value+"&curp="+curpP.value+"&agre="+agregadoAlta.selectedIndex+"&tipo="+tipSegSelect.options[tipSegSelect.selectedIndex].text+"&sexo="+sexoalta.options[sexoalta.selectedIndex].text+"&edad="+ageP.value+"&unit="+respSession.substring(respSession.length-1);
	con = crearXMLHttpRequest();
	con.onreadystatechange = insertPaciente;
	con.open("POST", '../../php/solicitud.php', true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);

}
function insertPaciente(){
	if(con.readyState == 4){
		alert(con.responseText.substring(0, con.responseText.length-5));
		if(con.responseText.substring(con.responseText.length-4, con.responseText.length) == 'true'){
			removeralta();
			nssagreready = 1;
		}
	}
}
function validarRegPac(a,validacion){
	if(validacion==true && a.value.length != 0){
		a.style.border="";
		vec[cont] = 1;
		cont++;
	}else{
		a.style.border="1px solid red";
		vec[cont] = 0;
		cont++;
		return false;
	}
}
function validarSelect(b){
	if(b.selectedIndex > 0){
		b.style.border="";
		vec[cont] = 1;
		cont++;
		return true;
	}else{
		b.style.border="1px solid red";
		vec[cont] = 0;
		cont++;
    	return false;
	}
}
function eventText(e){
	espacio=e.keyCode;
}
function validarPaso2(){
	textDiagnostic = document.getElementById("diagnostic");
	groupsub = document.getElementById('optionSubrogate');
	if(textDiagnostic.value.length>0 && validarCampoE(textDiagnostic.value)){
		textDiagnostic.style.border="";
		if(espacio==32 && textDiagnostic.value.length==1){
			alert("El cuadro de diagnostico se encuentra vacio y/o contiene caracteres no permitidos, por favor, verifique los datos ingresados.");
		    textDiagnostic.style.border="1px solid red";
			return false;
		}else{
			if(groupsub.selectedIndex!=0 && servsub.selectedIndex!=0 && servespecifico.selectedIndex!=0){
			return true;
			}else{
				alert("No ha seleccionado grupo y/o servicio a subrogar, por favor, seleccione ambos datos correctamente.");
			}
		}
		
	}else{
		alert("El cuadro de diagnostico se encuentra vacio y/o contiene caracteres no permitidos, por favor, verifique los datos ingresados.");
		textDiagnostic.style.border="1px solid red";
		return false;
	}		
}
function validarPaso3(){
	contract = document.getElementById('optionContract');
	if(contract.selectedIndex!=0){
		return true;
	}
	alert("No ha seleccionado un contrato válido, por favor verifique el contrato seleccionado.");
	return false;
}
function procesarTramite(){
	var pid = 0;
	for (i=0; i<opciones.length; i++) {
		if(opciones[i] == nSeguroSAgre.options[nSeguroSAgre.selectedIndex].text){
			pid = opciones[i+1];
			break;
		}
		i++;
	}
	var temp = tiposerv.options[tiposerv.selectedIndex].text;
	contrat = document.getElementById('optionContract');
	tiposerv = temp.substring(0,2);
	motsub = motsub.options[motsub.selectedIndex].text;
	groupsub = groupsub.options[groupsub.selectedIndex].text;
	servsub = servsub.options[servsub.selectedIndex].text;
	servespecifico = servespecifico.options[servespecifico.selectedIndex].text;
	contract = contract.options[contract.selectedIndex].text;
	var pasar = 'opc=4&pid='+pid+'&ramoSeg='+valorRamoS+'&tiposervicio='+tiposerv+'&motsub='+motsub+'&textDiagnostic='+textDiagnostic.value+'&gruposub='+groupsub+'&servsub='+servsub+'&servespecifico='+servespecifico+'&contrato='+contract;
	con = crearXMLHttpRequest();
	con.onreadystatechange = insertSolicitud;
	con.open("POST", '../../php/solicitud.php', true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}
function insertSolicitud(){
	if(con.readyState == 4){
		alert(con.responseText);
		window.location = "SSS.html";
	}
}
