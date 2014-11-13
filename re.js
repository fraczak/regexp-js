/* ex ::= {mot:".."} | {union:ex} | {iter:ex} | {union:[ex,..]} | {concat:[ex,..]} */

var ACCEPT = {concat:[]}, REJECT = {union:[]};

// returne booléen 'true', si @e : ex (expression régulière) accepte le mot vide
function accepts(e) {
    if (e.iter) return true;
    if (e.concat) return e.concat.reduce( function(acc,x){ return acc && accepts(x); }, true);
    if (e.union) return e.union.reduce( function(acc,x){return acc || accepts(x)}, false);
    return (e.mot == "");
};

// returne booléen 'true' si @e : ex accepte uniquement le mot vide
function isUnit(e) {
    return ((e.concat && e.concat.length == 0) || e.mot == "");
};

// returne booléen 'true' si @e : ex n'accepte rien (langage vide)
function isEmpty(e){
    return (e.union && e.union.length == 0);
};

var context = {}; // utilisée pour la mémoisation (Wikipedia?)

// returne expression régulière normalisée équivalente à @e : ex 
function normalize(e){
    function register(e){
        function toIndex(e){
            if (e.index) return e.index;
            if (e.mot || e.mot == "") return e.index = "~"+e.mot;
            if (e.iter) return e.index = "*("+toIndex(e.iter)+")";
            if (e.union) return e.index = "+("+e.union.map(toIndex).join(",")+")";
            if (e.concat) return e.index = ".("+e.concat.map(toIndex).join(",")+")";
            throw "ERROR: in 'toIndex("+ e +")'"; };
        return ( context[toIndex(e)] || (context[e.index] = e) ); };
    if (e.index) return e;
    var res;
    if (e.mot == "") res = ACCEPT;
    else if (e.mot) res = e;
    else if (e.iter) {
        var arg = normalize(e.iter);
        if (isEmpty(arg)) res = ACCEPT;
        else if (arg.iter) res = arg;
        else res = {iter: arg};
    } else if (e.union) {
        var alreadyIn = {};
        var args = e.union.map(normalize).reduce(function(acc,x){
            if (isEmpty(x) || alreadyIn[x.index]) return acc;
            [].concat(x.union || x).map(function(y){
                if (alreadyIn[y.index]) return;
                acc.push(y);
                alreadyIn[y.index] = true;
            });
            return acc;}, []);
        if (args.length == 1) res =  args[0];
        else res = {union: args};
    } else if (e.concat) {
        var args = e.concat.map(normalize).reduce(function(acc,x){
            if (isEmpty(x)) return REJECT;
            if (isEmpty(acc) || isUnit(x)) return acc;
            if (x.concat) return acc.concat(x.concat);
            return acc.concat(x) }, [])
        if (args.length == 1) res = args[0];
        else res = {concat: args}; };
    return register(res);
}

// retourne le résultat de la division de @e : ex par une lettre @a
function div(a,e) {
    function step(e) {
        e = normalize(e);
        if (isUnit(e) || isEmpty(e)) return REJECT;
        var f = e[a];
        if (f) return f;
        if (e.mot) {
            if (e.mot.charAt(0) == a) return {mot: e.mot.slice(1)};
            return REJECT;
        } else if (e.iter) {
            f = {concat:[step(e.iter),e]};
        } else if (e.union) {
            f = {union: e.union.map(step)};
        } else if (e.concat) {
            var e0 = step(e.concat[0]);
            var tail = {concat: e.concat.slice(1)};
            if (accepts(e.concat[0]))
                f = {union:[{concat:[e0,tail]},step(tail)]};
            else
                f = {concat:[e0,tail]};
        } else throw "ERROR: in 'step("+JSON.stringify(e)+")' for symbol '"+a+"'";
        return e[a] = f
    };
    return step(e);
}

// retourne Booleén 'true' si mot @w : String est dans @e : ex
function test(e,w){
    if (w == '') return accepts(e);
    return test(div(w.charAt(0),e),w.slice(1));
}

module.exports = {test: test, context: context};
