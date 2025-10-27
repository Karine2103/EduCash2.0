<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "educash";

// Criar conexão
$conn = new mysqli($host, $user, $pass, $dbname);

// Checar conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>
