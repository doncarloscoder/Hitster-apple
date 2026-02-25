<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET["id"])) {
    echo json_encode(["error" => "Missing id"]);
    exit;
}

$id = $_GET["id"];
$url = "https://api.song.link/v1-alpha.1/links?platform=spotify&type=song&id=" . urlencode($id);

echo file_get_contents($url);
