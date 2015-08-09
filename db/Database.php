<?php

include_once('config.php');

function connectDB(){
if(!($conexion_sys = mysqli_connect(HOST,USER,PASSWORD))){
	printf("Error conectando con la base de datos %s\n", mysqli_connect_errno());
	exit();
	}
//Seleccionamos la base de datos a utilizar
if(!(mysqli_select_db($conexion_sys,DATABASE))){
	printf("Error seleccionando la base de datos.");
	exit();
	}
return $conexion_sys;
}
?>
