var nombre, dir, rfc, tel, fax, fechaIni, fechaFin, mat, proveedorAct, comboProveedor, tramite;

window.onload=function inicializar(){
	cargarProveedores();
	document.getElementById('editar').disabled = true;
	document.getElementById('eliminar').disabled = true;
}

function obtenerValores(ope){
	tramite = ope;
	switch(tramite){
		case 1:
			nombre = document.getElementById('nombre').value;
			dir = document.getElementById('dir').value;
			rfc = document.getElementById('rfc').value;
			tel = document.getElementById('tel').value;
			fax = document.getElementById('fax').value;
			fechaIni = document.getElementById('fechaIni').value;
			fechaFin = document.getElementById('fechaFin').value;
			mat = document.getElementById('mat').value;

			if(validarLetras(nombre) && validarLetrasNum(dir) && validarRFC(rfc) && validarNumeros(tel) && validarNumeros(fax) && fechaIni.length!=0 && fechaFin.length!=0 && validarNumeros(mat)){
				solicitarAltaProve();
			}else{
				alert('Algún dato ingresado es incorrecto y/o ha dejado algún campo vacio, por favor, verifique los datos introducidos.');
			}
			break;
		case 2:
			nombre = document.getElementById('nombreEdit');
			dir = document.getElementById('dirEdit');
			rfc = document.getElementById('rfcEdit');
			tel = document.getElementById('telEdit');
			fax = document.getElementById('faxEdit');
			fechaIni = document.getElementById('fechaIniEdit');
			fechaFin = document.getElementById('fechaFinEdit');
			mat = document.getElementById('matEdit');
			break;
	}
}

function solicitarAltaProve(){
	var pasar= 'opc='+1+"&nombre="+nombre+"&direccion="+dir+"&rfc="+rfc+"&telefono="+tel+"&fax="+fax+"&fechaIni="+fechaIni+"&fechaFin="+fechaFin+"&matricula="+mat;
	con = crearXMLHttpRequest();
	con.onreadystatechange = respuestaAltaProve;
	con.open('POST','../../php/proveedores.php',true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}

function respuestaAltaProve(){
	if(con.readyState == 4){
		alert(con.responseText);
		if(tramite == 1){
			resetDatosAlta();
		}else{
			resetDatosEdit();
			cargarProveedores();
		}
	}
}

function resetDatosAlta(){
	document.getElementById('nombre').value = "";
	document.getElementById('dir').value = "";
	document.getElementById('rfc').value = "";
	document.getElementById('tel').value = "";
	document.getElementById('fax').value = "";
	document.getElementById('fechaIni').value = "";
	document.getElementById('fechaFin').value = "";
	document.getElementById('mat').value = "";
}

function resetDatosEdit(){
	document.getElementById('nombreEdit').value = "";
	document.getElementById('dirEdit').value = "";
	document.getElementById('rfcEdit').value = "";
	document.getElementById('telEdit').value = "";
	document.getElementById('faxEdit').value = "";
	document.getElementById('fechaIniEdit').value = "";
	document.getElementById('fechaFinEdit').value = "";
	document.getElementById('matEdit').value = "";
}

function verificar(){
	if(validarLetras(nombre.value) && validarLetrasNum(dir.value) && validarRFC(rfc.value) && validarNumeros(tel.value) && validarNumeros(fax.value) && fechaIni.length!=0 && fechaFin.length!=0 && validarNumeros(mat.value)){
		solicitarEditProve();
	}else{
		alert('Algún dato ingresado es incorrecto y/o ha dejado algún campo vacio, por favor, verifique los datos introducidos.');
	}
}

function solicitarEditProve(){
	var pasar= 'opc='+2+"&nombre="+nombre.value+"&direccion="+dir.value+"&rfc="+rfc.value+"&telefono="+tel.value+"&fax="+fax.value+"&fechaIni="+fechaIni.value+"&fechaFin="+fechaFin.value+"&matricula="+mat.value+"&proveedor="+proveedorAct;
	con = crearXMLHttpRequest();
	con.onreadystatechange = respuestaAltaProve;
	con.open('POST','../../php/proveedores.php',true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}

function cargarProveedores(){
	var pasar= 'opc='+4;
	con = crearXMLHttpRequest();
	con.onreadystatechange = cargarComboProveedores;
	con.open('POST','../../php/proveedores.php',true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}

function cargarComboProveedores(){
	if(con.readyState == 4){
		comboProveedor = document.getElementById('proveElegido');
		comboProveedor.innerHTML = con.responseText;
	}
}
function SolicitarDetallesProve(){
	if(comboProveedor.selectedIndex!=0){
		document.getElementById('editar').disabled = false;
		document.getElementById('eliminar').disabled = false;
		var pasar= 'opc='+5+"&proveName="+comboProveedor.options[comboProveedor.selectedIndex].text;
		tramite = 2;
		obtenerValores(tramite);
		con = crearXMLHttpRequest();
		con.onreadystatechange = detallesProveedor;
		con.open('POST','../../php/proveedores.php',true);
		con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		con.send(pasar);
	}else{
		document.getElementById('editar').disabled = true;
		document.getElementById('eliminar').disabled = true;
		resetDatosEdit();
	}
}

function detallesProveedor(){
	if(con.readyState == 4){
		var datos = con.responseText.split("*&*");
		nombre.value = datos[0];
		dir.value = datos[1];
		rfc.value = datos[2];
		proveedorAct = datos[2];
		tel.value = datos[3];
		fax.value = datos[4];
		fechaIni.value = datos[5];
		fechaFin.value = datos[6];
		mat.value = datos[7];
	}
}

function solicitarElimProve(){
	var pasar= 'opc='+3+"&proveedor="+proveedorAct;
	tramite = 2;
	con = crearXMLHttpRequest();
	con.onreadystatechange = respuestaAltaProve;
	con.open('POST','../../php/proveedores.php',true);
	con.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	con.send(pasar);
}

function confirmar(){
	if(confirm("¿Esta seguro que desea eliminar a este proveedor?")){
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