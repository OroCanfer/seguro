<?php
require_once("../db/Database.php");

$con = connectDB();

$opc = $_POST['opc'];
if(isset($_POST['servsub'])){
	$servsub = $_POST['servsub'];
}
if(isset($_POST['servespecifico'])){
	$servespecifico = $_POST['servespecifico'];
}
if(isset($_POST['numero'])){
	$numcontrato = $_POST['numero'];
}

switch ($opc) {
	case 1:
		//SE EJECUTA AL INICIAR LA APLICACIÓN, LLENARÁ EL SELECT DE SERVICIOS!
		$query = "select nombreServicio from servicios";

		$consulta = mysqli_query($con, $query);
		echo '<option>Seleciona una opción</option>';
		for($i=0; $i<mysqli_num_rows($consulta); $i++){
			$respuestasql = mysqli_fetch_array($consulta, MYSQLI_ASSOC);
			echo '<option>'.$respuestasql['nombreServicio'].'</option>';
		}
		break;
	case 2:
		//SE EJECUTA ENTRE EL PASE DEL PASO 2 AL 3 PARA LLENAR EL SELECT DE CONTRATOS SEGÚN EL SERVICIO SELECCIONADO!
		$query = "call spSelectCon('".$servespecifico."')";

		$consulta = mysqli_query($con, $query);
		echo '<option>Seleciona una opción</option>';
		for($i=0; $i<mysqli_num_rows($consulta); $i++){
			$respuestasql = mysqli_fetch_array($consulta, MYSQLI_ASSOC);
			echo '<option>'.$respuestasql['numero'].'</option>';
		}
		break;
	case 3:
		//SE EJECUTA CUANDO SE CAMBIA DE CONTRATO!
		$query = "select * from datosprove where numero=".$numcontrato."";

		$consulta = mysqli_query($con, $query);

		for($i=0; $i<mysqli_num_rows($consulta); $i++){
			$respuestasql = mysqli_fetch_array($consulta, MYSQLI_ASSOC);
			echo $respuestasql['nombre'].'*&*'.$respuestasql['domicilio'].'*&*'.$respuestasql['fechaInicial'].'*&*'.$respuestasql['fechaFinal'].'*&*'.$respuestasql['rfc'].'*&*'.$respuestasql['telefono'];
		}
		break;
	case 4:
		//REALIZA EL INSERT A LA BASE DE DATOS
		$pid = $_POST['pid'];
		$ramoSeg = $_POST['ramoSeg'];
		$tiposervicio = $_POST['tiposervicio'];
		$motsub = $_POST['motsub'];
		$diag = mb_strtoupper($_POST['textDiagnostic'], 'UTF-8');
		$gruposub = $_POST['gruposub'];
		$servsub = $_POST['servsub'];
		$servespecifico = $_POST['servespecifico'];
		$contrato = $_POST['contrato'];

		$query = "call spInsertSub('$pid', '$ramoSeg', '$tiposervicio', '$motsub', '$diag', '$gruposub', '$servsub', '$servespecifico','$contrato')";

		if(mysqli_query($con, $query)){
			echo "Se ha realizado la solicitud de subrogación correctamente.";
		}else{
			echo "Ha ocurrido un error al realizar la solicitud. Intente nuevamente.";
		}
		break;
	case 5:
		//SE EJECUTA CUANDO SE CAMBIA DE SERVICIO!
		$query = "call spSelectEst('".$servsub."')";

		$consulta = mysqli_query($con, $query);
		echo '<option>Seleciona una opción</option>';
		for($i=0; $i<mysqli_num_rows($consulta); $i++){
			$respuestasql = mysqli_fetch_array($consulta, MYSQLI_ASSOC);
			echo '<option>'.$respuestasql['nombre'].'</option>';
		}
		break;
	case 6:
		//VALIDA QUE EXISTA EL PACIENTE
		$paciente = $_POST['pac'];

		$query = "select * from pacientes where numeroSeguro='".$paciente."'";

		$tot = mysqli_num_rows(mysqli_query($con, $query));

		$consulta = mysqli_query($con, $query);

		if($tot > 0){
			echo $tot."//";
			for($i=0; $i<$tot; $i++){
				$respuestasql = mysqli_fetch_array($consulta, MYSQLI_ASSOC);
				echo $respuestasql['agregado'].$respuestasql['sexo'].substr($respuestasql['fechaNacimiento'], 0, 4).$respuestasql['tipoSeguro']."&".$respuestasql['pinPaciente']."&";
			}
		}else{
			echo '<div id="remover"><input type="text" id="nameP" placeholder="Nombre" class="inputText cleanInput"></input>
				<input type="text" id="firstNameP" placeholder="Apellido Paterno" class="inputText cleanInput"></input>
				<input type="text" id="lastNameP" placeholder="Apellido Materno" class="inputText cleanInput"></input><br><br>
				<input type="text" id="ageP" placeholder="Fecha de Nacimiento" class="datepicker inputText cleanInput" readonly="readonly"/>	
				<input type="text" id="curpP" placeholder="Curp" maxlength="18" class="inputText cleanInput"></input>
				<input type="text" id="nssP" placeholder="No. de Seguro Social" maxlength="11" class="inputText cleanInput"></input>
					<select class="inputSelect" id="sexoalta">
						<option>Sexo</option>
						<option>M</option>
						<option>F</option>
					</select>
				<select class="inputSelectNum space" id="agregadoalta">
					<option>Tipo de seguro</option><option>1</option><option>2</option>
					<option>3</option><option>4</option><option>5</option>
				</select>
				<select class="inputSelect space" id="tipoSegAlta"> 
					<option>Seleccione opción</option>
					<option>OR</option>
					<option>PE</option>
				</select>                      
				<input type="button" value="Agregar" id="btnAg" onclick="paso1RegPac()"/>
				</div>';
			}
		break;
	case 7:
		//DA DE ALTA UN PACIENTE EN CASO DE NO EXISTIR
		$nombrePac = mb_strtoupper($_POST['name'], 'UTF-8');
		$apeUnoPac = mb_strtoupper($_POST['primerApe'], 'UTF-8');
		$apeDosPac = mb_strtoupper($_POST['segundoApe'], 'UTF-8');
		$NSSalta = $_POST['nssAlta'];
		$CURP = mb_strtoupper($_POST['curp'], 'UTF-8');
		$AgrePac = $_POST['agre'];
		$tipoSeg = $_POST['tipo'];
		$sexo = $_POST['sexo'];
		$edad = $_POST['edad'];
		$unit = $_POST['unit'];

		$query = "insert into pacientes values(NULL, '$nombrePac', '$apeUnoPac', '$apeDosPac', '$sexo', '$CURP', '$NSSalta', $AgrePac, '$tipoSeg', '$edad', $unit)";

		if(mysqli_query($con, $query)){
			echo "El paciente se ha agregado con exito!&true";
		}else{
			echo "Ha ocurrido un error al realizar la solicitud. Intente nuevamente.&null";
		}
		break;
}
?>