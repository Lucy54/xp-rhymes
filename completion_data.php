<?php

include('database_config.php');

$subject_info = json_decode(file_get_contents('php://input'), true);

try {
  $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);

  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Table should have rowID, workerID, 
  $stmt = $conn->prepare("SELECT COUNT(*) AS `count` FROM `$table_completion` WHERE `workerID` = :id;");
  $stmt->bindValue(":id", $subject_info['id']);
  $stmt->execute();


  // Second stage is to create prepared SQL statement using the column
  // names as a guide to what values might be in the JSON.
  // If a value is missing from a particular trial, then NULL is inserted
  $sql = "INSERT INTO `$table_completion` (`workerID`) VALUES (:id)";

  $insertstmt = $conn->prepare($sql);
  $insertstmt->bindValue(":id", $subject_info['id']);
  $insertstmt->execute();

  $r["success"] = true;
  echo json_encode($r);
} catch(PDOException $e) {
  $r = array('success' => false, 'error_message' => $e->getMessage());
  echo json_encode($r);
}

$conn = null;



?>
