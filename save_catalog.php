<?php
header("Content-Type: application/json");

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');

    // Validate the JSON input
    if (json_decode($input) === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Invalid JSON data"
        ]);
        exit;
    }

    // Write the input data to catalog.json
    $filePath = 'data/catalog.json';
    if (file_put_contents($filePath, $input)) {
        echo json_encode([
            "status" => "success",
            "message" => "Catalog updated successfully"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Failed to save the catalog"
        ]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
}
?>
