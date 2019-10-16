bes.db: COMPLETED COMPLETED/001_drawings

COMPLETED:
	mkdir -p COMPLETED

COMPLETED/001_drawings: 001_drawings.sql
	sqlite3 bes.db < 001_drawings.sql
	touch COMPLETED/001_drawings

