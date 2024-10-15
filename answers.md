# Exercises - Answers

## 1

Refactored the code a little bit on FE and added unit tests for the bug.
you can run `yarn test` after running `yarn` locally to test this,
or run it in Docker with the console, no need for any install there

## 4

I would make a nice datetime handling system, saving in UTC dates in the DB and using a date library on the FE that processes UTC date strings, but it is out of scope of this task.

## 5

Built a dummy logger, but would like to implement a proper logging with Winston or Log4js-node.
But this should suffice for the small task at hand. Also updated unit tests to make sure we always log on any action.
