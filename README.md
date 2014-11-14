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

La version naïve `re-naive.js`, sans normalisation de l'expression
rationnelle, est aussi fournie. Elle est beaucoup plus courte mais, en
générale, elle ne va pas marcher pour des mots plus longs.
