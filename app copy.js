// require("dotenv").config();



const { createBot, createProvider, createFlow, addKeyword,EVENTS, addAnswer } = require('@bot-whatsapp/bot')

const MetaProvider = require('@bot-whatsapp/provider/meta')
const MockAdapter = require('@bot-whatsapp/database/mock')


const flowEmpanadas = addKeyword(['1','1 empanadas'])
.addAnswer("👍 Estas son las empanadas 🥟 disponibles",
{ capture: false, },
async (ctx, { provider, endFlow }) => {

     const list = {
                "header": {
                    "type": "text",
                    "text": "Tenemos una gran variedad"
                },
                "body": {
                    "text": "Elige cual deseas llevar 👇"
                },
                "footer": {
                    "text": "#Practipastas"
                },
                "action": {
                    "button": "Selecciona o Escribe",
                    "sections": [
                        {
                            "title": "Empanada Tradicionales",
                            "rows": [
                                {
                                    "id": "<LIST_SECTION_1_ROW_1_ID>",
                                    "title": "AMARILLA O4",
                                    "description": "$ 3700"
                                },
                            ]
                        },
                        {
                            "title": "Empanadas Grandes",
                            "rows": [
                                {
                                    "id": "<LIST_SECTION_2_ROW_1_ID>",
                                    "title": "BLANCA-EMPANADA 03",
                                    "description": "$ 4050"
                                },
                                {
                                    "id": "<LIST_SECTION_2_ROW_2_ID>",
                                    "title": "ROJA-EMPANADA 01 x 15",
                                    "description": "$ 3800"
                                }
                            ]
                        },
                        {
                            "title": "Empanadas Medianas",
                            "rows": [
                                {
                                    "id": "<LIST_SECTION_2_ROW_1_ID>",
                                    "title": "X 12 CM MEDIANA",
                                    "description": "$ 3100"
                                },
                            ]
                        },
                        {
                            "title": "Empanadas Pasabocas",
                            "rows": [
                                {
                                    "id": "<LIST_SECTION_2_ROW_1_ID>",
                                    "title": "EMPANADA PASABOCA",
                                    "description": "$ 2800"
                                },
                            ]
                        },

                    ]
                }
            }
            await provider.sendLists(ctx.from, list)
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
async (ctx, { endFlow,fallBack }) => {
    
    const data = ['1', '2', '3', '4'];
    if(!data.includes(ctx.body)){
        return fallBack("Lo siento no has escogido una opción válida")
    }
    endFlow();
    },
    [flowEmpanadas]
)




const flowWelcome = addKeyword(EVENTS.WELCOME)  
        .addAnswer(
            'Hola 👋 soy *Guía Bot* 🤖 de Practipastas.',
            { capture: false},
            
        async (ctx, { provider, endFlow}) => {

            const headerText = `👨‍💻 Me encanta ser tu anfitrión`
            const bodyText = '¿Cuál de nuestros servicios deseas adquirir? ⬇️'
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
                            title: '4. Quejas o Reclamos',
                            description: '(PQRS)'
                        },
                    ]
                }
            ]
            await provider.sendMedia(ctx.from, 'https://static.wixstatic.com/media/6c75e3_9693bc0092fa4cdca28dae688486e913~mv2.png/v1/fill/w_649,h_674,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/aed.png')
            await provider.sendList(ctx.from, headerText, bodyText, footerText, buttonList ,listParams)
            /** 
            const data = ['1', '2', '3', '4','1. Pedido Nuevo', 'pedido' ,'Pedido Nuevo', 'pedido nuevo'];
            if(data.includes(ctx.body) || data.includes(ctx.title_list_reply) ) {
                // return fallBack('Lo siento no has escogido una opcion válida') 
                gotoFlow(flowNewOrder)
                
                 }
                 */
            endFlow();
            
        },
        
        [flowNewOrder]
        )

       

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome])

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
    })
}

main()
