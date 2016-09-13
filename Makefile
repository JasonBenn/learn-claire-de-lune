SHELL := /bin/bash

scale:
	heroku ps:scale web=1

local:
	cd client && npm start

venv:
	source ~/.virtualenvs/claire-de-lune/bin/activate
