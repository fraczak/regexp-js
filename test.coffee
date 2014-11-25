testeurs = [
    require "./re"
    require "./re-naive"
    ]

r = [{union:[]},{mot:""}]  # r[0] - lang. vide, r[1] - unit

mots = ["", "a", "aaaa", "abab", "aaaaaaaaaaaaaaaaa", "aaaaaaaaaaaaaaaaaa"]
exps = [ r[0], r[1],
         {iter:r[0]},
         {iter:{union:[{mot:"aa"},{mot:"aaa"}]}},
         {union:[{iter:{mot:"aa"}},{iter:{mot:"aaa"}}]}
       ]

for e in exps
    console.log "Expression E: #{JSON.stringify e} :"
    for w in mots
        res = ( f(e,w) for f in testeurs )
        ok = res.reduce (acc, x) ->
            acc and (x is res[0])
        , true
        if ok
            console.log "  ...passed: '#{w}' in E - #{res[0]}"
        else
            console.log "  !!!FAILED for '#{w}'"
