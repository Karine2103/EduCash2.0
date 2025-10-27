<?php
session_start();
require 'db.php';

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['erro' => 'Usuário não logado']);
    exit;
}

$stmt = $conn->prepare("SELECT progresso FROM progress WHERE user_id = ?");
$stmt->bind_param("i", $_SESSION['usuario_id']);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode($data);
?>
