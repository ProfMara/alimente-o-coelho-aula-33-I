//namespacing
//criar uma variável de nome menor para referir a algo de nome maior
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint


//variaveis
var engine;
var world;
var corda, fundoImg, frutaImg;
var botao, coelho, coelhoImg;
var piscando, triste, comendo;
var somAr, somComer, somCorte, somFundo;
var balao, botaoMutar;
function preload(){
    coelhoImg = loadImage("coelho.png")
    frutaImg = loadImage("fruta.png");
    fundoImg = loadImage("planodefundo.png");

    triste = loadAnimation("triste1.png","triste2.png","triste3.png");
    piscando = loadAnimation("piscar1.png","piscar2.png","piscar3.png");
    comendo = loadAnimation("comer1.png","comer2.png","comer3.png","comer4.png","comer5.png")
    
    comendo.looping = false;
    triste.looping = false; 
    //carregando os sons
    somAr = loadSound("ar.mp3");
    somComer = loadSound("comendo.mp3");
    somCorte = loadSound("corte.mp3");
    somFundo = loadSound("fundo.mp3");
}

function setup() {
    createCanvas(500, 700);

    piscando.frameDelay = 25;
    triste.frameDelay = 25;
    comendo.frameDelay = 25;
    if(!somFundo.isPlaying()){
        somFundo.setVolume(0.1)
        somFundo.play()
    }

    //cria o motor
    engine = Engine.create();
    world = engine.world;

    solo = new Solo();
    //criar um objeto da classe 
    fruta = new Fruta(250,300);
    corda = new Corda({x:250, y:100}, fruta.body)

    coelho = createSprite(350,620);
  
    coelho.addAnimation("piscando",piscando);
    coelho.addAnimation("triste",triste);
    coelho.addAnimation("comendo",comendo);
    coelho.scale = 0.2;

    //cria a imagem de botão
    botao = createImg("cortar.png");
    botao.size(55, 50);
    botao.position(220,60);
    botao.mouseClicked(cortar);

    //desafio: criar a imagem de balão
    balao = createImg("balão.png");
    balao.size(100, 80);
    balao.position(20,280);
    balao.mouseClicked(soprar);

    ///desafio: criar o botão de mutar
    botaoMutar = createImg("mutar.png");
    botaoMutar.size(50, 50);
    botaoMutar.position(450,20);
    botaoMutar.mouseClicked(mutar);

    rectMode(CENTER);
    imageMode(CENTER)
   
}
function soprar(){
    somAr.play();
    Body.applyForce(fruta.body, {x:0,y:0}, {x:1, y:0})
}

function cortar(){
    //remover a conexão do mundo
    World.remove(world, corda.sling)
    corda.sling = null;
    somCorte.play();
}

function mutar(){
    if(somFundo.isPlaying()){ 
        somFundo.stop()
    }else{
        somFundo.play()
    }
}
function draw() {

    background(0);    
    //atualiza o motor
    Engine.update(engine);
    image (fundoImg, width/2, height/2, width, height)
    //pinta o solo
    fill("green");
    
    solo.show();
    if(corda.sling != undefined){
        corda.criar();
    }
    
    drawSprites()
    if(fruta !== null){
        fruta.show();
        if(detectarColisao(fruta.body, coelho)){
            coelho.changeAnimation("comendo")
            somComer.play()
        }
    }
    
    if(fruta!=null && detectarColisao(fruta.body, solo.body)){
        coelho.changeAnimation("triste")
    }
    
    
}

function detectarColisao(corpo, sprite){
    if(fruta!=null){
        //função que calcula a distância entre dois pontos
        var d = dist(corpo.position.x, corpo.position.y, sprite.position.x, sprite.position.y);
        if(d < 80){
            World.remove(world, fruta.body);
            fruta = null;
            return true;
        }else{
            return false;
        }
    }
    
}