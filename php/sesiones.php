<?php
	session_start();
	$s=$_POST["op"];
	switch ($s) {
		case 1:
			valiSession();
			break;
		case 2:
			cerrar();
			break;
	}
	function valiSession(){
      if(isset($_SESSION['loggedin'])){
		echo $_SESSION['user'];
		}else{
			echo "0";
		}
	}
	function cerrar(){
		unset($_SESSION['user']);
		unset($_SESSION['loggedin']);
	}
?>