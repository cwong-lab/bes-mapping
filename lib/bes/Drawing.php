<?php

class Drawing extends Controller {
    
  function getMapper() {
    return(new DB\SQL\Mapper($this->db, 'drawings'));
  }

  function all($f3) {
    $drawing = $this->getMapper();
    $table = $drawing->find();
    $f3->set('table', $table);
    $view = new View;
    echo $view->render("../lib/bes/allDrawings.html");
  }

  function create($f3, $params) {
    if (array_key_exists('visa', $f3->get("REQUEST"))) {
      $f3->set('yougovid', $f3->get("REQUEST")['visa']);
    } else {
      $f3->set('yougovid', '');
    }

    $hasPostcode = false;
    if (array_key_exists('postcode', $f3->get("REQUEST"))) {

      $f3->set("postcode", $f3->get("REQUEST")['postcode']);
      $hasPostcode = true;

    } else {
      $f3->set("postcode", "");
    }
    
    if (array_key_exists('lat', $f3->get("REQUEST"))) {
      $f3->set("lat", $f3->get("REQUEST")['lat']);
    } else {
      $f3->set("lat", "53");
    }

    if (array_key_exists('lon', $f3->get("REQUEST"))) {
      $f3->set("lon", $f3->get("REQUEST")['lon']);
    } else {
      $f3->set("lon", "-1");
    }

    if ($hasPostcode) {
      $f3->set("zoom", rand(12, 18));
    } else {
      $f3->set("zoom", 6);
    }

    $view = new View;
    echo $view->render('../lib/bes/drawing.html');
  }

  function get($f3, $params) {
    $drawing = $this->getMapper();
    $row = $drawing->load("id = " . $params['item']);
    $f3->mset(array('id'       => $row->id,
                    'yougovid' => $row->yougovid,
                    'drawing'  => $row->drawing,
                    'events'   => $row->events,
                    'postcode' => $row->postcode));

    $view = new View;
    echo $view->render('../lib/bes/showDrawing.html');
  }
  
  function post($f3, $params) {
    if (array_key_exists('visa', $f3->get("REQUEST"))) {
      $f3->set('yougovid', $f3->get("REQUEST")['visa']);
    } else {
      $f3->set('yougovid', '');
    }

		$drawing = $this->getMapper();
		$drawing->copyfrom('POST'); // TODO: need to sanitize input to avoid SQL injection, etc.
    $drawing->save();
    $id = $drawing->get('_id');
    $f3->reroute("/drawing/" . $id);
  }

  // PUT and DELETE are not allowed directly. (At least until there is some sort of admin interface)
  function put($f3, $params) {
    $f3->error(500);
  }
  function delete($f3, $params) {
    $f3->error(500);
  }
}

