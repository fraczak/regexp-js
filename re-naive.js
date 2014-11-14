// ex ::= {mot:"."} | {union:ex} | {iter:ex} | {union:[ex,..]} | {concat:[ex,..]}
var ACCEPT = {concat:[]}, REJECT = {union:[]};

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
        var f = e[a];
        if (f) return f;
        if (e.mot){
            if (e.mot.charAt(0) == a) return {mot: e.mot.slice(1)};
            return REJECT;
        } else if (e.iter){
            f = {concat:[step(e.iter),e]};
        } else if (e.union) {
            f = {union: e.union.map(step)};
        } else if (e.concat){
            var e0 = step(e.concat[0]);
            var tail = {concat: e.concat.slice(1)};
            if (accepts(e.concat[0])) f = {union:[{concat:[e0,tail]},step(tail)]};
            else f = {concat:[e0,tail]}; };
        return e[a] = f };
    return step(e); };

// retourne Booleén 'true' si mot @w : String est dans @e : ex
function test(e,w){
    if (w == '') return accepts(e);
    return test(div(w.charAt(0),e),w.slice(1)); };

module.exports = test;
