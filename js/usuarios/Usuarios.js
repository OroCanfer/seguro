var tramite;
var nombre, apePat, apeMat, curp, matricula, cargo, cargoObject, rfc, sexo, sexoObject, unidad;

window.onload=function inicializar(){

}

function obtenerValores(opc){
	tramite = opc;
	switch(tramite){
		case 1:
			nombre = document.getElementById('nombre').value
			apePat = document.getElementById('apePat').value
			apeMat = document.getElementById('apeMat').value
			curp = document.getElementById('curp').value
			matricula = document.getElementById('matricula').value
			cargoObject = document.getElementById('cargo');
			cargo = cargoObject.options[cargoObject.selectedIndex].text.substring(0,3);
			rfc = document.getElementById('rfc').value
			sexoObject = document.getElementById('sexo');
			sexo = sexoObject.options[sexoObject.selectedIndex].text.substring(0,1);
			unidad = document.getElementById('unidad').selectedIndex;
			break;
		case 2:
			nombre = document.getElementById('nombreEdit').value
			apePat = document.getElementById('apePatEdit').value
			apeMat = document.getElementById('apeMatEdit').value
			curp = document.getElementById('curpEdit').value
			matricula = document.getElementById('matriculaEdit').value
			cargoObject = document.getElementById('cargoEdit');
			cargo = cargoObject.options[cargoObject.selectedIndex].text.substring(0,3);
			rfc = document.getElementById('rfcEdit').value
			sexoObject = document.getElementById('sexoEdit');
			sexo = sexoObject.options[sexoObject.selectedIndex].text.substring(0,1);
			unidad = document.getElementById('unidadEdit').selectedIndex;
			break;
	}
}

function solicitarElimProve(){
	var pasar= 'opc='+3+"&proveedor="+proveedorAct;
	con = crearXMLHttpRequest();
	con.onreadystatechange = respuestaAltaProve;
	con.open('POST','../php/proveedores.php',true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}

function detallesProveedor(){
	if(con.readyState == 4){

	}
}

function confirmar(){
	if(confirm("¿Esta seguro que desea eliminar a este usuario?")){
		solicitarElimProve();
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