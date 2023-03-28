

function consulta_filtro(filtros){
    return new Promise((resolve, reject) => {
        
        viewer.model.getBulkProperties([], filtros, (result) => {
            let test = result.filter(x => x.properties.length===filtros.length);
            let data = {};
            test.forEach(element => {
               // console.log("LONGITUD"+element.properties.length);
                
                if(element.properties.length == 1){
                   let key = element.properties[0].displayValue;
                   //  console.log("valor propiedad"+ element.properties[0].displayValue);

                    if (key in data) {
                        data[key].cantidad++;
                        data[key].dbIds.push(element.dbId);
                    } else {
                        let a = {
                            cantidad: 1,
                            dbIds: []
                        }
                        a.dbIds.push(element.dbId);
                        data[key] = a;
                    }
                }

                if(element.properties.length==2){
                    
                    if(element.properties[0].displayValue === element.properties[1].displayValue ){
                        let key  = element.properties[0].displayValue;

                    //console.log("valor propiedad 1"+ element.properties[0].displayValue);
                    //console.log("valor propiedad 2"+ element.properties[1].displayValue);

                        if (key in data) {
                            data[key].cantidad++;
                            data[key].dbIds.push(element.dbId);
                           
                        } else {
                            let a = {
                                cantidad: 1,
                                dbIds: []
                            }
                            a.dbIds.push(element.dbId);
                            data[key] = a;
                        }
                    }
                    
                }
                
            });
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}

function busquedaElemento(elemento, arreglo){
    for(var j = 0; j<arreglo.length;j++){
        if(elemento === arreglo[j]){
            return true;
        }
    }
}

function consulta_filtro2(filtros){
    console.log("filtros properties antes");
            console.log(filtros);
    return new Promise((resolve, reject) => {
        
        viewer.model.getBulkProperties([], filtros, (result) => {
            console.log("filtros properties interior");
            console.log(filtros);
            console.log(result);
            let test = result.filter(x => x.properties.length===filtros.length);
            let data = {};
            test.forEach(element => {
                console.log("LONGITUD"+element.properties.length);
                
                if(element.properties.length == 1){
                   let key = element.properties[0].displayValue;
                     console.log("valor propiedad"+ element.properties[0].displayValue);

                    if (key in data) {
                        data[key].cantidad++;
                        data[key].dbIds.push(element.dbId);
                    } else {
                        let a = {
                            cantidad: 1,
                            dbIds: []
                        }
                        a.dbIds.push(element.dbId);
                        data[key] = a;
                    }
                }

                if(element.properties.length==2){
                    
                   // if(element.properties[0].displayValue === valor_fil1 && element.properties[1].displayValue === valor_fil2){
                   if(busquedaElemento(element.properties[0].displayValue,filtros_selec_ha)&&busquedaElemento(element.properties[1].displayValue,filtros_selec_piso) ){  
                   let key  = element.properties[0].displayValue;
                   console.log("ELEMENTO");
                   console.log(element);
                    //console.log("valor propiedad 1"+ element.properties[0].displayValue);
                    //console.log("valor propiedad 2"+ element.properties[1].displayValue);

                        for(var t =0; t<filtros_selec_ha.length; t++){
                            if (filtros_selec_ha[t] in data) {
                                data[filtros_selec_ha[t]].cantidad++;
                                data[filtros_selec_ha[t]].dbIds.push(element.dbId);
                               
                            } else {
                                let a = {
                                    cantidad: 1,
                                    dbIds: []
                                }
                                a.dbIds.push(element.dbId);
                                data[filtros_selec_ha[t]] = a;
                            }
                        }

                        for(var t =0; t<filtros_selec_piso.length; t++){
                            if (filtros_selec_piso[t] in data) {
                                data[filtros_selec_piso[t]].cantidad++;
                                data[filtros_selec_piso[t]].dbIds.push(element.dbId);
                               
                            } else {
                                let a = {
                                    cantidad: 1,
                                    dbIds: []
                                }
                                a.dbIds.push(element.dbId);
                                data[filtros_selec_piso[t]] = a;
                            }
                        }

                        
                    }
                    
                }
                
            });
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}


function consulta_filtro_fechas(filtros){
    return new Promise((resolve, reject) => {
        
        viewer.model.getBulkProperties([], filtros, (result) => {
            let test = result.filter(x => x.properties.length===filtros.length);
            let data = {};
            test.forEach(element => {
               // console.log("LONGITUD"+element.properties.length);
                
                if(element.properties.length == 1){
                   let key = element.properties[0].displayValue;
                   //  console.log("valor propiedad"+ element.properties[0].displayValue);

                    if (key in data) {
                        data[key].cantidad++;
                        data[key].dbIds.push(element.dbId);
                    } else {
                        let a = {
                            cantidad: 1,
                            dbIds: []
                        }
                        a.dbIds.push(element.dbId);
                        data[key] = a;
                    }
                }

                if(element.properties.length==2){
                    
                   // if(element.properties[0].displayValue === valor_fil1 && element.properties[1].displayValue === valor_fil2){
                   if(busquedaElemento(element.properties[0].displayValue,filtros_selec_ha)&&busquedaElemento(element.properties[1].displayValue,filtros_selec_piso) ){  
                   let key  = element.properties[0].displayValue;

                    //console.log("valor propiedad 1"+ element.properties[0].displayValue);
                    //console.log("valor propiedad 2"+ element.properties[1].displayValue);

                        for(var t =0; t<filtros_selec_ha.length; t++){
                            if (filtros_selec_ha[t] in data) {
                                data[filtros_selec_ha[t]].cantidad++;
                                data[filtros_selec_ha[t]].dbIds.push(element.dbId);
                               
                            } else {
                                let a = {
                                    cantidad: 1,
                                    dbIds: []
                                }
                                a.dbIds.push(element.dbId);
                                data[filtros_selec_ha[t]] = a;
                            }
                        }

                        for(var t =0; t<filtros_selec_piso.length; t++){
                            if (filtros_selec_piso[t] in data) {
                                data[filtros_selec_piso[t]].cantidad++;
                                data[filtros_selec_piso[t]].dbIds.push(element.dbId);
                               
                            } else {
                                let a = {
                                    cantidad: 1,
                                    dbIds: []
                                }
                                a.dbIds.push(element.dbId);
                                data[filtros_selec_piso[t]] = a;
                            }
                        }

                        
                    }
                    
                }
                
            });
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}