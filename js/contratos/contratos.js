var pickerIni;
var pickerFin;
var fechIni;
var fechFin;
var fechaIni;
var fechaFin;
var numContrato;
var causa;
var RFC;
var proveedor;
var saldo;
var contComboServicios = 0;
var contComboProve = 0;
var conEstudios;
var conServicios;
var conUnidades;
var conProveedores;
var conGuardado;
var conGuardadoServicios;
var divselServicios;
var estudiosServicio = [];
var estudios = [];
var clinicas = [];
var estudiosMod = [];
var expRegCausa = new RegExp(/^([\w\\.\\-\s\\,\\;\\:\\"\\ñÑ\\áÁéÉíÍóÓúÚ\\üÜ\\()\\¿?\\¡!]+)*$/);
var expRegNumCont = new RegExp(/^([0-9a-zA-Z])$/);
var expRegRFC = new RegExp(/^([A-Za-z0-9]+)$/);
var expRegSaldo = new RegExp(/^([0-9\\.])$/); /*/\d(\.\d)?/*/
var comboProve;
var comboServ;
var serviciosSel;
var divEstudios;
var divClinicas;
var divBotones;
var divGuardarContrato;
var banServAgregado = 0;
window.onload = function inicializar() {
    createDatePicker();
    cargarComboServicios();
    cargarComboProve();
    obtenerElementos();
}

function aMayus(inp) {
    inp.value = inp.value.toUpperCase();
}

function agregarServicio() {
    var optionServSel = comboServ.options[comboServ.selectedIndex];
    var nombreServicio = optionServSel.value;
    if (nombreServicio == "--Seleccione un servicio--") {
        alert('Es necesario seleccionar un servicio.');
    } else {
        if (estudios.length != 0) {
            if (clinicas.length != 0) {
                estudiosServicio[estudiosServicio.length] = {
                    nombreServicio, estudios, clinicas
                };
                comboServ.removeChild(optionServSel);
                reiniciarCombos();
                cargarServicios();
                estudios = [];
                clinicas = [];
                divClinicas.innerHTML = '';
            } else {
                alert('Debe seleccionar como mínimo una clínica.');
            }
        } else {
            alert('Debe seleccionar como mínimo un estudio.');
        }
    }
}

function pruebas() {
    for (var i = 0; i < estudiosServicio[0].clinicas.length; i++) {
        alert(estudiosServicio[0].clinicas[i]);
    }
}

function checkUnidad(check) {
    var clinica = check.id.replace(/\D/g, '');
    if (check.checked == true) {
        clinicas[clinicas.length] = clinica;
    } else {
        for (var i = 0; i < clinicas.length; i++) {
            if (clinicas[i] == clinica) {
                clinicas.splice(i, 1);
            }
        }
    }
}

function cargarUnidades() {
    conUnidades = crearXMLHttpRequest();
    cadena = 'tipoQ=0';
    conUnidades.onreadystatechange = procesarUnidades;
    conUnidades.open('POST', '../../php/contratos.php', true);
    conUnidades.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    conUnidades.send(cadena);
}

function procesarUnidades() {
    var div = document.getElementById('estado');
    if (conUnidades.readyState == 4) {
        divClinicas.innerHTML = conUnidades.responseText;
        div.innerHTML = '';
    } else {
        div.innerHTML = 'Cargando clínicas';
    }
}

function guardarContrato() {
    if (serviciosSel.hasChildNodes()) {
        guardarDatos();
    } else {
        alert("Es necesario agregar como mínimo un servicio.");
    }
}

function guardarDatos() {
    fechaIni = fechIni.value;
    fechaFin = fechFin.value;
    numContrato = document.getElementById('numContrato').value;
    causa = document.getElementById('causa').value;
    RFC = document.getElementById('RFC').value;
    saldo = document.getElementById('saldoIni').value;
    proveedor = comboProve.options[comboProve.selectedIndex].value;
    idProve = comboProve.selectedIndex + 1;
    if(fechaIni == '' || fechaFin == '' || numContrato == '' || causa == '' || RFC == '' || saldo == '' || proveedor == '--Seleccione un proveedor--'){
        alert('Es necesario llenar todos los datos para poder continuar.');
    }else{
    if (confirm("¿Está seguro de que desea agregar el contrato?")) {
        conGuardado = crearXMLHttpRequest();
        cadena = 'tipoQ=4&fechaIni=' + fechaIni + '&fechaFin=' + fechaFin + '&numContrato=' + numContrato + '&causa=' + causa + '&RFC=' + RFC + '&saldo=' + saldo + '&proveedor=' + idProve;
        conGuardado.onreadystatechange = procesarGuardadoDatos;
        conGuardado.open('POST', '../../php/contratos.php', true);
        conGuardado.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        conGuardado.send(cadena);
        }
    }
}

function procesarGuardadoDatos() {
    var div = document.getElementById('estado');
    if (conGuardado.readyState == 4) {
        if(conGuardado.responseText == 0){
            alert('Verifique los datos introducidos.');
        }else{
            guardarServicios(conGuardado.responseText);
        }
    } else {
        div.innerHTML = 'Guardando contrato.';
    }
}

function guardarServicios(ultimoId) {
    alert(ultimoId+'asd');
    conGuardadoServicios = crearXMLHttpRequest();
    for (var i = 0; i < estudiosServicio.length; i++) {
        alert(estudiosServicio[i].nombreServicio);
        cadena = 'tipoQ=5&ultimoId='+ultimoId+'&servicio=' +
            estudiosServicio[i].nombreServicio + '&estudios=' + estudiosServicio[i].estudios + '&clinicas=' + estudiosServicio[i].clinicas;
        conGuardadoServicios.onreadystatechange = procesarGuardadoServicios;
        conGuardadoServicios.open('POST', '../../php/contratos.php', true);
        conGuardadoServicios.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        conGuardadoServicios.send(cadena);
    }
}

function procesarGuardadoServicios() {
    var div = document.getElementById('estado');
    if (conGuardadoServicios.readyState == 4) {
        div.innerHTML = conGuardadoServicios.responseText;
    } else {
        div.innerHTML = 'Guardando servicios.';
    }
}

/*function checkCliqueadoMod(check) {
    var estudio = check.id.replace(/\D/g, '');
    if (check.checked == true) {
        estudiosMod[estudiosMod.length] = estudio;
    } else {
        for (var i = 0; i < estudiosMod.length; i++) {
            if (estudiosMod[i] == estudio) {
                estudiosMod.splice(i, 1);
            }
        }
    }
}*/

function reiniciarCombos() {
    var op = document.createElement("OPTION");
    var txt = document.createTextNode("--Seleccione un servicio--");
    op.appendChild(txt);
    comboServ.insertBefore(op, comboServ.firstChild);
    comboServ.selectedIndex = 0;
    contComboServicios = 0;
}

/*function guardarCambios() {
    if (estudiosMod.length != 0) {
        estudiosServicio[id].estudios = estudiosMod;
        divEstudios.innerHTML = '';
        divBotones.innerHTML = '<input id="btnServicios" onclick="agregarServicio()" value="Añadir servicio." type="button"/><input id="btnEstudios" onclick="cargarEstudios()" value="Agregar estudios." type="button"/>';
        var optionServSel = comboServ.options[comboServ.selectedIndex];
        comboServ.removeChild(optionServSel);
        divEstudios.innerHTML = "";
        reiniciarCombos();
        estudiosMod = [];
    } else {
        alert("No puede dejar un servicio sin estudios.");
    }
}

function modificar(btnId) {
    id = btnId.replace(/\D/g, '');
    servicio = document.getElementById("servicio" + id).innerHTML;
    divBotones.innerHTML = '<input id="guardarCambios" type="button" value="Guardar cambios" onclick="guardarCambios()"></input><input id="cancelarCambios" type="button" value="Cancelar" onclick="cancelarCambios()"></input>';
    comboServ.removeChild(comboServ.firstChild);
    op = document.createElement("OPTION");
    txt = document.createTextNode(servicio);
    op.appendChild(txt);
    comboServ.insertBefore(op, comboServ.firstChild);
    contComboServicios = 1;
    comboServ.selectedIndex = 0;
    cargarEstudiosModif(servicio, estudiosServicio[id].estudios);
    estudiosMod = estudiosServicio[id].estudios;
}

function cancelarCambios() {
    var optionServSel = comboServ.options[comboServ.selectedIndex];
    comboServ.removeChild(optionServSel);
    divEstudios.innerHTML = "";
    divBotones.innerHTML = '<input id="btnServicios" onclick="agregarServicio()" value="Añadir servicio." type="button"/><input id="btnEstudios" onclick="cargarEstudios()" value="Agregar estudios." type="button"/>';
    reiniciarCombos();
    estudiosMod = [];
}

function cargarEstudiosModif(servicio, estudiosSeleccionados) {
    conEstudios = crearXMLHttpRequest();
    cadena = 'tipoQ=4&servicio=' + servicio + '&estudiosSeleccionados=' + estudiosSeleccionados;
    conEstudios.onreadystatechange = procesarEstudios;
    conEstudios.open('POST', '../php/contratos.php', true);
    conEstudios.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    conEstudios.send(cadena);
}*/

function eliminar(btnId) {
    confirmar = confirm("¿Está seguro que desea eliminar ese servicio?");
    if (confirmar) {
        id = btnId.replace(/\D/g, '');
        servicio = estudiosServicio[id].nombreServicio;
        estudiosServicio.splice(id, 1);
        op = document.createElement("OPTION");
        txt = document.createTextNode(servicio);
        op.appendChild(txt);
        comboServ.appendChild(op);
        cargarServicios();
    }
}

function checkCliqueado(check) {
    var estudio = check.id.replace(/\D/g, '');
    if (check.checked == true) {
        estudios[estudios.length] = estudio;
    } else {
        for (var i = 0; i < estudios.length; i++) {
            if (estudios[i] == estudio) {
                estudios.splice(i, 1);
            }
        }
    }
    if (estudios.length != 0) {
        cargarUnidades();
    } else {
        divClinicas.innerHTML = '';
    }
}

function obtenerElementos() {
    comboProve = document.getElementById('proveedores');
    comboServ = document.getElementById('servicios');
    comboCli = document.getElementById('clinicas');
    serviciosSel = document.getElementById('serviciosSeleccionados');
    divselServicios = document.getElementById('selServicios');
    divBotones = document.getElementById('botones');
    divEstudios = document.getElementById('estudios');
    fechIni = document.getElementById('fechIni');
    fechFin = document.getElementById('fechFin');
    divGuardarContrato = document.getElementById('guardarContrato');
    divClinicas = document.getElementById('clinicas');
}
function cargarServicios() {
    if (estudiosServicio.length != 0) {
        var texto = '<div id="divTitServ">Servicio(s) agregado(s)</div>';
        texto +='<div id=serviciosSeleccionadosCont class="estiloCont1">';
        for (var i = 0; i < estudiosServicio.length; i++) {
            texto += '<div id="divServ"><div id="servicio' + i + '" class=divsTab>' + estudiosServicio[i].nombreServicio + '</div></div>';
            texto += '<div id="divButSer"><input id="buttonEli' + i + '" class=" btns btnsTab" type="button" value="Eliminar" onclick="eliminar(this.id)"></input></div>';
        }
            texto+='</div>'
        divGuardarContrato.innerHTML = '<input id="btnGuardarContrato" class="btns" onclick="guardarContrato()" value="Guardar contrato" type="button"/>';
    } else {
        var texto = "";
        divGuardarContrato.innerHTML = "";
    }
    serviciosSel.innerHTML = texto;
    divEstudios.innerHTML = "";
}

function cargarComboProve() {
    conProveedores = crearXMLHttpRequest();
    cadena = 'tipoQ=3';
    conProveedores.onreadystatechange = procesarComboProve;
    conProveedores.open('POST', '../../php/contratos.php', true);
    conProveedores.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    conProveedores.send(cadena);
}

function procesarComboProve() {
    var combo = document.getElementById('proveedores');
    var div = document.getElementById('estado');
    if (conProveedores.readyState == 4) {
        combo.innerHTML = conProveedores.responseText;
        div.innerHTML = '';
    } else {
        div.innerHTML = 'Cargando proveedores';
    }
}

function cargarEstudios(combo) {
    corregirComboServicios(combo);
    var servicio = combo.options[combo.selectedIndex].value;
    conEstudios = crearXMLHttpRequest();
    cadena = 'tipoQ=2&servicio=' + servicio;
    conEstudios.onreadystatechange = procesarEstudios;
    conEstudios.open('POST', '../../php/contratos.php', true);
    conEstudios.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    conEstudios.send(cadena);
}

function corregircomboProve() {
    var combo = document.getElementById('proveedores');
    if (contComboProve == 0) {
        combo.removeChild(combo.firstChild);
    }
    contComboProve = 1;
}

function procesarEstudios() {
    divEstudios = document.getElementById('estudios');
    var divEstado = document.getElementById('estado');
    if (conEstudios.readyState == 4) {
        divEstudios.innerHTML = conEstudios.responseText;
        divEstado.innerHTML = '';
    } else {
        divEstado.innerHTML = 'Cargando servicios';
    }
}

function createDatePicker() {
    pickerIni = new Pikaday({
        field: document.getElementById('fechIni'),
        firstDay: 1,
        minDate: new Date('2015-01-01'),
        maxDate: new Date('2030-12-31'),
        yearRange: [2015, 2030]
    });
    pickerFin = new Pikaday({
        field: document.getElementById('fechFin'),
        firstDay: 1,
        minDate: new Date('2015-01-01'),
        maxDate: new Date('2030-12-31'),
        yearRange: [2015, 2030]
    });
}

function corregirComboUnidades() {
    var combo = document.getElementById('clinicas');
    if (contComboUnidades == 0) {
        combo.removeChild(combo.firstChild);
    }
    contComboUnidades = 1;
}

function corregirComboServicios(combo) {
    if (contComboServicios == 0) {
        combo.removeChild(combo.firstChild);
    }
    contComboServicios = 1;
}

function limitarInput(e, ban) {
    var cod = (document.all) ? e.keyCode : e.which;
    if (cod == 8 || cod == 0) {
        return true;
    }
    switch (ban) {
        case 0:
            return expRegNumCont.test(String.fromCharCode(cod));
            break;
        case 1:
            return expRegCausa.test(String.fromCharCode(cod));
            break;
        case 2:
            return expRegRFC.test(String.fromCharCode(cod));
            break;
        case 3:
            return expRegSaldo.test(String.fromCharCode(cod));
            break;
    }
}

function cargarComboServicios() {
    conServicios = crearXMLHttpRequest();
    cadena = 'tipoQ=1';
    conServicios.onreadystatechange = procesarComboServicios;
    conServicios.open('POST', '../../php/contratos.php', true);
    conServicios.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    conServicios.send(cadena);
}

function procesarComboServicios() {
    var combo = document.getElementById('servicios');
    var div = document.getElementById('estado');
    if (conServicios.readyState == 4) {
        combo.innerHTML = conServicios.responseText;
        div.innerHTML = '';
    } else {
        div.innerHTML = 'Cargando servicios';
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