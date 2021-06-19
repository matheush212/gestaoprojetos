function ReturnDataJSON(err, rows, tabela){
    try{
        if (err)
            return {"status": 404, "message": err.message};

        if (rows != null && rows != "")
            return {"status": 200, "message": tabela+" carregados com sucesso!", "data": rows};
        else 
            return {"status": 400, "message": tabela+" não encontrados(as)!", "data": rows};
    }
    catch(err){
        return {"status": 404, "message": err.message};
    }
}
exports.ReturnDataJSON = ReturnDataJSON;
