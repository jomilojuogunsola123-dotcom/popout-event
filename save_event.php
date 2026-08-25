<?php

require_once "db.php";
/* ===========================
   RECEIVE POST DATA
=========================== */

$flyer = $_POST['flyer'] ?? "";

$name = $_POST['name'] ?? "";
$description = $_POST['description'] ?? "";
$category = $_POST['category'] ?? "";

$start = $_POST['start_date'] ?? "";
$end = $_POST['end_date'] ?? "";

$link = $_POST['link'] ?? "";

$location = $_POST['location'] ?? "";

$website = $_POST['website'] ?? "";
$instagram = $_POST['instagram'] ?? "";
$twitter = $_POST['twitter'] ?? "";
$tiktok = $_POST['tiktok'] ?? "";

$early_price = $_POST['early_price'] ?? 0;
$early_qty = $_POST['early_qty'] ?? 0;

$regular_price = $_POST['regular_price'] ?? 0;
$regular_qty = $_POST['regular_qty'] ?? 0;

$vip_price = $_POST['vip_price'] ?? 0;
$vip_qty = $_POST['vip_qty'] ?? 0;

$fee_bearer = $_POST['fee_bearer'] ?? "";

/* ===========================
   PREPARE SQL
=========================== */

$sql = "
INSERT INTO events
(
    flyer,
    event_name,
    description,
    category,
    start_date,
    end_date,
    event_link,
    location,
    website,
    instagram,
    twitter,
    tiktok,
    early_price,
    early_qty,
    regular_price,
    regular_qty,
    vip_price,
    vip_qty,
    fee_bearer
)
VALUES
(
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Prepare Failed: " . $conn->error);
}

/* ===========================
   BIND PARAMETERS
=========================== */

$stmt->bind_param(
    "ssssssssssssdididis",

    $flyer,
    $name,
    $description,
    $category,
    $start,
    $end,
    $link,
    $location,
    $website,
    $instagram,
    $twitter,
    $tiktok,
    $early_price,
    $early_qty,
    $regular_price,
    $regular_qty,
    $vip_price,
    $vip_qty,
    $fee_bearer
);

/* ===========================
   EXECUTE
=========================== */

if ($stmt->execute()) {
    echo "✅ Event created successfully!";
} else {
    echo "Database Error: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>