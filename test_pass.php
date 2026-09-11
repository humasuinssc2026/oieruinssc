<?php
$hash = '$2b$10$W5Sbm2gUVyxTFIAW4lsmF.XvUN1H4EaQyXzxR7NeAjITd2OIFKet2';
$words = ['password', '123456', 'admin123', 'admin', 'password123', 'oier123', 'oieruinssc', 'superadmin', 'Superadmin', 'Admin123', 'Admin', 'oier@uinssc'];
foreach($words as $w) {
    if(password_verify($w, $hash)) echo "Found for superadmin: $w\n";
}
echo "Done\n";
