<?php
require_once("../db/Database.php");

$con = connectDB();

$opc = $_POST['opc'];

switch ($opc) {
	case 1:
		//ALTA DE UN PROVEEDOR!
		$nombre = mb_strtoupper($_POST['nombre'], 'UTF-8');
		$dir = mb_strtoupper($_POST['direccion'], 'UTF-8');
		$rfc = mb_strtoupper($_POST['rfc'], 'UTF-8');
		$telefono = $_POST['telefono'];
		$fax = $_POST['fax'];
		$fechaIni  = $_POST['fechaIni'];
		$fechaFin = $_POST['fechaFin'];
		$matricula = $_POST['matricula'];

		$query = "call spAltaProve('$nombre', '$dir', '$rfc', '$telefono', '$fax', '$fechaIni', '$fechaFin', '$matricula')";

		if(mysqli_query($con, $query)){
			echo "El proveedor se ha agregado con exito!";
		}else{
			echo mysqli_error($con);
			echo "Ha ocurrido un error al realizar al dar de alta al proveedor. Intente nuevamente.";
		}
		break;
	case 2:
		//MODIFICA A UN PROVEEDOR!
		$proveedor = $_POST['proveedor'];
		$nombre = mb_strtoupper($_POST['nombre'], 'UTF-8');
		$dir = mb_strtoupper($_POST['direccion'], 'UTF-8');
		$rfc = mb_strtoupper($_POST['rfc'], 'UTF-8');
		$telefono = $_POST['telefono'];
		$fax = $_POST['fax'];
		$fechaIni  = $_POST['fechaIni'];
		$fechaFin = $_POST['fechaFin'];
		$matricula = $_POST['matricula'];

		$query = "update proveedores set nombre='$nombre', domicilio='$dir', rfc='$rfc', telefono='$telefono', fax='$fax', fechaInicial='$fechaIni', fechaFinal='$fechaFin', matricula='$matricula' where rfc='$proveedor'";

		if(mysqli_query($con, $query)){
			echo "El proveedor se ha actualizado con exito!";
		}else{
			echo "Ha ocurrido un error al actualizar los datos proveedor. Intente nuevamente.";
		}
		break;
	case 3:
		//ELIMINA A UN PROVEEDOR!
		$proveedor = $_POST['proveedor'];
		
		$query = "update proveedores set estado=0 where rfc='$proveedor'";

		$consulta = mysqli_query($con, $query);

		if(mysqli_query($con, $query)){
			echo "El proveedor ha sido eliminado con exito!";
		}else{
			echo "Ha ocurrido un error al eliminar al proveedor. Intente nuevamente.";
		}
		break;
	case 4:
		//CARGA A TODOS LOS PROVEEDORES!
		$query = "select nombre from proveedores where estado=1";

		$consulta = mysqli_query($con, $query);
		echo '<option>Seleciona una opción</option>';
		for($i=0; $i<mysqli_num_rows($consulta); $i++){
			$respuestasql = mysqli_fetch_array($consulta, MYSQLI_ASSOC);
			echo '<option>'.$respuestasql['nombre'].'</option>';
		}
		break;
	case 5:
		//MUESTRA LOS DATOS DE LOS PROVEEDORES!
		$proveedor = $_POST['proveName'];
		
		$query = "select * from proveedores where nombre='$proveedor'";

		$consulta = mysqli_query($con, $query);

		for($i=0; $i<mysqli_num_rows($consulta); $i++){
			$respuestasql = mysqli_fetch_array($consulta, MYSQLI_ASSOC);
			echo $respuestasql['nombre'].'*&*'.$respuestasql['domicilio'].'*&*'.$respuestasql['rfc'].'*&*'.$respuestasql['telefono'].'*&*'.$respuestasql['fax'].'*&*'.$respuestasql['fechaInicial'].'*&*'.$respuestasql['fechaFinal'].'*&*'.$respuestasql['matricula'];
		}
		break;
}
?>