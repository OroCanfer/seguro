<?php
require_once("../db/Database.php");

$con = connectDB();

$opc = $_POST['opc'];

switch ($opc) {
	//CRUD'S SERVICIOS
	case 1:
		//DA DE ALTA UN SERVICIO!
		$servicio = mb_strtoupper($_POST['servicio'], 'UTF-8');

		$query = "insert into servicios values(NULL, '$servicio')";

		if(mysqli_query($con, $query)){
			echo "El servicio se ha agregado con exito!";
		}else{
			echo "Ha ocurrido un error al agregar un nuevo servicio. Intente nuevamente.";
		}
		break;
	case 2:
		//MODIFICA UN SERVICIO!
		$servupdate = mb_strtoupper($_POST['servupdate'], 'UTF-8');
		$servicio = $_POST['servicio'];

		$query = "update servicios set nombreServicio='$servupdate' where pinServicio=$servicio";

		if(mysqli_query($con, $query)){
			echo "El servicio se ha agregado con exito!";
		}else{
			echo "Ha ocurrido un error al agregar un nuevo servicio. Intente nuevamente.";
		}
		break;

	//CRUD'S ESTUDIOS
	case 3:
		//DA DE ALTA UN ESTUDIO!
		$estudio = mb_strtoupper($_POST['estudio'], 'UTF-8');
		$precio = $_POST['precio'];
		$servicio = $_POST['servicio'];

		$query = "insert into estudios values(NULL, '$estudio', '$precio', '$servicio')";

		if(mysqli_query($con, $query)){
			echo "El servicio se ha agregado con exito!";
		}else{
			echo "Ha ocurrido un error al agregar un nuevo servicio. Intente nuevamente.";
		}
		break;
	case 4:
		//MODIFICA UN ESTUDIO!
		$estupdate = mb_strtoupper($_POST['estupdate'], 'UTF-8');
		$precio = $_POST['precio'];
		$servicio = $_POST['servicio'];
		$estudio = $_POST['estudio'];

		$query = "update estudios set nombre='$estupdate', precio='$precio', servicio='$servicio' where pinEstudio=$estudio";

		if(mysqli_query($con, $query)){
			echo "El servicio se ha agregado con exito!";
		}else{
			echo "Ha ocurrido un error al agregar un nuevo servicio. Intente nuevamente.";
		}
		break;
}
?>