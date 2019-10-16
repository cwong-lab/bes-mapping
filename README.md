# BES Map Drawing Component

This project handles respondent map drawing for the BES. (Created by [Mark Fredrickson](http://github.com/markmfredrickson))

## Requirements:

- PHP (5.3 or newer) SQLite3

After pulling the repository, build the database:

    $ cd db
    $ make

Back in the main repository, you can start a webserver with:

    $ php -S localhost:8000 -c php.ini -t www

This will start a webserver on your machine on port 8000. Navigate to
`http://localhost:8000/drawing` to create a map.

## URLs

- `/drawing` creates a new map. Optional query string parameters:
-- `visa` is the YouGov id sent from their servers
-- `postcode` allows pre-specifying the address or postcode
-- Example `http://localhost:8000/drawing?visa=239393&postcode=SW1A 2AA`.
- `/drawing/all` lists all drawings in the system with links to individual pages

