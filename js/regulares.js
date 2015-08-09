var expresionLet = new RegExp(/^([A-Za-z\\ñÑ\\áÁéÉíÍóÓúÚ\\üÜ\s])*$/);
var expresionLetNum = new RegExp(/^([0-9A-Za-z\\ñÑ\\áÁéÉíÍóÓúÚ\\üÜ\s])*$/);
var expresionNumumero = new RegExp(/^([0-9])*$/);
var expresionRFC = new RegExp(/^([0-9A-Za-z])*$/);

function validarLetras(parametro){
	if(parametro.match(expresionLet)){
		return true;
	}
	return false;
}

function validarLetrasNum(parametro){
	if(parametro.match(expresionLetNum)){
		return true;
	}
	return false;
}

function validarNumeros(parametro){
	if(parametro.match(expresionLetNum)){
		return true;
	}
	return false;
}

function validarRFC(parametro){
	if(parametro.match(expresionRFC)){
		return true;
	}
	return false;
}