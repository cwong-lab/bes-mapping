<?php

$f3 = require("../lib/f3/lib/base.php");
$f3->set("AUTOLOAD", "../lib/bes/");

$f3->route('GET /', function($f3) { $view = new View; echo $view->render("../lib/bes/instructions.html"); });

$f3->route('GET /drawing', 'Drawing->create');
$f3->route('POST /drawing', 'Drawing->dispatch');
$f3->route('GET /drawing/all', 'Drawing->all');
$f3->map('/drawing/@item', 'Drawing');

$f3->route('GET /php', function() { phpinfo(); });

$f3->run();