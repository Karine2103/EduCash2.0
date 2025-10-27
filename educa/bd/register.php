<?php
session_start();
require 'db.php';

// Receber dados do formulário
$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$account_type = $_POST['account_type'] ?? '';
$birthdate = $_POST['birthdate'] ?? '';
$age = $_POST['age'] ?? '';

if ($username && $email && $password && $account_type && $birthdate && $age) {
    // Checar se usuário já existe
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        echo "Usuário ou email já existe!";
        exit;
    }

    $stmt->close();

    // Determinar o perfil com base na idade
    $profile = 'adult'; // padrão
    if ($age >= 0 && $age <= 10) {
        $profile = 'kids';
    } elseif ($age > 10 && $age < 18) {
        $profile = 'teen';
    }

    // Inserir usuário com senha criptografada e dados adicionais
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, account_type, birthdate, age, profile) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssis", $username, $email, $hash, $account_type, $birthdate, $age, $profile);
    
    if ($stmt->execute()) {
        echo "Cadastro realizado com sucesso!";
        header("Location: ../login.html");
        exit;
    } else {
        echo "Erro ao cadastrar: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Preencha todos os campos!";
}

$conn->close();
?>