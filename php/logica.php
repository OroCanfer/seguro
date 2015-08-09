<?php
require_once("../db/Database.php");

session_start();
$conexion = connectDB();
$matricula = $_POST['matricula'];
$password = $_POST['password'];

$query = 'SELECT * FROM personal WHERE matricula="'.$matricula.'" and password="'.$password.'"';

$consulta = mysqli_query($conexion, $query);

if($result = mysqli_fetch_array($consulta, MYSQLI_ASSOC)){
	$_SESSION['loggedin'] = true;
	$_SESSION['user'] = $result['cargo'].". ".$result['nombre']." ".$result['apellidoPaterno']." ".$result['pinUnidad'];

	echo $result['cargo'];
}else{
	echo 0;
}
?>