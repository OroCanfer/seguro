<?php
require_once("../db/Database.php");

	$tipoQ=$_POST['tipoQ'];

switch($tipoQ){
	case 0:
	cargarUnidades();
	break;
	case 1:
	llenarComboServicios();
	break;
	case 2:
	cargarEstudios();
	break;
	case 3:
	llenarComboProveedores();
	case 4:
	guardarContrato();
	break;
	case 5:
	guardarServicios();
}

function guardarContrato(){
	$fechaIni = $_POST['fechaIni'];
	$fechaFin = $_POST['fechaFin'];
	$numContrato = $_POST['numContrato'];
	$causa = $_POST['causa'];
	$RFC = $_POST['RFC'];
	$saldo = $_POST['saldo'];
	$proveedor = $_POST['proveedor'];
	$conexion = connectDB();
	$query = "call spGuardarContrato('$numContrato','$causa','$RFC','$fechaIni','$fechaFin',$saldo,$proveedor)";
	$hacer_consulta = mysqli_query($conexion, $query);
	$result = mysqli_fetch_array($hacer_consulta);
	if($hacer_consulta){
		echo $result['ultimoId'];
	}else{
		echo 0;
	}
}

function guardarServicios(){
	$servicio = $_POST['servicio'];
	$estudios = explode(',',$_POST['estudios']);
	$clinicas = explode(',',$_POST['clinicas']);
	$ultimoId = $_POST['ultimoId'];
	$conexion = connectDB();
	$query = "call spInsertaServicios($ultimoId, '$servicio')";
	$hacer_consulta = mysqli_query($conexion, $query);
	$result = mysqli_fetch_array($hacer_consulta);
	$ultimoServCon = $result['ultimoServCon'];
	$conexion = connectDB();
	foreach ($estudios as $key) {
		$query = "INSERT INTO estcon VALUES(NULL, $ultimoServCon, $key)";
		$hacer_consulta = mysqli_query($conexion, $query);
	}
	$conexion = connectDB();
	foreach ($clinicas as $key) {
		$query = "INSERT INTO clicon VALUES(NULL, $ultimoServCon, $key)";
		$hacer_consulta = mysqli_query($conexion, $query);
	}
}

/*function estudiosModificar(){
	$servicio=$_POST['servicio'];
	$estudios=$_POST['estudiosSeleccionados'];
	$array=explode(',',$estudios);
	$largoArray=count($array);
	$conexion=connectDB();
	$query= "call spCargarEstudios('".$servicio."');";
	$hacer_consulta = mysqli_query($conexion, $query);
	$cont=0;
	$checked = '';
	while($result= mysqli_fetch_array($hacer_consulta, MYSQLI_ASSOC)){
		$cont++;
		if(in_array($cont, $array)){
			$checked = 'checked="checked"';
		}else{
			$checked = '';
		}
		echo  '<input id="estudio'.$cont.'" '.$checked.' onclick="checkCliqueadoMod(this)" type="checkbox">'.utf8_encode($result['nombre']).'</input>';
		$checked = '';
	}	
}*/

function llenarComboProveedores(){
	$conexion=connectDB();
	$query= "SELECT * FROM proveedores";
	$hacer_consulta = mysqli_query($conexion, $query);
	echo '<option>--Seleccione un proveedor--</option>';
	while($result= mysqli_fetch_array($hacer_consulta, MYSQLI_ASSOC)){
		echo  '<option>'.utf8_encode($result['nombre']).'</option>';
	}
}

function cargarEstudios(){
	$servicio=$_POST['servicio'];
	$conexion=connectDB();
	$query= "call spCargarEstudios('".$servicio."');";
	$hacer_consulta = mysqli_query($conexion, $query);
	$cont=0;
	echo '<div id="estudiosCont" class="estiloCont1 boxShadowSec">';
	while($result= mysqli_fetch_array($hacer_consulta, MYSQLI_ASSOC)){
		$cont++;
		echo  '<input id="estudio'.$cont.'" onclick="checkCliqueado(this)" type="checkbox">'.utf8_encode($result['nombre']).'</input><br>';
 	}
 	echo '</div>';
}

function cargarUnidades(){
	$conexion=connectDB();
	$query= "SELECT * FROM unidades_medicas";
	$hacer_consulta = mysqli_query($conexion, $query);
	$cont=0;
	echo '<div id="clinicasCont" class="estiloCont1 boxShadowSec"><label>Seleccione las clínicas que tendrán el servicio</label><br>';
	while($result= mysqli_fetch_array($hacer_consulta, MYSQLI_ASSOC)){
		$cont++;
		echo  '<input id="unidad'.$cont.'" onclick="checkUnidad(this)" type="checkbox">'.utf8_encode($result['nombre']).'</input><br>';
	}
	echo '</div>';
}

function llenarComboServicios(){
	$conexion=connectDB();
	$query= "SELECT * FROM servicios";
	$hacer_consulta = mysqli_query($conexion, $query);
	echo '<option>--Seleccione un servicio--</option>';
	while($result= mysqli_fetch_array($hacer_consulta, MYSQLI_ASSOC)){
		echo  '<option>'.utf8_encode($result['nombreServicio']).'</option>';
	}	
}
?>