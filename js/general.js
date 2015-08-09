// JavaScript Document
var cont2=0;
var cont1=0;
var cont3=0;
var contSession;
var contSession2;
var mainPane;
function generalMain(){
	contSessionMain();
	}
function contSessionMain(){
	contSession = document.getElementById("contSession"); 
	contSession2 = document.getElementById("contSession2");
	mainPane=document.getElementsByClassName("MainPane");
	contSession.style.display="none";
	}
function mostrarCuenta(){
	cont2++;
	if(cont2 == 1){
		contSession.style.display="block";
	}
	if(cont2 == 2){
		contSession.style.display="none";
		cont2=0;
	}
}
function desNav1(){
	cont1++;
	var header = document.getElementsByClassName("header");	
	var cuerpo = document.getElementsByClassName("Body");
	var footer = document.getElementsByClassName("footer");
	var desnav=document.getElementById("desNav");
	var contNav=document.getElementById("contNav");
	var btnNav=document.getElementById('btnNav');
	////////////////////////////////////////////////////
	if(cont1 ==1){
	    desnav.style.marginLeft="0";
        desnav.style.transition="margin-left 0.5s";
        contNav.style.width="100%";
      // contNav.style.borderBottom="3px solid orange";
        contNav.style.transition="border-bottom,width 0.5s";

        ////////////////////////////////////////////////////
        /*desnav.style.MozTransition="margin-left 0.5s";
        desnav.style.OTransition="margin-left 0.5s";
        desnav.style.WebkiTransition="margin-left 0.5s";*/
        ////////////////////////////////////////////////////
        btnNav.style.transform="rotate(360deg)";
        btnNav.style.transition=" transform 700ms";
        ////////////////////////////////////////////////////
   
		}
	if(cont1==2){
	    desnav.style.marginLeft="-100%";
        desnav.style.transition="margin-left 2s";
        contNav.style.width="0px";
     // contNav.style.borderBottom="0px solid orange";
        contNav.style.transition="border-bottom,width 0.5s";
        ////////////////////////////////////////////////////
          //desnav.style.transition="margin-left 0.5s";
        //desnav.style.MozTransition="margin-left 0.5s";
       // desnav.style.OTransition="margin-left 0.5s";
        //desnav.style.WebkiTransition="margin-left 0.5s";
        ///////////////////////////////////////////////////
        btnNav.style.transform="rotate(0deg)";
        btnNav.style.transition="transform 700ms";
		cont1=0;
		}
}
function desNav2(){
	cont3++;
	if(cont3==1){
		var optionPane=document.getElementsByClassName("optionPane");
		var optionCont=document.getElementById("optionCont");
		optionCont.style.marginTop="100px";
		optionCont.style.transition="margin-top 1s";	
	}
	if(cont3==2){
		var optionPane=document.getElementsByClassName("optionPane");
		var optionCont=document.getElementById("optionCont");
		optionCont.style.marginTop="0px";
		optionCont.style.transition="margin-top 1s";
		cont3=0;
	}
}
function desNav3(op){
	cont3++;
	if(cont3==1){
		var optionPane=document.getElementsByClassName("optionPane");
		optionPane[op].style.marginTop="60px";
		optionPane[op].style.transition="margin-top 1s";	
	}
	if(cont3==2){
		var optionPane=document.getElementsByClassName("optionPane");
		optionPane[op].style.marginTop="0px";
		optionPane[op].style.transition="margin-top 1s";
		cont3=0;
	}
}
