// require("dotenv").config();
const { createBot, createProvider, createFlow, addKeyword,EVENTS, addAnswer } = require('@bot-whatsapp/bot')

const MetaProvider = require('@bot-whatsapp/provider/meta')
const MockAdapter = require('@bot-whatsapp/database/mock')

// const matrizProduct = [
//     // {producto: '1️⃣ AMARILLA-EMPANADA TRADICIONAL O4 ' , precio: '*Precio:* $ 3700'},
//     // {producto: '1️2️⃣ X 12 CM-EMPANADA MEDIANA' , precio: '*Precio:* $ 3100'},
//     // {producto: '3️⃣ BLANCA-EMPANADA GRANDE 03 ', precio: '*Precio:* $ 4050'},
//     // {producto: '4️⃣ ROJA-EMPANADA GRANDE 01 x 15', precio: '*Precio:* $ 3800'},
//     // {producto: '5️⃣ ROJA-EMPANADA GRANDE 01 x 15', precio: '*Precio:* $ 2800'}
    
// ]
const matrizProduct = []
let cont = 0
const caseNumber = ['1','2','3']
const caseNumberBonds = ['1','2','3']
const caseNumberPqrs = ['1','2','3']
const clientData = [{name:'pepe', number:'123456'}]


/* FLOW PQRS*/
const flowOtherPqrs = addKeyword("##_OTHER_PQRS")
.addAnswer("Deseas agregar otro *PQRS*",
{
    capture:true,
    buttons:[
        {
            body: '1️⃣ Si'
        },

        {
            body: '2️⃣ No'
        }
    ] 
},
async(ctx,{gotoFlow,endFlow})=>{
    const options = ["si","1️⃣ si","1"]
    if(options.includes(ctx.body.toLowerCase())){
        gotoFlow(flowPqrsOptions)
    }else{
        return endFlow("Hemos recibido tu valiosa opinión.")    
    }
}
)

const flowSuggestions = addKeyword(["3️⃣ Sugerencias", "sugerencias", "sugerencia", "3"])
.addAnswer("Dejanos saber tu sugerencia",
{capture:true},
async(ctx,{gotoFlow})=>{
    gotoFlow(flowOtherPqrs)
}
)

const flowClaim = addKeyword(["2️⃣ Reclamos", "reclamo", "reclamos", "2"])
.addAnswer("Dejanos saber tu reclamo",
{capture:true},
async(ctx,{gotoFlow})=>{
    gotoFlow(flowOtherPqrs)
}
)

const flowComplaint = addKeyword(["1️⃣ Quejas", "queja", "quejas", "1"])
.addAnswer("Dejanos saber tu queja",
{capture:true},
async(ctx,{gotoFlow})=>{
    gotoFlow(flowOtherPqrs)
}
)


flowPqrsOptions = addKeyword("##_PQRS_OPTIONS_##")
.addAnswer(["Elige una opción 👇",
"1️⃣ Quejas",
"2️⃣ Reclamos",
'3️⃣ Sugerencias'
],
{ capture:true,},
async(ctx,{fallBack})=>{
    const options = ["1","2","3","quejas","reclamos","sugerencias"]
    if(!options.includes(ctx.body.toLowerCase())){
        fallBack(`
        Lo siento no te he entendido 😕 ingresa una opcion disponible 👇 
         1️⃣ Quejas
        '2️⃣ Reclamos
        '3️⃣ Sugerencias`
        )
    }
},
[flowComplaint,flowClaim,flowSuggestions]
)

const flowPqrsClient = addKeyword(["1️⃣ si", "1", "si"])
.addAnswer("Ingresa tu número de telefono *123456*",
{capture:true},
async(ctx,{endFlow,gotoFlow,provider})=>{
    if(clientData[0].number === ctx.body) {
        await provider.sendtext(ctx.from, `Bienvenido *${clientData[0].name}*`)
        await gotoFlow(flowPqrsOptions)
    }else{
        return endFlow({body: 'No tenemos el número Telefono registrado 😞',
        buttons:[{body:'⬅️ Volver al Inicio' }] 
    })    
    }
    
}
)


const flowPqrs = addKeyword(["no","2️⃣ No","2"])
.addAnswer("¿Eres Cliente 🤔 ? ",
{
    capture:true,
    buttons:[
        {
            body: '1️⃣ Si'
        },

        {
            body: '2️⃣ No'
        }
    ], 
},
async(ctx,{gotoFlow})=>{
    const options = ["no","NO","2️⃣ no","2"]
    if(options.includes(ctx.body.toLowerCase())){
        await gotoFlow(flowPqrsOptions)
    }
    
},
[flowPqrsClient]
)

const flowPqrsValidateCase= addKeyword(['si','1','1️⃣ Si'])
.addAnswer("Ingresa tu número de caso",
{capture: true},
async(ctx, {endFlow})=>{
    if(caseNumberPqrs.includes(ctx.body)){
        //  await provider.sendMessage(ctx.from,'Estamos revisando tu caso 📝....',{pqrscase:"nothing"})
         await endFlow({body: "Gracias por cominicarte con nosotros el estado actual de tu caso es *Resuelto* pronto nos comuncaremos con usted."})
    }else {
        return endFlow({body: 'No tenemos el número de caso registrado 😞',
        buttons:[{body:'⬅️ Volver al Inicio' }] 
    })
    }
    
}
)

const flowPqrsCase = addKeyword(["pqrs","4"])
.addAnswer("¿Ya cuentas con un número de 🤔?",
{
    capture:true,
    buttons:[
        {
            body: '1️⃣ Si'
        },

        {
            body: '2️⃣ No'
        }
    ], 
},
null,
[flowPqrsValidateCase,flowPqrs]
)


/** flow  exchange product for bonuses */
const flowExchangeForBonusesImage = addKeyword(["##ExchangeForBonusesImage##"])

.addAnswer(`Envianos una imagen del producto`,
{capture:true},
null,
)
.addAnswer("¿Deseas agregar más productos 🤔?",
{
    capture: true,
    buttons:[
        {
            body: '1. si'
        },

        {
            body: '2. no'
        }
    ], 
},
async(ctx, {gotoFlow,endFlow}) =>{
    const option = ['si','1','1. si']
    if(option.includes(ctx.body.toLowerCase())){
        await gotoFlow(flowExchangeForBonusesImage)
        
    }else{
        const ramdomNumber = Math.floor(Math.random() * 1000) + 1;
        return endFlow({body: `Tu número de caso es el *${ramdomNumber}*, pronto nos contactaremos con usted, estamos verificando 📝.`})
    }
}
)

const flowExchangeForBonusesType = addKeyword(['##_EXCHANGE_BONUSES_TYPE'])
.addAnswer([
    '¿Qué defecto presenta el producto? 👇',
    '1️⃣ Hongo – moho',
    '2️⃣ Cambio por Rotación',
    '3️⃣ Partido',
    '4️⃣ Destapado',
    '5️⃣ Mal Sellado',
    '6️⃣ Falta Refrigeración'
],
{capture:true},
async(ctx, {gotoFlow,fallBack})=>{
    switch (ctx.body) {
        case '1':
            await gotoFlow(flowExchangeForBonusesImage)
            break;
        case '2':
            await gotoFlow(flowExchangeForBonusesImage)
            break;
        case '3':
            await gotoFlow(flowExchangeForBonusesImage)
            break;
        case '4':
            await gotoFlow(flowExchangeForBonusesImage)
            break;
        case '5':
             await gotoFlow(flowExchangeForBonusesImage)
            break;
        case '6':
            await gotoFlow(flowExchangeForBonusesImage)
            break;
    
        default:
            fallBack(`
            Lo siento no te he entendido 😕 ingresa una opcion disponible 👇 
             1️⃣ Hongo – moho
            '2️⃣ Cambio por Rotación
            '3️⃣ Partido
            '4️⃣ Destapado'
            '5️⃣ Mal Sellado
            '6️⃣ Falta Refrigeración`
    )
            break;
    }
}
)

const flowExchangeForBonusesName = addKeyword(['no','2'])
.addAnswer("¿Que productos tiene defectos 🤔 ?",
{capture:true},
async(ctx,{gotoFlow})=>{
    await gotoFlow(flowExchangeForBonusesType)
}
)

const flowExchangeForBonusesValidateCase= addKeyword(['si','1'])
.addAnswer("Ingresa tu número de caso",
{capture: true},
async(ctx, {provider, endFlow})=>{
    if(caseNumberBonds.includes(ctx.body)){
         await provider.sendMessage(ctx.from,'Estamos revisando tu caso 📝....',{exchange:"nothing"})
         await endFlow({body: "Gracias por cominicarte con nosotros el estado actual de tu caso es *Resuelto* pronto nos comuncaremos con usted."})
    }else {
        return endFlow({body: 'No tenemos el número de caso registrado 😞',
        buttons:[{body:'⬅️ Volver al Inicio' }] 
    })
        
    }
    
}
)

const flowExchangeForBonusesValidate = addKeyword(['3'])
.addAnswer("¿Tienes un número de caso asignado 🤔 ? ",
{
    capture:true,
    buttons:[
        {
            body: '1️⃣ Si'
        },

        {
            body: '2️⃣ No'
        }
    ], 
},
null,
[flowExchangeForBonusesName,flowExchangeForBonusesValidateCase] 
)


/** Flow Change Product */
const flowProductToBeatImage = addKeyword ("##_PRODUCT_BEAT_IMAGE_##")
.addAnswer("Envianos una foto o imagen donde podamos ver la fecha de vencimiento ",
{capture:true},
null,
).addAnswer("¿Deseas agregar más productos 🤔?",
{
     capture: true,
    buttons:[
        {
            body: '1️⃣ Si'
        },

        {
            body: '2️⃣ No'
        }
    ], 
},
async(ctx, {gotoFlow,endFlow}) =>{
    const option = ['si','1','1️⃣ si']
    if(option.includes(ctx.body.toLowerCase())){
        await gotoFlow(flowNewCase)
        
    }else{
        const ramdomNumber = Math.floor(Math.random() * 1000) + 1;
        return endFlow({body: `Tu número de caso es el *${ramdomNumber}*, pronto nos contactaremos con usted estamos verificando 📝.`})
    }
}
)

const flowNewCase= addKeyword(['no','2'])

.addAnswer("Ingresa tu producto por vencer",
{capture: true},
async (ctx,{gotoFlow}) => {
    await gotoFlow(flowProductToBeatImage)
    }
)


const flowCaseValidate= addKeyword(['si','1'])
.addAnswer("Ingresa tu número de caso",
{capture: true},
async(ctx, {provider, endFlow})=>{
    if(caseNumber.includes(ctx.body)){
         await provider.sendMessage(ctx.from,'Estamos revisando tu caso 📝....',{productcase:"nothing"})
         await endFlow({body: "Gracias por cominicarte con nosotros el estado actual de tu caso es *Pendiente* pronto nos comuncaremos con usted."})
    }else {
        return endFlow({body: 'No tenemos el número de caso registrado 😞',
        buttons:[{body:'⬅️ Volver al Inicio' }] 
    })
        
    }
    
}
)


const flowChangeProduct = addKeyword(['2'])
.addAnswer("¿Tienes un número de caso asignado 🤔 ? ",
{
    buttons:[
        {
            body: '1️⃣ Si'
        },

        {
            body: '2️⃣ No'
        }
    ], 
},
null,
[flowCaseValidate,flowNewCase] 
)

/*flow Pedido*/

async function procesarElementos(matriz,flowDynamic) {
    let total = 0;
    for (const elemento of matriz) {
      const subtotal = elemento.cantidad * elemento.precio;
      await flowDynamic(`${elemento.producto} Subtotal : ${elemento.cantidad} x  ${elemento.precio}  =  ${subtotal}`);
      console.log(`Producto ${elemento.producto} Subtotal : ${elemento.cantidad} x ${elemento.precio} =  ${subtotal}`);
      total += subtotal;
    }
    return total;
  }

  const flowFinishOrder = addKeyword(["##_FINISH_ORDER"])
  .addAnswer(["Resumen de tu pedido. ☝️","Su pedido *ha sido tomado*, pero será verificado"],
  null,
  async(ctx,{flowDynamic,provider,endFlow})=>{
      const matriz = [...matrizProduct]
      const total = await procesarElementos(matriz,flowDynamic)
      const ramdomNumber = Math.floor(Math.random() * 1000) + 1;
      matrizProduct.length = 0;
      matriz.length = 0;
  
      // Como estaba antes cortabas el flujo y no reinicia la matriz
      await endFlow({body: `El total de tu pedido es: $ *${total}* Tu número de caso es el *${ramdomNumber}*, pronto nos contactaremos con usted`})
     
         
  }
  )

// const flowFinishOrder = addKeyword(["##_FINISH_ORDER"])
// .addAnswer(["Resumen de tu pedido. ☝️","Su pedido *ha sido tomado*, pero será verificado"],
// null,
// /** 
// async(ctx,{flowDynamic,provider,endFlow})=>{
//     const matriz = [...matrizProduct]
//     let total = 0

//     async function procesarElementos(matriz) { 

//          matriz.forEach(elemento => {
//         const subtotal = elemento.cantidad * elemento.precio;
//         flowDynamic(`${elemento.producto} Subtotal : ${elemento.cantidad} x  ${elemento.precio}  =  ${elemento.cantidad*elemento.precio}`)
//         console.log(`Producto ${elemento.producto} Subtotal : ${elemento.cantidad} x ${elemento.precio} =  ${elemento.cantidad*elemento.precio}`);
//         total += subtotal;
        
//       });
//     }
//     procesarElementos(matriz)
//     const ramdomNumber = Math.floor(Math.random() * 1000) + 1;
//     await endFlow({body: `El total de tu pedido es: $ *${total}* Tu número de caso es el *${ramdomNumber}*, pronto nos contactaremos con usted`})
//     matrizProduct.length = 0;
//     matriz.length = 0;
//     /** 
//      matriz.forEach(elemento => {
//         // flowDynamic({body:elemento.producto + ' Subtotal : ' + elemento.cantidad + ' x ' + elemento.precio  + ' = ' + elemento.cantidad*elemento.precio} )
//         flowDynamic(`${elemento.producto} Subtotal : ${elemento.cantidad} x  ${elemento.precio}  =  ${elemento.cantidad*elemento.precio}`)
//         console.log(`Producto ${elemento.producto} Subtotal : ${elemento.cantidad} x ${elemento.precio} =  ${elemento.cantidad*elemento.precio}`);
//         total += elemento.cantidad*elemento.precio;
        
//       });
//         matrizProduct.length = 0;
//         matriz.length = 0;
//     //   await flowDynamic(`El todal de tu pedido es: ${total}`);
      
//       const ramdomNumber = Math.floor(Math.random() * 1000) + 1;
//       await endFlow({body: `El total de tu pedido es: $ *${total}* Tu número de caso es el *${ramdomNumber}*, pronto nos contactaremos con usted`})
//         // provider.sendtext(ctx.from, `El todal de tu pedido es: ${total}`)*/
      
// //}

// )


const flowAddMore = addKeyword("##_FLOW_ADDMORE_##")
.addAnswer("¿Deseas agregar más productos ?",
{
    capture:true,
    buttons:[
        {
            body: '1️⃣ Si'
        },

        {
            body: '2️⃣ No'
        }
    ], 
},
async(ctx,{gotoFlow})=>{
    const option =  ['1️⃣ si', '1','si']
    if( option.includes(ctx.body.toLowerCase())){
        await gotoFlow(flowNewOrder)
    }else{
        await gotoFlow(flowFinishOrder)
        // pedido esta casi listo (hacer resumen de la  compra y enviar)
    }
},

)

const flowAmount = addKeyword("##_FLOW_AMOUNT_##")
.addAnswer("Ingresa la cantidad",
{capture:true},
async(ctx,{gotoFlow})=>{
    for (let i = 0; i < matrizProduct.length; i++) {
        if (matrizProduct[i].id === cont) {
          matrizProduct[i].cantidad = ctx.body
          console.log("estoy en monto",matrizProduct[i].producto + " CANTIDAD " +matrizProduct[i].cantidad + " PRECIO "+matrizProduct[i].precio + " ID "+matrizProduct[i].id)
          console.log("Aca inmprimo la matriz producto ",matrizProduct)
          break;
        }
      }
    await gotoFlow(flowAddMore)
}
)

const flowBags = addKeyword(['4','bolsa','bolsas'])
.addAnswer( [
    "Seleccionar productos 👇",
    '1️⃣ Bolsas * 13 CM *Precio:* $ 3800',  
],
{capture:true},
async(ctx,{gotoFlow,fallBack})=>{
    switch (ctx.body) {
        case '1':
            cont++;
            matrizProduct.push({id:cont,producto: 'Bolsas * 13 CM', precio: 3800})
            await gotoFlow(flowAmount)
            break
        default:
            fallBack(`Lo siento no te he entendido 😕 ingresa una opcion disponible 👇 
            1️⃣ Bolsas * 13 CM *Precio:* $ 3800`
            )
            break  
    }
}
)

const flowHorneables = addKeyword(['3','horneables'])
.addAnswer( [
    "Seleccionar productos 👇",
    '1️⃣ HORNEABLE * 13 CM *Precio:* $ 3800',
    '2️⃣ HORNEABLE *15 CM  *Precio:* $ 3700',  
],
{capture:true},
async(ctx,{gotoFlow,fallBack})=>{
    switch (ctx.body) {
        case '1':
            cont++;
            matrizProduct.push({id:cont,producto: 'HORNEABLE * 13 CM', precio: 3800})
            await gotoFlow(flowAmount)
            break
        case '2':
            cont++;
            matrizProduct.push({id:cont, producto: 'HORNEABLE *15 CM', precio: 3700})
            await gotoFlow(flowAmount)
            break
        default:
            fallBack(`Lo siento no te he entendido 😕 ingresa una opcion disponible 👇 
            1️⃣ HORNEABLE * 13 CM *Precio:* $ 3800
            2️⃣ HORNEABLE *15 CM  *Precio:* $ 3700`
            )
            break  
    }
}
)

const flowFlautas = addKeyword(['2','flautas'])
.addAnswer( [
    "Seleccionar productos 👇",
    '1️⃣ FLAUTA GRANDE 02 *Precio:* $ 3900',
    '2️⃣ FLAUTA PEQUEÑA 01x15  *Precio:* $ 3700',  
],
{capture:true},
async(ctx,{gotoFlow,fallBack})=>{
    switch (ctx.body) {
        case '1':
            cont++;
            matrizProduct.push({id:cont,producto: 'FLAUTA GRANDE 02', precio: 3900})
            await gotoFlow(flowAmount)
            break
        case '2':
            cont++;
            matrizProduct.push({id:cont, producto: 'FLAUTA PEQUEÑA 01x15', precio: 3700})
            await gotoFlow(flowAmount)
            break
        default:
            fallBack(`Lo siento no te he entendido 😕 ingresa una opcion disponible 👇 
            1️⃣ FLAUTA GRANDE 02 *Precio:* $ 3900
            2️⃣ FLAUTA PEQUEÑA 01x15  *Precio:* $ 3700`
            )
            break  
    }
}
)

const flowEmpanadas = addKeyword(['1','empanadas','1️⃣ si'])
.addAnswer( [
    "Seleccionar productos 👇",
    '1️⃣ AMARILLA-EMPANADA TRADICIONAL O4 *Precio:* $ 3700',
    '2️⃣ X 12 CM-EMPANADA MEDIANA  *Precio:* $ 3100', 
    '3️⃣ BLANCA-EMPANADA GRANDE 03 *Precio:* $ 4050', 
    '4️⃣ ROJA-EMPANADA GRANDE 01 x 15  *Precio:* $ 3800', 
    '5️⃣ EMPANADA PASABOCA *Precio:* $ 2800', 
    
],
{capture:true},
async(ctx,{state,gotoFlow,fallBack})=>{
    switch (ctx.body) {
        case '1':
            cont++;
            matrizProduct.push({id:cont,producto: 'AMARILLA-EMPANADA TRADICIONAL O4', precio: 3700})
            state.update({producto: "AMARILLA-EMPANADA TRADICIONAL O4", precio:3700})
            const myState1 = state.getMyState()
            // console.log(`${myState1.producto} ${myState1.precio}`)
            await gotoFlow(flowAmount)
           
            break
        case '2':
            cont++;
            matrizProduct.push({id:cont, producto: 'X 12 CM-EMPANADA MEDIANA', precio: 3100})
            // state.update({producto: "X 12 CM-EMPANADA MEDIANA3", precio:3100})
            // const myState2 = state.getMyState()
            // console.log(`${myState2.producto} ${myState2.precio}`)
            await gotoFlow(flowAmount)
            break
        case '3':
            cont++;
            matrizProduct.push({id:cont,producto: 'BLANCA-EMPANADA GRANDE 03', precio: 4050})
            // state.update({producto: "BLANCA-EMPANADA GRANDE 03", precio:4050})
            // const myState3 = state.getMyState()
            // console.log(`${myState3.producto} ${myState3.precio}`)
            await gotoFlow(flowAmount)
            break
        case '4':
            cont++;
            matrizProduct.push({id:cont, producto: 'ROJA-EMPANADA GRANDE 01 x 15', precio: 3800})
            // state.update({producto: "ROJA-EMPANADA GRANDE 01 x 15", precio:3800})
            // const myState4 = state.getMyState()
            // console.log(`${myState4.producto} ${myState4.precio}`)
            await gotoFlow(flowAmount)
            break
        case '5':
            cont++;
            matrizProduct.push({id:cont,producto: 'EMPANADA PASABOCA', precio: 2800})
            // state.update({producto: "EMPANADA PASABOCA", precio:2800})
            // const myState5 = state.getMyState()
            // console.log(`${myState5.producto} ${myState5.precio}`)
            await gotoFlow(flowAmount)
            break
        default:
                fallBack(`Lo siento no te he entendido 😕 ingresa una opcion disponible 👇 
                1️⃣ AMARILLA-EMPANADA TRADICIONAL O4 *Precio:* $ 3700 Empanadas
                2️⃣ X 12 CM-EMPANADA MEDIANA  *Precio:* $ 3100
                3️⃣ BLANCA-EMPANADA GRANDE 03 *Precio:* $ 4050
                4️⃣ ROJA-EMPANADA GRANDE 01 x 15  *Precio:* $ 3800
                5️⃣ EMPANADA PASABOCA *Precio:* $ 2800 `
            )
            break  
    }
}
)

const flowNewOrder = addKeyword(['1','nuevo pedido'])
.addAnswer(
    [
    'Acontinuación escribe que producto deseas llevar 👇',
    '1️⃣ Empanadas',  
    '2️⃣ Flautas', 
    '3️⃣ Horneables', 
    '4️⃣ Bolsas',
    
    ],
{ capture: true, },
async(ctx, {fallBack})=>{
    const options = ['1','2','3','4']
    if(!options.includes(ctx.body)){
        fallBack(`Lo siento no te he entendido 😕 ingresa una opcion disponible 👇 
        1️⃣ Empanadas
        2️⃣ Flautas
        3️⃣ Horneables
        4️⃣ Bolsas `
    )
    }
},
    [flowEmpanadas,flowFlautas,flowHorneables,flowBags]
)


/* FLOW WELCOME */
const flowWelcome = addKeyword(EVENTS.WELCOME)  
        .addAnswer(
            'Hola 👋 soy *Guía Bot* 🤖 de Practipastas.',
            { capture: false},
            
        async (ctx, { provider,fallBack,gotoFlow }) => {

            const headerText = `👨‍💻 Me encanta ser tu anfitrión`
            const bodyText = '¿Cuál de nuestros servicios deseas adquirir? 👇'
            const footerText = '#Practipastas'
            const buttonList = 'Selecciona o Escribe'
            const listParams = [
                {
                    title: 'Nuestros Servicios',
                    rows: [
                        {
                            id: 'services-1',
                            title: '1. Pedido Nuevo',
                            // description: '(Empanadas, Flautas, Horneables, Bolsas, etc)'
                        },
                        {
                            id: 'services-2',
                            title: `2. Cambio de productos`,
                            description: '(Por vencimiento)'
                        },
                        {
                            id: 'services-3',
                            title: '3. Cambio por Bonos',
                            description: '(Mal estado del producto)'
                        },
                        {
                            id: 'services-4',
                            title: '4. PQRS',
                            description: '(Quejas, Reclamos y Sugerencias)'
                        },
                    ]
                }
            ]
            await provider.sendMedia(ctx.from, 'https://static.wixstatic.com/media/6c75e3_9693bc0092fa4cdca28dae688486e913~mv2.png/v1/fill/w_649,h_674,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/aed.png')
             provider.sendList(ctx.from, headerText, bodyText, footerText, buttonList ,listParams)
        },
        
        [flowNewOrder, flowChangeProduct, flowExchangeForBonusesValidate,flowExchangeForBonusesType, flowPqrsCase]
        )

       

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome,flowProductToBeatImage,flowExchangeForBonusesImage,flowAmount,flowAddMore,flowFinishOrder,flowPqrsOptions,flowOtherPqrs])

    const adapterProvider = createProvider(MetaProvider, {
        jwtToken:'EAACL9hB15KQBOZB3VsE5aZC61NugsgoRvTcjy3CW00MEKmCZCqrx6Jg0cctMrUn9pN0A5VzmahA8nj6Q8ZAdlCqUhsw6klYJCIakjK1GTOL2UlCc3CSHuW2iH7h1qH0EYmT5001h7XLV8ZAHB8oGm2rnKyRU6ntbFJxUnlESvSTtVUENoqvmZC8ltqvhmTvS1U',
        numberId: '114365078428515',
        verifyToken: '1234',
        version: 'v16.0',
    })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    },
    
    // {
    //     queue: {
    //         timeout: 180000,
    //         concurrencyLimit: 15,
    //     },
    // }
    )
}

main()
