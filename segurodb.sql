-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-08-2015 a las 00:41:03
-- Versión del servidor: 5.6.17
-- Versión de PHP: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `segurodb`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `spCargaNotificacionesDir`(secc varchar(20), prioridad varchar(10), est enum('En espera de área','En espera de director','Aprobada','Denegada'), tipo boolean)
begin

IF secc = "todas" THEN
	IF prioridad = "ambos" THEN
		IF tipo = 0 THEN
		SELECT sub.pinSubrogacion, sub.servicioSubrogar, sub.estudioSubrogar, sub.tipoServicio, sub.estado, per.nombre, per.apellidoPaterno, sec.seccion FROM subrogaciones sub 
		INNER JOIN personal per ON sub.pinPersonal=per.pinPersonal INNER JOIN secciones sec ON per.pinSeccion=sec.pinSeccion 
		WHERE sub.estado=est;
		ELSEIF tipo = 1 THEN
		SELECT sub.pinSubrogacion, sub.servicioSubrogar, sub.estudioSubrogar, sub.tipoServicio, sub.estado, per.nombre, per.apellidoPaterno, sec.seccion FROM subrogaciones sub 
		INNER JOIN personal per ON sub.pinPersonal=per.pinPersonal INNER JOIN secciones sec ON per.pinSeccion=sec.pinSeccion 
		WHERE sub.estado="Aprobada" OR sub.estado="Denegada";
		END IF;
	ELSE
		IF tipo = 0 THEN
			SELECT sub.pinSubrogacion, sub.servicioSubrogar, sub.estudioSubrogar, sub.tipoServicio, sub.estado, per.nombre, per.apellidoPaterno, sec.seccion FROM subrogaciones sub 
			INNER JOIN personal per ON sub.pinPersonal=per.pinPersonal INNER JOIN secciones sec ON per.pinSeccion=sec.pinSeccion 
			WHERE sub.tipoServicio=prioridad AND sub.estado=est;
		ELSEIF tipo = 1 THEN
			SELECT sub.pinSubrogacion, sub.servicioSubrogar, sub.estudioSubrogar, sub.tipoServicio, sub.estado, per.nombre, per.apellidoPaterno, sec.seccion FROM subrogaciones sub 
			INNER JOIN personal per ON sub.pinPersonal=per.pinPersonal INNER JOIN secciones sec ON per.pinSeccion=sec.pinSeccion 
			WHERE sub.tipoServicio=prioridad AND (sub.estado="Aprobada" OR sub.estado="Denegada");
		END IF;
	END IF;
ELSE
	IF prioridad = "ambos" THEN
		IF tipo = 0 THEN
			SELECT sub.pinSubrogacion, sub.servicioSubrogar, sub.estudioSubrogar, sub.tipoServicio, sub.estado, per.nombre, per.apellidoPaterno, sec.seccion FROM subrogaciones sub 
			INNER JOIN personal per ON sub.pinPersonal=per.pinPersonal INNER JOIN secciones sec ON per.pinSeccion=sec.pinSeccion 
			WHERE sec.seccion=secc AND sub.estado=est;
		ELSEIF tipo = 1 THEN
			SELECT sub.pinSubrogacion, sub.servicioSubrogar, sub.estudioSubrogar, sub.tipoServicio, sub.estado, per.nombre, per.apellidoPaterno, sec.seccion FROM subrogaciones sub 
			INNER JOIN personal per ON sub.pinPersonal=per.pinPersonal INNER JOIN secciones sec ON per.pinSeccion=sec.pinSeccion 
			WHERE sec.seccion=secc AND (sub.estado="Aprobada" OR sub.estado="Denegada");
		END IF;
	ELSE
		IF tipo = 0 THEN
			SELECT sub.pinSubrogacion, sub.servicioSubrogar, sub.estudioSubrogar, sub.tipoServicio, sub.estado, per.nombre, per.apellidoPaterno, sec.seccion FROM subrogaciones sub 
			INNER JOIN personal per ON sub.pinPersonal=per.pinPersonal INNER JOIN secciones sec ON per.pinSeccion=sec.pinSeccion 
			WHERE sub.tipoServicio=prioridad AND sec.seccion=secc AND sub.estado=est;
		ELSEIF tipo = 1 THEN
			SELECT sub.pinSubrogacion, sub.servicioSubrogar, sub.estudioSubrogar, sub.tipoServicio, sub.estado, per.nombre, per.apellidoPaterno, sec.seccion FROM subrogaciones sub 
			INNER JOIN personal per ON sub.pinPersonal=per.pinPersonal INNER JOIN secciones sec ON per.pinSeccion=sec.pinSeccion 
			WHERE sub.tipoServicio=prioridad AND sec.seccion=secc AND (sub.estado="Aprobada" OR sub.estado="Denegada");
		END IF;
	END IF;
END IF;

end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spCargarEstudios`(servicio varchar(200))
Begin
 
SELECT estudios.nombre FROM estudios INNER JOIN servicios ON estudios.pinServicio=servicios.pinServicio WHERE servicios.nombreServicio=servicio;
 
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spGuardarContrato`(numContrato int, causa varchar(100), rfc varchar(12), fechaIni date, fechaFin date, saldo double, proveedor int)
begin
INSERT INTO contratos VALUES(null,numContrato,causa,rfc,fechaIni,fechaFin,saldo,saldo,proveedor);
SELECT MAX(pinContrato) AS ultimoId FROM contratos;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spInsertaServicios`(ultimoId int, servicio varchar(200))
begin
SELECT pinServicio INTO @idServicio FROM servicios WHERE nombreServicio=servicio;
INSERT INTO servcon VALUES(null, ultimoId, @idServicio);
SELECT MAX(pinServCon) as ultimoServCon FROM servcon;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spInsertSub`(pid int, raseg varchar(6), tiserv varchar(10), motserv varchar(4), diag text, grsub varchar(30), servsub varchar(50), servespecifico varchar(100), contr int)
Begin
DECLARE contrato int;
set contrato = (select pinContrato from contratos where numero=contr);
insert into subrogaciones values(NULL, pid, raseg, tiserv, motserv, diag, grsub, servsub, servespecifico, contrato);
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spSelectCon`(espe varchar(100))
Begin
DECLARE precioserv double;
DECLARE est varchar(100);
set precioserv = (select precio from estudios where nombre=espe);
set est = (select pinEstudio from estudios where nombre=espe);
select con.numero from servcon sc inner join contratos con on sc.pinContrato=con.pinContrato where sc.pinEstudio=est and con.saldoFinal > precioserv and now()<con.fechaFinal;
End$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spSelectEst`(nomb varchar(100))
Begin
DECLARE temp VARCHAR(100);
set temp = (select pinServicio from servicios where nombreServicio=nomb);
select nombre from estudios where pinServicio=temp;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clicon`
--

CREATE TABLE IF NOT EXISTS `clicon` (
  `pinClicon` int(11) NOT NULL AUTO_INCREMENT,
  `pinServCon` int(11) NOT NULL,
  `pinUnidad` int(11) NOT NULL,
  PRIMARY KEY (`pinClicon`),
  KEY `pinServConCli` (`pinServCon`),
  KEY `pinUnidadCli` (`pinUnidad`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

--
-- Volcado de datos para la tabla `clicon`
--

INSERT INTO `clicon` (`pinClicon`, `pinServCon`, `pinUnidad`) VALUES
(34, 44, 1),
(35, 46, 1),
(36, 47, 1),
(37, 48, 1),
(38, 49, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contratos`
--

CREATE TABLE IF NOT EXISTS `contratos` (
  `pinContrato` int(11) NOT NULL AUTO_INCREMENT,
  `numero` varchar(10) NOT NULL,
  `causa` varchar(100) NOT NULL,
  `rfc` varchar(12) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFinal` date NOT NULL,
  `saldoInicial` double NOT NULL,
  `saldoFinal` double NOT NULL,
  `pinProveedor` int(11) NOT NULL,
  PRIMARY KEY (`pinContrato`),
  KEY `pinprovee` (`pinProveedor`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

--
-- Volcado de datos para la tabla `contratos`
--

INSERT INTO `contratos` (`pinContrato`, `numero`, `causa`, `rfc`, `fechaInicio`, `fechaFinal`, `saldoInicial`, `saldoFinal`, `pinProveedor`) VALUES
(15, '23231323', 'test', '2321323RTR', '2015-07-03', '2015-07-17', 23123, 23123, 1),
(16, '2', 'asdsa', 'ASDASD', '2015-08-06', '2015-08-08', 2000, 2000, 1),
(17, '2', 'asdsa', 'ASDASD', '2015-08-06', '2015-08-08', 2000, 2000, 1),
(18, '2', 'asdsa', 'ASDASD', '2015-08-06', '2015-08-08', 2000, 2000, 1);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `datosprove`
--
CREATE TABLE IF NOT EXISTS `datosprove` (
`nombre` varchar(45)
,`domicilio` varchar(45)
,`fechaInicial` date
,`fechaFinal` date
,`rfc` varchar(12)
,`telefono` varchar(15)
,`numero` varchar(10)
);
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `distrpresupuestal`
--

CREATE TABLE IF NOT EXISTS `distrpresupuestal` (
  `pinDistr` int(11) NOT NULL,
  `pinContrato` int(11) NOT NULL,
  `pinUnidad` int(11) NOT NULL,
  `importeMin` double NOT NULL,
  `importeMax` double NOT NULL,
  KEY `pinContDist` (`pinContrato`),
  KEY `pinUniDist` (`pinUnidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estcon`
--

CREATE TABLE IF NOT EXISTS `estcon` (
  `pinEstCon` int(11) NOT NULL AUTO_INCREMENT,
  `pinServCon` int(11) NOT NULL,
  `pinEstudio` int(11) NOT NULL,
  PRIMARY KEY (`pinEstCon`),
  KEY `pinServCon` (`pinServCon`),
  KEY `pinEstudio` (`pinEstudio`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=49 ;

--
-- Volcado de datos para la tabla `estcon`
--

INSERT INTO `estcon` (`pinEstCon`, `pinServCon`, `pinEstudio`) VALUES
(43, 44, 1),
(44, 45, 7),
(45, 46, 1),
(46, 47, 1),
(47, 48, 1),
(48, 49, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudios`
--

CREATE TABLE IF NOT EXISTS `estudios` (
  `pinEstudio` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `precio` double NOT NULL,
  `pinServicio` int(11) NOT NULL,
  PRIMARY KEY (`pinEstudio`),
  KEY `pinEstudios_Servicio` (`pinServicio`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Volcado de datos para la tabla `estudios`
--

INSERT INTO `estudios` (`pinEstudio`, `nombre`, `precio`, `pinServicio`) VALUES
(1, 'RESONANCIA NUCLEAR MAGNETICA SIN ANESTECIA', 3300, 1),
(2, 'RESONANCIA NUCLEAR MAGNETICA CON ANESTECIA', 4000, 1),
(3, 'ANGIORESONANCIA SIN ANESTECIA', 4400, 1),
(4, 'ANGIORESONANCIA CON ANESTECIA', 5000, 1),
(5, 'SERVICIO CON ANESTECIA', 3000, 2),
(6, 'SERVICIO SIN ANTESTECIA', 2000, 2),
(7, 'SERVICIO NORMAL', 1500, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupossubrogar`
--

CREATE TABLE IF NOT EXISTS `grupossubrogar` (
  `pinGrupoSub` int(11) NOT NULL AUTO_INCREMENT,
  `nombreGrupo` varchar(35) CHARACTER SET latin1 NOT NULL,
  `pinUnidad` int(11) NOT NULL,
  PRIMARY KEY (`pinGrupoSub`),
  KEY `pinUnidad` (`pinUnidad`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Volcado de datos para la tabla `grupossubrogar`
--

INSERT INTO `grupossubrogar` (`pinGrupoSub`, `nombreGrupo`, `pinUnidad`) VALUES
(1, 'consulta medicina familiar', 1),
(2, 'hospitalización médica', 1),
(3, 'aux de diag en laboratorio', 1),
(4, 'consulta especialidades', 1),
(5, 'hospitalización quirúrgica', 1),
(6, 'aux de diag en gabinete', 1),
(7, 'consulta dental', 1),
(8, 'materno infantil', 1),
(9, 'aux de tratamiento', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE IF NOT EXISTS `pacientes` (
  `pinPaciente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellidoPaterno` varchar(45) NOT NULL,
  `apellidoMaterno` varchar(45) NOT NULL,
  `sexo` enum('F','M') NOT NULL,
  `curp` varchar(18) NOT NULL,
  `numeroSeguro` varchar(20) NOT NULL,
  `agregado` int(1) NOT NULL,
  `tipoSeguro` enum('Or','PE') NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `pinUnidad` int(11) NOT NULL,
  PRIMARY KEY (`pinPaciente`),
  UNIQUE KEY `Pin_UNIQUE` (`pinPaciente`),
  KEY `fk_pacientes_unidades_medicas_idx` (`pinUnidad`),
  KEY `numeroSeguro` (`numeroSeguro`),
  KEY `agregado` (`agregado`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`pinPaciente`, `nombre`, `apellidoPaterno`, `apellidoMaterno`, `sexo`, `curp`, `numeroSeguro`, `agregado`, `tipoSeguro`, `fechaNacimiento`, `pinUnidad`) VALUES
(3, 'Juan', 'Perez', 'Lopez', 'M', 'pirs9473678fhrkjhd', '12345678901', 1, 'Or', '1999-05-18', 1),
(4, 'Shary', 'Pinkney', 'Rodriguez', 'F', 'PIRS940101HQRNDH12', '10293847566', 2, 'Or', '1988-05-18', 1),
(5, 'Sharrrr', 'Pinkney', 'Rodriguez', 'F', 'PIRS940101HQRNDH12', '10293847566', 2, 'Or', '2003-05-18', 1),
(6, 'Juan', 'Perez', 'Lopez', 'M', 'PGES990327HQRNDH12', '55337672736', 4, 'Or', '1955-05-18', 1),
(7, 'Valeria', 'Hernandez', 'Guerrero', 'F', 'PAOH952678MQRNDH12', '81236182361', 1, 'Or', '1997-05-18', 1),
(8, 'Michel', 'Palma', 'Reyna', 'M', 'DGRY992312HQRNDH12', '00234671111', 5, 'PE', '1989-05-18', 1),
(9, 'jairo', 'alan', 'test', 'M', 'PIRS946253KJHWKEHQ', '54123132144', 3, 'Or', '2005-05-18', 1),
(11, 'new', 'new', 'new', 'F', 'MMAD941275KWKQWCKE', '12315123131', 4, 'PE', '1991-05-18', 2),
(12, 'new', 'test', 'edad', 'F', 'PIRS940101SKJNDKJS', '31231313133', 3, 'Or', '1976-05-18', 1),
(13, 'new', 'test', 'newuser', 'M', 'SHDB254891SDNMBSKH', '21345214345', 3, 'PE', '1958-05-18', 2),
(14, 'lal', 'lel', 'lol', 'M', 'PIRS940101HQRNDH12', '12345678901', 3, 'Or', '1979-05-18', 1),
(15, 'dhsakj', 'kjn', 'jb', 'M', 'HGPE930112MGTRRL09', '00000000001', 2, 'Or', '1960-05-18', 1),
(16, 'VALE', 'MICH', 'ALAN', 'M', 'SHET950620FJKJNJQW', '01010101010', 3, 'PE', '1995-06-20', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE IF NOT EXISTS `personal` (
  `pinPersonal` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellidoPaterno` varchar(45) NOT NULL,
  `apellidoMaterno` varchar(45) NOT NULL,
  `curp` varchar(18) NOT NULL,
  `matricula` varchar(8) NOT NULL,
  `cargo` enum('Dir','Jef','Doc') NOT NULL,
  `rfc` varchar(13) NOT NULL,
  `sexo` enum('F','M') NOT NULL,
  `pinUnidad` int(11) NOT NULL,
  `password` varchar(50) NOT NULL,
  `pinSeccion` int(11) NOT NULL,
  PRIMARY KEY (`pinPersonal`),
  UNIQUE KEY `Pin_UNIQUE` (`pinPersonal`),
  KEY `fk_personal_unidades_medicas1_idx` (`pinUnidad`),
  KEY `pinSeccionPersonal` (`pinSeccion`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=134 ;

--
-- Volcado de datos para la tabla `personal`
--

INSERT INTO `personal` (`pinPersonal`, `nombre`, `apellidoPaterno`, `apellidoMaterno`, `curp`, `matricula`, `cargo`, `rfc`, `sexo`, `pinUnidad`, `password`, `pinSeccion`) VALUES
(128, 'Alanfer', 'Orozco', 'Cabañas', 'OOCA951129HYNRBL02', '1234567', 'Doc', '1', 'M', 1, '123', 4),
(130, 'Shariver', 'Pinkney', 'Rodríguez', 'PIRS940101HQRNDH12', '1122334', 'Dir', '3', 'M', 1, '123', 6),
(132, 'Pablo', 'Ruiz', 'Picasso', 'asdsdsadsadsad', '1232323', 'Jef', '4', 'M', 1, '123', 2),
(133, 'Pepe', 'Prusia', 'Sachiñaz', 'OOCA951129HYNRBF34', '1234567', 'Doc', '1', 'M', 1, '123', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE IF NOT EXISTS `proveedores` (
  `pinProveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `domicilio` varchar(45) NOT NULL,
  `rfc` varchar(12) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `fax` varchar(15) NOT NULL,
  `fechaInicial` date NOT NULL,
  `fechaFinal` date NOT NULL,
  `matricula` varchar(8) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`pinProveedor`),
  UNIQUE KEY `pin_UNIQUE` (`pinProveedor`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`pinProveedor`, `nombre`, `domicilio`, `rfc`, `telefono`, `fax`, `fechaInicial`, `fechaFinal`, `matricula`, `estado`) VALUES
(1, 'AMERIMED', 'RG 100', 'PIRS723', '9982112944', '876545', '2015-04-08', '2015-04-30', '8757676', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE IF NOT EXISTS `secciones` (
  `pinSeccion` int(11) NOT NULL AUTO_INCREMENT,
  `seccion` varchar(20) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`pinSeccion`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Volcado de datos para la tabla `secciones`
--

INSERT INTO `secciones` (`pinSeccion`, `seccion`) VALUES
(1, 'maternidad'),
(2, 'emergencias'),
(3, 'pediatría'),
(4, 'tercera edad'),
(5, 'cuidados intensivos'),
(6, 'todas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seccionunidad_med`
--

CREATE TABLE IF NOT EXISTS `seccionunidad_med` (
  `pinUnion` int(11) NOT NULL AUTO_INCREMENT,
  `pinUnidad` int(11) NOT NULL,
  `pinSeccion` int(11) NOT NULL,
  PRIMARY KEY (`pinUnion`),
  KEY `seccionunidad_med_ibfk_2` (`pinSeccion`),
  KEY `seccionunidad_med_ibfk_1` (`pinUnidad`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Volcado de datos para la tabla `seccionunidad_med`
--

INSERT INTO `seccionunidad_med` (`pinUnion`, `pinUnidad`, `pinSeccion`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servcon`
--

CREATE TABLE IF NOT EXISTS `servcon` (
  `pinServCon` int(11) NOT NULL AUTO_INCREMENT,
  `pinContrato` int(11) NOT NULL,
  `pinServicio` int(11) NOT NULL,
  PRIMARY KEY (`pinServCon`),
  KEY `pinServicio` (`pinServicio`),
  KEY `pinContrato` (`pinContrato`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=50 ;

--
-- Volcado de datos para la tabla `servcon`
--

INSERT INTO `servcon` (`pinServCon`, `pinContrato`, `pinServicio`) VALUES
(44, 15, 1),
(45, 15, 2),
(46, 16, 1),
(47, 17, 1),
(48, 18, 1),
(49, 18, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE IF NOT EXISTS `servicios` (
  `pinServicio` int(11) NOT NULL AUTO_INCREMENT,
  `nombreServicio` varchar(200) NOT NULL,
  PRIMARY KEY (`pinServicio`),
  UNIQUE KEY `pin_UNIQUE` (`pinServicio`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`pinServicio`, `nombreServicio`) VALUES
(1, 'RESONANCIA NUCLEAR MAGNETICA'),
(2, 'SERVICIO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subrogaciones`
--

CREATE TABLE IF NOT EXISTS `subrogaciones` (
  `pinSubrogacion` int(11) NOT NULL AUTO_INCREMENT,
  `pinPaciente` int(11) NOT NULL,
  `tipoServicio` varchar(10) NOT NULL,
  `motivoSubrogacion` varchar(4) NOT NULL,
  `diagnostico` text NOT NULL,
  `grupoSubrogar` varchar(30) NOT NULL,
  `servicioSubrogar` varchar(50) NOT NULL,
  `estudioSubrogar` varchar(100) NOT NULL,
  `contrato` int(11) NOT NULL,
  `pinPersonal` int(11) NOT NULL,
  `estado` enum('En espera de área','En espera de director','Aprobada','Denegada') DEFAULT NULL,
  PRIMARY KEY (`pinSubrogacion`),
  UNIQUE KEY `pin_UNIQUE` (`pinSubrogacion`),
  KEY `contract` (`contrato`),
  KEY `pinPacienteSub` (`pinPaciente`),
  KEY `pinPersonal` (`pinPersonal`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Volcado de datos para la tabla `subrogaciones`
--

INSERT INTO `subrogaciones` (`pinSubrogacion`, `pinPaciente`, `tipoServicio`, `motivoSubrogacion`, `diagnostico`, `grupoSubrogar`, `servicioSubrogar`, `estudioSubrogar`, `contrato`, `pinPersonal`, `estado`) VALUES
(4, 3, 'Urgente', 'CS', 'Diag', 'RT', 'SERVICIO', 'SERVICIO NORMAL', 15, 128, 'En espera de director'),
(5, 3, 'Urgente', 'CS', 'Diag', 'RT', 'SERVICIO', 'SERVICIO NORMAL', 15, 128, 'En espera de área'),
(6, 3, 'Urgente', 'CS', 'Diag', 'RT', 'SERVICIO', 'SERVICIO NORMAL', 15, 128, 'En espera de director'),
(7, 3, 'Urgente', 'CS', 'Diag', 'RT', 'SERVICIO', 'SERVICIO NORMAL', 15, 128, 'Aprobada'),
(8, 3, 'Urgente', 'CS', 'Diag', 'RT', 'SERVICIO', 'SERVICIO NORMAL', 15, 128, 'Aprobada'),
(9, 3, 'Ordinario', 'CS', 'Diag', 'RT', 'SERVICIO', 'SERVICIO NORMAL', 15, 133, 'Denegada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidades_medicas`
--

CREATE TABLE IF NOT EXISTS `unidades_medicas` (
  `pinUnidad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(45) NOT NULL,
  `numero` varchar(45) NOT NULL,
  `localidad` varchar(45) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  PRIMARY KEY (`pinUnidad`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `unidades_medicas`
--

INSERT INTO `unidades_medicas` (`pinUnidad`, `nombre`, `tipo`, `numero`, `localidad`, `direccion`) VALUES
(1, 'IMSS', '32', '12', 'cancun', 'dsdew'),
(2, 'IMSS2', '32', '15', 'Cancún', 'Rg 510'),
(3, 'imms', '12', '11', 'cancun', '23492349');

-- --------------------------------------------------------

--
-- Estructura para la vista `datosprove`
--
DROP TABLE IF EXISTS `datosprove`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `datosprove` AS select `pro`.`nombre` AS `nombre`,`pro`.`domicilio` AS `domicilio`,`pro`.`fechaInicial` AS `fechaInicial`,`pro`.`fechaFinal` AS `fechaFinal`,`pro`.`rfc` AS `rfc`,`pro`.`telefono` AS `telefono`,`con`.`numero` AS `numero` from (`contratos` `con` join `proveedores` `pro` on((`con`.`pinProveedor` = `pro`.`pinProveedor`)));

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clicon`
--
ALTER TABLE `clicon`
  ADD CONSTRAINT `pinServConCli` FOREIGN KEY (`pinServCon`) REFERENCES `servcon` (`pinServCon`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pinUnidadCli` FOREIGN KEY (`pinUnidad`) REFERENCES `unidades_medicas` (`pinUnidad`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `contratos`
--
ALTER TABLE `contratos`
  ADD CONSTRAINT `pinprovee` FOREIGN KEY (`pinProveedor`) REFERENCES `proveedores` (`pinProveedor`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `distrpresupuestal`
--
ALTER TABLE `distrpresupuestal`
  ADD CONSTRAINT `pinContDist` FOREIGN KEY (`pinContrato`) REFERENCES `contratos` (`pinContrato`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pinUniDist` FOREIGN KEY (`pinUnidad`) REFERENCES `unidades_medicas` (`pinUnidad`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `estcon`
--
ALTER TABLE `estcon`
  ADD CONSTRAINT `pinEstudio` FOREIGN KEY (`pinEstudio`) REFERENCES `estudios` (`pinEstudio`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pinServCon` FOREIGN KEY (`pinServCon`) REFERENCES `servcon` (`pinServCon`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudios`
--
ALTER TABLE `estudios`
  ADD CONSTRAINT `pinEstudios_Servicio` FOREIGN KEY (`pinServicio`) REFERENCES `servicios` (`pinServicio`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `grupossubrogar`
--
ALTER TABLE `grupossubrogar`
  ADD CONSTRAINT `pinUnidad` FOREIGN KEY (`pinUnidad`) REFERENCES `unidades_medicas` (`pinUnidad`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `fk_pacientes_unidades_medicas` FOREIGN KEY (`pinUnidad`) REFERENCES `unidades_medicas` (`pinUnidad`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `personal`
--
ALTER TABLE `personal`
  ADD CONSTRAINT `fk_personal_unidades_medicas1` FOREIGN KEY (`pinUnidad`) REFERENCES `unidades_medicas` (`pinUnidad`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pinSeccionPersonal` FOREIGN KEY (`pinSeccion`) REFERENCES `secciones` (`pinSeccion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `seccionunidad_med`
--
ALTER TABLE `seccionunidad_med`
  ADD CONSTRAINT `seccionunidad_med_ibfk_1` FOREIGN KEY (`pinUnidad`) REFERENCES `unidades_medicas` (`pinUnidad`) ON UPDATE CASCADE,
  ADD CONSTRAINT `seccionunidad_med_ibfk_2` FOREIGN KEY (`pinSeccion`) REFERENCES `secciones` (`pinSeccion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `servcon`
--
ALTER TABLE `servcon`
  ADD CONSTRAINT `pinContrato` FOREIGN KEY (`pinContrato`) REFERENCES `contratos` (`pinContrato`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pinServicio` FOREIGN KEY (`pinServicio`) REFERENCES `servicios` (`pinServicio`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `subrogaciones`
--
ALTER TABLE `subrogaciones`
  ADD CONSTRAINT `contract` FOREIGN KEY (`contrato`) REFERENCES `contratos` (`pinContrato`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pinPacienteSub` FOREIGN KEY (`pinPaciente`) REFERENCES `pacientes` (`pinPaciente`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pinPersonal` FOREIGN KEY (`pinPersonal`) REFERENCES `personal` (`pinPersonal`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
