<?php 

require_once("../db/Database.php");
$tipoQ=$_POST['tipoQ'];
switch ($tipoQ) {
	case 0:
	llenarComboSecciones();
	break;
	case 1:
	notificacionesIniciales();
	break;
	case 2:
	revisarSolicitud();
	break;
}

function revisarSolicitud(){
	$conexion = connectDB();
	$tipo = $_POST['tipo'];
	$id = $_POST['id'];
	$query = "call spRevisarSolicitud('$id','$tipo')";
	echo $id.' '.$tipo;
	$hacer_consulta = mysqli_query($conexion, $query);
}

function llenarComboSecciones(){
	$conexion=connectDB();
	$query= "SELECT * FROM secciones";
	$hacer_consulta = mysqli_query($conexion, $query);
	while($result= mysqli_fetch_array($hacer_consulta, MYSQLI_ASSOC)){
		echo  '<option>'.utf8_encode($result['seccion']).'</option>';
	}
}

function notificacionesIniciales(){
 	$conexion = connectDB();
 	$seccion = $_POST['seccion'];
 	$prioridad = $_POST['prioridad'];
 	$estado = $_POST['estado'];
 	$tipo = $_POST['tipo'];
 	$query= "call spCargaNotificacionesDir('".$seccion."','".$prioridad."','".$estado."','".$tipo."')";
 	echo '<div id="contAll">';
	$hacer_consulta = mysqli_query($conexion, $query);
	while($result= mysqli_fetch_array($hacer_consulta, MYSQLI_ASSOC)){
		$id = utf8_encode($result['pinSubrogacion']);
		echo '<div class="rowTable"><center>'.utf8_encode($result['servicioSubrogar']).' | '.utf8_encode($result['estudioSubrogar']).
              ' | '.utf8_encode($result['nombre']).' '.utf8_encode($result['apellidoPaterno']).
              ' | '.utf8_encode($result['estado']).
              ' | '.utf8_encode($result['seccion']).
              ' | '.utf8_encode($result['tipoServicio']).'
	        	</center><div id="Tit"></div>
	        	<div class="rowButtons">
	         		<input type="button" class="btnsNotif" id="'.$id.'" onclick="revisarSolicitud(this.id,0)" value="Ver" onclick=""></input> 
	         		<input type="button" class="btnsNotif" id="'.$id.'" onclick="revisarSolicitud(this.id,1)" value="Aprobar"></input> 
	         		<input type="button" class="btnsNotif" id="'.$id.'" onclick="revisarSolicitud(this.id,2)" value="Denegar"></input> 
	         	</div>
	        </div>
	        <br>
        ';
	}
	echo '</div>';
}

?>