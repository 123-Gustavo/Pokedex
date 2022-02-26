
//Gerar a lista a de pokemons da pokedex
var pokemons = []

function pegaPokemons(quantidade){
       fetch(`https://pokeapi.co/api/v2/pokemon?limit=${quantidade}`,{
           method:'GET'
       })
            .then(response=>response.json())
            .then(allpokemon => {

              
                allpokemon.results.map((val)=>{
                    

                    fetch(val.url)
                        .then(response=>response.json())
                        .then(pokemonSingle => {
                            pokemons.push({
                                name:val.name,
                                img:pokemonSingle.sprites.front_default
                            })

                            //Implementar a caixa de cada pokemon na pokedex
                            if(pokemons.length == quantidade){
                                //Finalizamos nossas requisições

                                var pokemonBoxes = document.querySelector('.pokemon-boxes')
                                pokemonBoxes.innerHTML = ""

                                generatePage()

                                pokemons.map(function (val) {

                                    
                                        pokemonBoxes.innerHTML += `
                                    <div opt="${val.name}" class="pokemon-box">
                                        <img src="${val.img}">
                                        <p>${val.name}</p>
                                    </div><!--Pokemon-box-->
                                    `
                                    
                                    
                                    })
                                    
                            }
                        })
                })

            

        })
}


//Colocar o input pra gerar a quantia de pokemons
var quantidade = document.getElementById("quantidade")

quantidade.addEventListener('change',()=>{
    pokemons = []
    pegaPokemons(Number(quantidade.value))
    quantidade.value =  ""
    pesq.value = ""
}) 


//Função pra dar mais informações do pokemon
var poke = []

function generatePage(){

    //Esperar o ajax carregar
    setTimeout(() => {

        //Cadastrar o evento de clique na box do pokemon
       var element = document.querySelectorAll(".pokemon-boxes .pokemon-box")

        for(var i = 0; i < pokemons.length;i++){
            element[i].addEventListener('click',(t)=>{

                poke = []

                var parent = t.target.parentNode

                let paragrafos = parent.querySelectorAll("p")[0]
                let nomeURL = paragrafos.innerHTML
                
                //nomeURL = t.target.getAttribute("opt")


                //Fazer a requisão ajax pra descobrir as informações do pokemon
                fetch(`https://pokeapi.co/api/v2/pokemon/${nomeURL}`)
                    .then(response=>response.json())
                    .then(data =>{

                        //Adicionar as informações do pokemon
                        poke.push({
                            nome:data.name,
                            height:data.height,
                            weight:data.weight,
                            tipo:data.types.map(item => item.type.name).toString(),
                            skills:data.moves.map(item => item.move.name),
                            skills_url:data.moves.map(item2 => item2.move.url),
                            img:data.sprites.front_default,
                            imgFrontNormal:data.sprites.front_default,
                            imgBackNormal:data.sprites.back_default,
                            imgFrontShiny:data.sprites.front_shiny,
                            imgBackShiny:data.sprites.back_shiny
                        })
                
                        //console.log(poke)

                        //Cadastrar a div de informações
                        generateBody()
                    })
            })
        } 
    }, 1000);
} 

function generateBody(){
    for(var i = 0; i < poke.length; i++){
        //Cadastrar a div de informações
         var container = document.querySelector(".main .infos")
         var inputQuant = document.getElementById("quantidade")
         var inputPesq = document.getElementById("pesquisa")
         var label = document.querySelectorAll("label")
         var pokemonContainer = document.querySelector(".main .pokemon-boxes")
         inputQuant.style.display = "none"
         inputPesq.style.display = "none"
         label[0].style.display = "none"
         label[1].style.display = "none"
         pokemonContainer.style.display = "none"

        var opcoes = "<option></option>"

        for(var c = 0; c < poke[i].skills.length; c++){
            opcoes += `<option value="${poke[i].skills_url[c]}">${poke[i].skills[c]}</option>`
        }
        var sliderImg = ""

        for(var u = 0; u < poke.length; u++){
            sliderImg += `
                <img class="selected" id="img-slider" src="${poke[i].imgFrontNormal}"/>
                <img id="img-slider" src="${poke[i].imgBackNormal}"/>
                <img id="img-slider" src="${poke[i].imgFrontShiny}"/>
                <img id="img-slider" src="${poke[i].imgBackShiny}"/>
            `
        }  


         //Criar a area de informações do pokemon
         container.innerHTML += `
             <div class="img">
                 <div class="imagem">
                     <img src="${poke[i].img}"/>
                 </div>
                 <div class="slider-pokemon">
                    ${sliderImg}
                 </div>
             </div>
             <div class="info">
                <div class="informacoes">
                     <h3>Nome: </h3>
                     <p>${poke[i].nome}</p>
                     <h3>Altura: </h3>
                     <p>${poke[i].height}</p>
                     <h3>Peso: </h3>
                     <p>${poke[i].weight}</p>
                     <h3>Tipo: </h3>
                     <p>${poke[i].tipo}</p>
                     <h3>Habilidades</h3>
                     <select name="skillsList" id="skillsList">
                        ${opcoes}
                     </select>
                     <div class="result" id="result">

                     </div>
                </div>
            </div>
            <div class="botao">
                <button id="voltar"><i class="fa fa-arrow-left"></i></button>
            </div>
             `    

             //Slider

             var lastIndex = 0

            var images = document.querySelectorAll(".infos .img .slider-pokemon img")

            images.forEach((item,index)=>{
                document.querySelectorAll('#img-slider')[index]
                .addEventListener('click',(t)=>{
                    //Resetar as bullets e setar a nova com base na imagem

                    var img = t.target.src
                    var imgPrincipal = document.querySelector(".infos .img .imagem img")

                    document.querySelectorAll("#img-slider")[lastIndex]
                    .classList.remove("selected")

                    document.querySelectorAll("#img-slider")[index]
                    .classList.add("selected")

                    imgPrincipal.src = img

                    lastIndex = index
                    
                })
            })

            //Informações da habilidades

            var select = document.getElementById("skillsList")
            var sk = []
            
            select.addEventListener("change",function(){
                var indice = select.selectedIndex
                var valor = select.value
                var texto = select.options[indice].text
                var resultado = document.querySelector(".result")

                if(valor == ""){
                    resultado.innerHTML = ""
                }else{
                    fetch(valor)
                        .then(response=>response.json())
                        .then(data=>{
                            
                            //Resetar o array onde está as infos da habilidade
                            sk = []

                            //Cadastrar as informações no array
                            sk.push({
                                name:data.name,
                                precisao:data.accuracy,
                                type:data.type.name,
                                contra:data.damage_class.name,
                                power:data.power
                            })

                            //Adicionar as informações no campo
                            for(var n = 0; n < sk.length; n++){
                                resultado.innerHTML = `
                                    nome: ${sk[n].name}<br/>
                                    precisão:${sk[n].precisao}<br/>
                                    tipo: ${sk[n].type}<br/>
                                    contra: ${sk[n].contra}<br/>
                                    poder: ${sk[n].power}
                                `
                            }
                            

                            
                        })
                }
            })

             //Sistema de voltar a pagina principal
            var volta = document.getElementById("voltar")

            volta.addEventListener("click",()=>{
                inputQuant.style.display = "inline-block"
                inputQuant.style.width = "97%"
                inputQuant.style.height = "40px"
                inputQuant.style.paddingLeft = "10px"

                inputPesq.style.display = "inline-block"
                inputPesq.style.width = "97%"
                inputPesq.style.height = "40px"
                inputPesq.style.marginTop = "5px"
                inputPesq.style.paddingLeft = "10px"

                label[0].style.display = "inline-block"
                label[0].style.width = "3%"
                label[0].style.fontSize = "17pt"
                label[0].style.cursor = "pointer"
                label[0].style.color = "#4d4d4da4"
                
                label[1].style.display = "inline-block"
                label[1].style.width = "3%"
                label[1].style.fontSize = "17pt"
                label[1].style.cursor = "pointer"
                label[1].style.color = "#4d4d4da4"

                pokemonContainer.style.display = "flex"
                container.innerHTML = ""
                var pokemonBoxes = document.querySelector('.pokemon-boxes')
                pokemonBoxes.innerHTML = ""
            })
    }
}

function pokeName(namepoke){
    fetch(`https://pokeapi.co/api/v2/pokemon/${namepoke}`)
        .then(response=>response.json())
        .then(dados=>{

            

            pokemons = []

            pokemons.push({
                name:dados.name,
                img:dados.sprites.front_default
            })


            
            //Finalizamos nossas requisições

            var pokemonBoxes = document.querySelector('.pokemon-boxes')
            pokemonBoxes.innerHTML = ""

            generatePage()

            pokemons.map(function (val) {

                    
                pokemonBoxes.innerHTML += `
                <div opt="${val.name}" class="pokemon-box">
                    <img src="${val.img}">
                    <p>${val.name}</p>
                </div><!--Pokemon-box-->
                `
                    
                    
            })
                    
        


        })
}


var pesq = document.getElementById("pesquisa")

pesq.addEventListener("change",()=>{
    pokeName(pesq.value)
    pesq.value = ""
    quantidade.value = ""
})

const btn = document.querySelectorAll(".mode-alternete .btn")

btn.forEach((item, index)=>{
    btn[index].addEventListener("click",(e)=>{

        if(btn[index].classList.contains("active")){
            btn[index].classList.toggle("unactive","active")
            var botao = e.target

            var buttonOn = botao.parentNode.parentNode.querySelector("#on")
            var buttonOff = botao.parentNode.parentNode.querySelector("#off")


            if(buttonOn.classList.contains("active")){
                buttonOn.classList.remove("active")
                buttonOn.classList.add("unactive")
                buttonOff.classList.add("active")
                buttonOff.classList.remove("unactive")
                darkmode()
            }else{
                buttonOn.classList.remove("unactive")
                buttonOn.classList.add("active")  
                buttonOff.classList.remove("active")
                buttonOff.classList.add("unactive")
                lightmode()
            }
        }
    
    })
})

function darkmode(){
    let main = document.querySelector(".main")
    let pokemon_boxes = document.querySelectorAll(".pokemon-box")
    let infos = document.querySelector(".infos")
    let i = document.querySelector(".main .mode-alternete h1 i")
    let label = document.querySelectorAll("label")
    let pokemonBox = document.querySelector(".main .pokemon-boxes .pokemon-box")

    document.body.style.backgroundColor = "rgba(27, 27, 27, 0.863)"
    main.style.backgroundColor = "#b8b8b81c"
    label[0].style.color = "#2929299f"
    label[1].style.color = "#2929299f"

    for(var h = 0; h < pokemons.length;h++){
        pokemon_boxes[h].style.backgroundColor = "rgba(141, 141, 141, 0.863)"
    }

    let paragrafosInfos = document.querySelectorAll(".infos .info .informacoes p")

    for(var f = 0; f < paragrafosInfos.length; f++){
        paragrafosInfos[f].style.backgroundColor = "rgba(200, 200, 200, 0.929)"
    }

    let h3Infos = document.querySelectorAll(".infos .info .informacoes h3")

    for(var g = 0; g < h3Infos.length;g++){
        h3Infos[g].style.color = "white"
    }

    let imgSlider = document.querySelectorAll(".img .slider-pokemon img")

    for(var j = 0; j < imgSlider.length; j++){
        imgSlider[j].style.backgroundColor = "rgba(151, 151, 151, 0.842)"        
    }
}

function lightmode(){
    let main = document.querySelector(".main")
    let pokemon_boxes = document.querySelectorAll(".pokemon-box")
    let infos = document.querySelector(".infos")
    let i = document.querySelector(".main .mode-alternete h1 i")
    let label = document.querySelectorAll("label")
    let pokemonBox = document.querySelector(".main .pokemon-boxes .pokemon-box")

    document.body.style.backgroundColor = "white"
    main.style.backgroundColor = "#b8b8b885"
    label[0].style.color = "#4d4d4da4"
    label[1].style.color = "#4d4d4da4"

    for(var h = 0; h < pokemons.length;h++){
        pokemon_boxes[h].style.backgroundColor = "rgb(230, 230, 230);"
    }

    let paragrafosInfos = document.querySelectorAll(".infos .info .informacoes p")

    for(var f = 0; f < paragrafosInfos.length; f++){
        paragrafosInfos[f].style.backgroundColor = "rgba(167, 167, 167, 0.507)"
    }

    let h3Infos = document.querySelectorAll(".infos .info .informacoes h3")

    for(var g = 0; g < h3Infos.length;g++){
        h3Infos[g].style.color = "black"
    }

    let imgSlider = document.querySelectorAll(".img .slider-pokemon img")

    for(var j = 0; j < imgSlider.length; j++){
        imgSlider[j].style.backgroundColor = "white"        
    }
}