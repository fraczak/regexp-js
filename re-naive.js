/* ex ::= {mot:".."} | {iter:ex} | {union:[ex,..]} | {concat:[ex,..]} */

var REJECT = {union:[]};

// returne booléen 'true', si @e : ex (expression régulière) accepte le mot vide
function accepts(e){
    if (e.iter) return true;
    if (e.concat) return e.concat.reduce( function(acc,x){ return acc && accepts(x); }, true);
    if (e.union) return e.union.reduce( function(acc,x){ return acc || accepts(x)}, false);
    return (e.mot == ""); };

// returne booléen 'true' si @e : ex accepte uniquement le mot vide
function isUnit(e){ return ((e.concat && e.concat.length == 0) || e.mot == ""); };

// returne booléen 'true' si @e : ex n'accepte rien (langage vide)
function isEmpty(e){ return (e.union && e.union.length == 0); };

// retourne le résultat de la division de @e : ex par une lettre @a
function div(a,e){
    function step(e){
        if (isUnit(e) || isEmpty(e)) return REJECT;
        if (e.mot){
            if (e.mot.charAt(0) == a) return {mot: e.mot.slice(1)};
            return REJECT;
        } else if (e.iter) {
            f = {concat:[step(e.iter),e]};
        } else if (e.union) {
            f = {union: e.union.map(step)};
        } else if (e.concat) {
            var head = e.concat[0], tail = e.concat.slice(1);
            if (accepts(head))
                f = {union:[ { concat: [ step(head) ].concat(tail) },
                             step({ concat: tail }) ]};
            else
                f = { concat: [ step(head) ].concat(tail) };
        } else throw "ERROR: in 'step("+e+")' for symbol '"+a+"'";
        return e[a] = f
    };
    return step(e);
}

// retourne Booleén 'true' si mot @w : String est dans @e : ex
function test(e,w){
    if (w == '') return accepts(e);
    return test(div(w.charAt(0),e),w.slice(1)); };

module.exports = test;
