# Delia
This is a simple application that allows you to share anecdotes with friends in a fun way.

## Concept

Let a cycle be a set of times (e.g 7 days).

Every cycle each user will be able to do several actions:
- write an anecdote
- try to guess who has written each anecdote of the previous cycle
- see the result of every user in the room for the answers to the anecdotes two cycles ago

## Install

1. Clone this repository
2. ``npm i`` or ``yarn install`` in both ``./delia/delia`` and ``./delia/backend``
3. Create mysql database: ``mysql -u [user] -p [database_name] < ./backend/sql/delia.sql``
4. Update the ``./backend/config.json.example`` according to your mysql configuration
5. Start the client ``yarn start`` in ``./delia/delia``
6. Start the server ``node server.js`` in ``./delia/backend``

## Todo

- Everything that is marked todo in the code
- Add a way to create rooms with the interface
- Add structure of database