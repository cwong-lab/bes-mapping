<?php

//! Base controller
class Controller {

	protected
		$db;

	//! HTTP route pre-processor
	function beforeroute($f3) {
	}

	//! HTTP route post-processor
	function afterroute() {
		// Render HTML layout
		// echo Template::instance()->render('layout.htm');
	}

  // POST, PUT, and DELETE are often the same thing for browsers.
  // Instead we disptach on a special hidden field.
  function dispatch($f3, $params) {
    if (array_key_exists('_httptype', $f3->get("REQUEST"))) {
      switch ($f3->get("REQUEST")['_httptype']) {
      case 'POST':
        return($this->post($f3, $params));
        break;
      case 'PUT':
        return($this->put($f3, $params));
        break;
      case 'DELETE':
        return($this->delete($f3, $params));
        break;
      }

      $f3->error(500);
    }
  }

	//! Instantiate class
	function __construct() {
		$f3 = Base::instance();
		// Connect to the database
    $db_path = 'sqlite:' . dirname(__FILE__) . '/../../db/bes.db';
    $db = new DB\SQL($db_path);
		$this->db = $db;
	}

}
