<?php
session_start();
require 'db.php';

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(403);
    echo "Você precisa estar logado!";
    exit;
}

if ($_SERVER['POST']) {
    $progresso = $_POST['progresso'] ?? '';

    $stmt = $conn->prepare("UPDATE progress SET progresso = ? WHERE user_id = ?");
    $stmt->bind_param("si", $progresso, $_SESSION['usuario_id']);
    if ($stmt->execute()) {
        echo "Progresso salvo!";
    } else {
        echo "Erro ao salvar progresso!";
    }
}
?>
