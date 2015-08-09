var loading, imgload, contPBody;
var onePass;
var twoPass;
var threePass;
var btnPass1;
var btnPass2;
var btnPass3;
var showCont;
var opt = 1;
var contPBodyPass;
var contadorP2=0;
var contadorP3=0;
//var areaInsuAfect;
/*---------------------------------------------------*/
/*---------------------------------------------------*/
function cargarElementos(){
onePass=document.getElementById("contPBodyPass1");
twoPass= document.getElementById("contPBodyPass2");
twoPass.style.display="none";
threePass= document.getElementById("contPBodyPass3");
threePass.style.display="none";
btnPass2=document.getElementById("pass2");
btnPass2.style.display= "none";
btnPass3=document.getElementById("pass3");
btnPass3.style.display= "none";
showCont=document.getElementsByClassName("showCont");
contPBodyPass=document.getElementsByClassName("contPBodyPass");
//showCont[0].style.display="none";
//showCont[1].style.display="none";
//showCont[1].style.opacity="0";
showCont[0].style.display="none";
loading=document.getElementById("loading");
imgload=document.createElement("img");
contPBody=document.getElementById("contPBody");
imgload.src="../../img/loader2.gif";
imgload.style.width="100px";
imgload.style.height="100px";
imgload.style.marginLeft="-30px";
}
/*-------------------------------------------------------------------------------------------------------------------------*/
function contPaso(op){
	switch(op){
		case 1:
			onePass.style.display="";
			twoPass.style.display="none";
			threePass= document.getElementById("contPBodyPass3");
			threePass.style.display="none";
			btnPass2.style.display= "none";
		    btnPass3.style.display= "none";
		break;
		case 2:
			twoPass= document.getElementById("contPBodyPass2");
			twoPass.style.display="";
			onePass= document.getElementById("contPBodyPass1");
			onePass.style.display= "none";
			threePass= document.getElementById("contPBodyPass3");
			threePass.style.display="none";
			btnPass3.style.display= "none";
			if(contadorP3==1){
				resetDatosProve();
			}
		break;
		case 3:
			threePass= document.getElementById("contPBodyPass3");
			threePass.style.display="";
			twoPass= document.getElementById("contPBodyPass2");
			twoPass.style.display="none";
			onePass= document.getElementById("contPBodyPass1");
			onePass.style.display="none";
		break;
		}	
}
function mostPaso(p){
	switch(p){
		case 1:
			if(validarPaso1()){
			 	contPBody.style.display="none";
			    loading.appendChild(imgload);
			 	setTimeout(function(){ 
			 	loading.removeChild(imgload);
			 	contPBody.style.display="block";
			 	crearPaso2();
			 	llenarcombos();
			 	twoPass.style.display= "block";
                onePass.style.display= "none";
				btnPass2.style.display="";
			}, 1000);	
			}
		break;
		case 2:
			if(validarPaso2()){
				opt = 2;
				contPBody.style.display="none";
				loading.appendChild(imgload);
				setTimeout(function(){
				loading.removeChild(imgload);
			 	contPBody.style.display="block";
                twoPass.style.display="none";
                crearPaso3();
                llenarcombos();
				threePass.style.display="block";
				btnPass3.style.display="block";
				},1000);
			}
		break;
		case 3:
			if(validarPaso3()){
				procesarTramite();
			}
		break;
		}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function crearPaso2(){
if(contadorP2==0){
	var contPaso2 ='<div id="diagnosticClinical">';
	contPaso2 +='<h1>Diagnóstico y resumen clínico:</h1>';
	contPaso2 +='<br><br><textarea id="diagnostic" placeholder="Diagnóstico y Resumen Clínico" onkeyup="eventText(event)"></textarea>';
	contPaso2 +='</div>';
	contPaso2 +='<div id="grouptobeSubrogate">';
	contPaso2 +='<h1>Grupo a subrogar:</h1><br><br>';
	contPaso2 +='<select  class="options" id="optionSubrogate">';
	contPaso2 +='<option>Selecciona una opción</option>';
	contPaso2 +='<option>Consulta medicina familiar</option>';
	contPaso2 +='<option>Consulta especialidades</option>';
	contPaso2 +='<option>Consulta dental</option>';
	contPaso2 +='<option>Hospitalización médica</option>';
	contPaso2 +='<option>Hospitalización quirúrgica</option>';
	contPaso2 +='<option>Materno infantil</option>';
	contPaso2 +='<option>Aux de DX en laboratorio</option>';
	contPaso2 +='<option>Aux de DX en gabinete</option>';
	contPaso2 +='<option>Aux de tratamiento</option>';
	contPaso2 +='</select>';  
	contPaso2 +='</div>';
	contPaso2 +='<div id="surrogateService">';
	contPaso2 +='<h1>Servicio(s) a subrogar</h1><br><br><br>';
	contPaso2 +='<select onchange="cambServ()" id="textEspecific"></select>';
	contPaso2 +='<select id="textStudio">';
	contPaso2 +='<option>Por favor, llene el campo anterior</option>';
	contPaso2 +='</select>';
	contPaso2 +='<!--<div class="showCont" id="contentServiceS">';
	contPaso2 +='<input type="text" id="serviceSurrogate" placeholder="Nombre del servicio" class="inputText"></input>';
	contPaso2 +='<br><br><input type="button" value="Agregar" class="btns"></input>';
	contPaso2 +='</div>-->';
	contPaso2 += '</div>';   
	contPaso2 += '<div id="tableSub"></div>';
	contPaso2 += '<div class="nextPass2">';
	contPaso2 += '<input class="btns" id="btnCanceL2" type="button" value="Cancelar"/>';
	contPaso2 += ' <input class="btns" id="btnNextPass2" type="button" value="Continuar" onclick="mostPaso(2)"/>'; 
	contPaso2 += '</div>';
	contPaso2 += '<div class="colorF"></div>';             
	twoPass.innerHTML=contPaso2;
	contadorP2++;
	}
}
//////////////////////////////contPass3/////////////////////////////////////////////////////////////////////
function crearPaso3(){
if(contadorP3==0){
	var contPaso3 ='<div id="provider">';
	contPaso3 += '<div id="contractProvider">';
	contPaso3 += '<h1>Contrato</h1><br><br>';
	contPaso3 += '<label class="labels">Contrato</label>';
	contPaso3 += '<select onchange="cambcont()" id="optionContract" class="options">';
	contPaso3 += '<option>Seleccionar una opcion</option>';
	contPaso3 += '<option>Contratos</option>';
	contPaso3 += '</select>';
	contPaso3 += '</div>';
	contPaso3 += '<div id="infProvider">';
	contPaso3 += '<h1>Proveedor</h1><br><br>';
	contPaso3 += '<label class="labels" id="nameProv">Nombre o razon social:</label>';
	contPaso3 += '<br><br>';
	contPaso3 += '<label class="labels" id="domicileProv">Domicilio:</label>';
	contPaso3 += '<br><br>';
	contPaso3 += '<label class="labels" id="validityProv">Vigencia del:</label>';
	contPaso3 += '<br><br>';
	contPaso3 += '<label class="labels" id="rfcProv">RFC:</label>';
	contPaso3 += '<br><br>';
	contPaso3 += '<label class="labels" id="telProv">Tel:</label>';
	contPaso3 += '<br><br>';
	contPaso3 += '</div>';
	contPaso3 += '</div>';
	contPaso3 += '<div class="nextPass3">';
	contPaso3 += '<input class="btns" id="btnCancel3" type="button" value="Cancelar"/>';
	contPaso3 += ' <input class="btns" id="btnFinalPass3" type="button" value="Finalizar" onclick="mostPaso(3)"/>';
	contPaso3 += '</div>';
	threePass.innerHTML=contPaso3;
	contadorP3++;
	}
}
function validarNSS(e){
    var cod = (document.all) ? e.keyCode : e.which;
    if(cod==8 || cod==0){
      return true;
    }
	return expresionNum.test(String.fromCharCode(cod));
}
function consult(){
	nssagreready = 0;
	if(nSeguroS.value.length == 11 && nSeguroSAgre.disabled == true){
		valExistNSS();
	}else if (auxpac == 1 && nSeguroS.value.length<11){
		nSeguroSAgre.disabled=true;
		removeralta();
	}
	if(nSeguroS.value.length<11){
		nSeguroSAgre.innerHTML = "<option>Llenar el campo anterior</option>";
		nSeguroSAgre.disabled=true;
	}
	if(nSeguroS.value.length == 11 && nSeguroSAgre.selectedIndex != 0 && nSeguroSAgre.disabled == false){
		nssagreready = 1;
	}
}
function removeralta(){
	var divagregar = document.getElementById('agregarpac');
	areaInsuAfect.style.marginTop="-3.75em";
	areaInsuAfect.style.transition="margin-top 0.65s";
	contPBodyPass[0].style.height="410px";
	contPBodyPass[0].style.transition="height 0.65s";
    divagregar.style.opacity="0";
	divagregar.style.transition="opacity 2s";
	setTimeout(function(){divagregar.removeChild(document.getElementById('remover'));},200);
	auxpac = 0;
}