<?php
session_start();
require 'db.php';

// Receber dados do formulário
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if ($username && $password) {
    // Buscar usuário incluindo o perfil
    $stmt = $conn->prepare("SELECT id, password, profile FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 1) {
        $stmt->bind_result($id, $hash, $profile);
        $stmt->fetch();

        if (password_verify($password, $hash)) {
            // Login ok - redirecionar baseado no perfil
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            $_SESSION['profile'] = $profile;
            
            // Redirecionar baseado no perfil do usuário
            switch ($profile) {
                case 'kids':
                    header("Location: ../homepageKIDS.html");
                    break;
                case 'teen':
                    header("Location: ../homepageTEEN.html");
                    break;
                case 'adult':
                default:
                    header("Location: ../homepage.html");
                    break;
            }
            exit;
        } else {
            echo "Senha incorreta!";
        }
    } else {
        echo "Usuário não encontrado!";
    }

    $stmt->close();
} else {
    echo "Preencha todos os campos!";
}

$conn->close();
?>