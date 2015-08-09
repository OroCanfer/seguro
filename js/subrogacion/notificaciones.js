var contTabla;
var conSecciones;
var conRevisar;
var comboSecciones;
var comboPrioridad;
var revision=0;
var seccion;
var prioridad;
window.onload = function Inicializar() {
	comboSecciones = document.getElementById('secciones');
    comboPrioridad = document.getElementById('prioridad');
	cargarComboSecciones();
    director('todas','Urgente','En espera de director',0);
}

function revisarSolicitud(id,tipo){
    conRevisar = crearXMLHttpRequest();
    var cadena;
    if(tipo==0){
    	verSolicitud();
    }else{
    	cadena = 'tipoQ=2&tipo='+tipo+'&id='+id;
    }
    conRevisar.onreadystatechange = procesarRevisarSoli;
    conRevisar.open('POST', '../../php/notificaciones.php', true);
    conRevisar.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    conRevisar.send(cadena);
    director('todas','Urgente','En espera de director',0);
}

function procesarRevisarSoli() {
    if (conRevisar.readyState == 4) {
    }
}	

function tomarDatosCombos(){
	seccion = comboSecciones.options[comboSecciones.selectedIndex].value;
	prioridad = comboPrioridad.options[comboPrioridad.selectedIndex].value;
}

function actualizarPorCombo(){
	tomarDatosCombos();
	if(revision==0){
	    director(seccion,prioridad,'En espera de director',0);		
	}else{
		director(seccion,prioridad,'',1);
	}
}

function mostrarPorRevisar(){
	tomarDatosCombos();
    director(seccion,prioridad ,'En espera de director',0);	
    revision = 0;
}

function revisadas(){
	tomarDatosCombos();
	director(seccion,prioridad,'',1);
	revision = 1;
}

function director(seccion,prioridad,estado,tipo) {
	directorPorRevisar = crearXMLHttpRequest();
    cadena = 'tipoQ=1&seccion='+seccion+'&prioridad='+prioridad+'&estado='+estado+'&tipo='+tipo;
    directorPorRevisar.onreadystatechange = eventNotif;
    directorPorRevisar.open('POST', '../../php/notificaciones.php', true);
    directorPorRevisar.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    directorPorRevisar.send(cadena);
}

function cargarComboSecciones() {
    conSecciones = crearXMLHttpRequest();
    cadena = 'tipoQ=0';
    conSecciones.onreadystatechange = procesarComboSecciones;
    conSecciones.open('POST', '../../php/notificaciones.php', true);
    conSecciones.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    conSecciones.send(cadena);
}

function procesarComboSecciones() {
    if (conSecciones.readyState == 4) {
        comboSecciones.innerHTML = conSecciones.responseText;
        comboSecciones.selectedIndex = 5;
    }
}

function crearXMLHttpRequest() {
    var xmlHttp = null;
    if (window.ActiveXObject)
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    else
    if (window.XMLHttpRequest)
        xmlHttp = new XMLHttpRequest();
    return xmlHttp;
}

function eventNotif() {
    contTabla = document.getElementById("contTable");
    if (directorPorRevisar.readyState == 4) {
        contTabla.innerHTML = directorPorRevisar.responseText;
    } else {
        contTabla.innerHTML = "Cargando...";
    }
}