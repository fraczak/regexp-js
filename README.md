regexp-js
=========

Correction pour le devoir 1.

Pour tester le programme, installez `nodejs`, puis, dans un terminale, faites :

    $ node
    > testeur = require("./re");
    > testeur( {union: [{iter: {mot:"aa"}}, {iter: {mot:"aaa"}}]}, "aaaaa");
    > testeur( {union: [{iter: {mot:"aa"}}, {iter: {mot:"aaa"}}]}, "aaaaaaaaa");
Vous pouvez voir toutes les expressions régulières considérées durant toute
votre session avec le programme en examinant l'attribue `context` du module.

    > testeur.context


