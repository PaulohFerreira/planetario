/*
	player_escala.js

	Aplicação de Realidade Aumentada na web para apoiar o ensino do Sistema Solar
	Parte do Trabalho de Conclusão de Curso para obtenção da Graduação em
	Ciência da Computação pela Universidade Federal de São Paulo - Unifesp
	
	Paulo Henrique da Silva Ferreira
	10/07/2018
*/


//#=========================#
//|       CONSTANTES        |
//#=========================#
// Caminho do diretório onde estão todas as texturas que serão utilzadas
const textureDirectoryPath = "./src/images/textures/"; 
// Caminho do diretório onde estão todos os arquivos necessários para 
const backendDiretoryPath = "./src/backend/";



//#=======================================#
//|     INICIALIZAÇÃO DAS BIBLIOTECAS     |
//#=======================================#
// Aqui são inicializados os objetos necessários ao funcionamento das bibliotecas usadas
// (No caso, Three.js e AR.js)

document.body.style["overflow-x"] = "hidden"; // Bloqueia o scroll horizontal da tela
document.body.style["overflow-y"] = "hidden"; // Bloqueia o scroll vertical da tela

// Inicializa o relógio que nos dará informações relacionadas aos tempos de execução
let clock = new THREE.Clock();

// Inicializa o renderizador do three.js, para renderizar os objetos 3D
// sobre os marcadores
let threeRenderer = new THREE.WebGLRenderer({
	canvas: arCanvas,
	antialias: true,
	alpha: true
});
threeRenderer.setClearColor(new THREE.Color("lightgrey"), 0);
threeRenderer.setSize(1280, 960);

// Inicializa a cena e a câmera 3D
let scene3D = new THREE.Scene(); // Guarda todos os objetos a serem renderizados, e serve como referencial para posicionar os elementos 3D
let camera3D = new THREE.PerspectiveCamera(); // Indica de que jeito os objetos deverão ser renderizados (em relação a posicionamento, iluminação, etc)

scene3D.add(camera3D);

// Inicializa a iluminação
// A iluminação é necessária para permitir a visualização das texturas dos modelos 3D,
// já que o processo de renderização segue os mesmos princípios da física no que diz
// respeito à formação de imagens
let ambientLight = new THREE.AmbientLight(0x444444);
let directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 0, 1).normalize(); // Posiciona a luz direcional acima dos modelos 3D
scene3D.add(ambientLight);
scene3D.add(directionalLight);

// Inicializa os objetos necessários à biblioteca AR.js, responsável pela parte de Realidade Aumentada (RA)
// O objeto do tipo THREEx.ArToolkitSource é responsável por indicar a origem das imagens
// a serem analizadas para o tracking de posição. Nesse caso, usamos uma câmera, porém
// podemos usar uma imagem ou um vídeo pré-gravado
let arToolkitSource = new THREEx.ArToolkitSource({
	sourceType: "webcam", // câmera para o uso de realidade aumentada
	// Resolução da origem das imagens
	sourceWidth: 1280,
	sourceHeight: 960,
	// Resolução em que mostramos as imagens capturadas 
	displayWidth: 1280,
	displayHeight: 960,
});

// Toda vez que esse objeto é inicalizado, ou o tamanho da tela muda, precisamos
// atualizar os objetos da biblioteca AR.js sobre essa mudança
// Configura a manipulação de resize da tela
function onResize(){
	arToolkitSource.onResizeElement();
	arToolkitSource.copyElementSizeTo(threeRenderer.domElement);
	if(arToolkitContext.arController !== null) arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
}
arToolkitSource.init(function onReady(){ onResize(); }); // Na inicialização do objeto
window.addEventListener("resize", function(){ onResize() }); // Quando a janela é redimensionada


// O objeto do tipo THREEx.ArToolkitContext é o principal da biblioteca. Ele é o
// responsável por encontrar a posição do marcador na origem das imagens
let arToolkitContext = new THREEx.ArToolkitContext({
	cameraParametersUrl: backendDiretoryPath + "files/camera_para.dat", // Predefinições de câmera
	detectionMode: "mono" // Nessa aplicação os marcadores são monocromáticos, mas também pode-se usar marcadores
});
arToolkitContext.init(function onCompleted(){
	// Copia a matriz de projeção da câmera da cena 3D para o objeto responsável pelo posicionamento dos marcadores
	camera3D.projectionMatrix.copy(arToolkitContext.getProjectionMatrix()); 
});



//#========================================#
//|       INICIALIZAÇÃO DA APLICAÇÃO       |
//#========================================#
// Aqui fica todo o código relacionado à inicialização de objetos da aplicação
// Vamos usar o objeto spaceObjects para configurar os modelos

let markerReferences = []; // Vetor com referências a todos os marcadores de RA

// Varre o JSON com as informações dos modelos 3D e dos textos relacionados aos planetas
for(let object in spaceObjects){
	// Grupo que guardará o que deverá ser mostrado
	let markerGroup = createARMarkerGroup(
		arToolkitContext,
		scene3D,
		backendDiretoryPath + "files/" + spaceObjects[object].modelInformation.markerPatternName
	);

	// Modelo 3D
	let model = create3DSphericalObject(textureDirectoryPath + spaceObjects[object].modelInformation.textureName);
	model.position.y = 0.5;

	// Caso o objeto a ser renderizado seja Saturno, devemos criar além do modelo do planeta o modelo do anel. Assim, é necessário um tratamento à parte
	if(spaceObjects.hasOwnProperty(object) && object === "saturn"){
		// Instancia o modelo 3D do anel
		let innerRadius = 2.2;
		let outerRadius = 3;
		let phiSegments = 1;
		let thetaSegments = 32;
		let ringGeometry = new THREE.RingBufferGeometry(innerRadius, outerRadius, thetaSegments, phiSegments);
		
		// Para que a textura do anel de saturno seja disposta corretamente, precisamos modificar o vetor UV do anel,
		// que indica de que forma a textura deve ser disposta no modelo
		let uvOffest = 0; // para navegar no vetor de UV
		for(let j = 0; j <= phiSegments; j++){
			for(let i = 0; i <= thetaSegments; i++){
				ringGeometry.attributes.uv.array[uvOffest++] = i / thetaSegments;
				ringGeometry.attributes.uv.array[uvOffest++] = j / phiSegments;
			}
		}

		// Vincula o modelo criado anteriormente à textura
		let ringModel = new THREE.Mesh(
			ringGeometry,
			new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load(textureDirectoryPath + "saturn_ring.png"),
				side: THREE.DoubleSide,
				transparent: true
			})
		);
		ringModel.rotation.x = Math.PI/2;
		ringModel.position.y = 0.5;

		// Adiciona o modelo do anel ao modelo do planeta
		model.add(ringModel);
	}

	// Canvas de Texto
	let textboxCanvas = createTextPanel(spaceObjects[object].textboxInformation);
	let spriteMaterial = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(textboxCanvas) });
	let sprite = new THREE.Sprite(spriteMaterial);
	
	// Configura o posicionamento inicial da caixa de texto, bem como sua visibilidade
	// Por conta do anel, a disposição do canvas no modelo de Saturno é diferente. Por isso, precisamos desse if
	if(spaceObjects.hasOwnProperty(object) && object === "saturn") sprite.position.x = 6.3;
	else sprite.position.x = 5.3;

	sprite.position.y = 1;
	sprite.scale.set(7, 7, 1);
	sprite.visible = false;

	// Guardamos uma referência da caixa de texto no modelo, para podermos acessar a caixa de texto tendo só o modelo
	model.textboxReference = sprite;
	// Guardamos uma referência das informações científicas do planeta real, para podermos usá-las no futuro
	model.scientificInformation = spaceObjects[object].scientificInformation

	// Vincula o modelo ao grupo à ser mostrado no marcador
	markerGroup.add(model);
	// Vincula o canvas de texto ao grupo à ser mostrado no marcador
	markerGroup.add(sprite);

	// Por fim, adiciona o marcador à lista de referências dos marcadores, para uso futuro
	markerReferences.push(markerGroup);
}


//#=========================#
//|       ATUALIZAÇÃO       |
//#=========================#
// Aqui fica todo o código referente a atualizações de estado da aplicação
// Essa função é executada uma vez a cada frame
function update(delta){
	// Antes de atualizar as outras coisas, tenta atualizar os objetos da AR.js
	if(arToolkitSource.onReady === false){ return; }
	arToolkitContext.update(arToolkitSource.domElement);

	// Faz o redimensionamento dos planetas em escala
	// Determina quem é o maior planeta visível
	let biggerVisible = 0;
	for(let i = 0; i < markerReferences.length; i++){
		if(markerReferences[i].visible && markerReferences[i].children[0].scientificInformation.diameter > biggerVisible)
			biggerVisible = markerReferences[i].children[0].scientificInformation.diameter;
	}

	// Escala todos os planetas para a proporção correta
	for(let i = 0; i < markerReferences.length; i++){
		if(markerReferences[i].visible){
			// Como o objeto markerReferences[] é um grupo que guarda o modelo 3D e o canvas de texto, precisamos redimensionar apenas um dos elementos do grupo,
			// e não o grupo todo
			markerReferences[i].children[0].scale.set(
				markerReferences[i].children[0].scientificInformation.diameter/biggerVisible,
				markerReferences[i].children[0].scientificInformation.diameter/biggerVisible,
				markerReferences[i].children[0].scientificInformation.diameter/biggerVisible
			);
		}
	}

}

// Esse bloco de código é responsável por detectar toques nos modelos 3D dos planetas, e com isso mudar a visibilidade da caixa de texto 
window.addEventListener("touchstart", function(e){
	let mouse = new THREE.Vector2(); // Guardará as coordenadas do toque
	let raycaster = new THREE.Raycaster();

	// Transforma as coordenadas do toque da tela em coordenadas do espaço 3D
    mouse.x = (( e.changedTouches[0].clientX - threeRenderer.domElement.offsetLeft ) / threeRenderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = -(( e.changedTouches[0].clientY - threeRenderer.domElement.offsetTop ) / threeRenderer.domElement.clientHeight ) * 2 + 1;
	
	// Inicializa o raycaster
	raycaster.setFromCamera(mouse, camera3D);

	// Para funcionar, precisamos de um array de objetos 3D. Como nossos modelos 3D estão dentro de objetos do tipo THREE.Group, precisamos extraí-los.
	// E já que vamos letrer a array inteira, vamos colocar nesse vetor apenas os objetos que podem de fato ser tocados. Ou seja, os que estão visíveis.
	let touchableCandidates = [];
	for (let i=0; i<markerReferences.length; i++){
		if(markerReferences[i].visible) touchableCandidates.push(markerReferences[i].children[0]);
	}

	// O processo de raycast consiste do disparo de um raio invisível de um certo ponto (nesse caso o ponto do toque na tela) em uma certa direção (nesse caso a direção do
	// campo de visão da câmera), com a intenção de descobrir todos os objetos 3D que intersectem esse raio. Dessa forma, sabemos quais são os objetos em que o usuário "tocou".
	// A função retorna um array com todos os objetos que o raio interceptou, em sequência de aparição (primeiro a interceptar, segundo, terceiro, etc.)
	let intersects = raycaster.intersectObjects(touchableCandidates);

	// Nesse caso, queremos que apenas o primeiro objeto responda ao toque do usuário. Então, podemos ignorar os outros elementos do vetor de interseções.
	if(intersects.length > 0) intersects[0].object.textboxReference.visible = !intersects[0].object.textboxReference.visible; 

}, false);



//#=========================#
//|       RENDERIZAÇÃO      |
//#=========================#

// Aqui fica todo o código referente à renderização de objetos da aplicação
// Essa função também é executada uma vez a cada frame
function draw(){
	// Como todos os objetos 3D estão dentro de uma cena, só precisamos mandar renderizar a cena
	threeRenderer.render(scene3D, camera3D);
}



// Por fim, inicializa o loop de atualização e renderização
requestAnimationFrame(function animate(){
	let delta = 0.75 * clock.getDelta(); // Tempo passado entre cada um dos frames

	// Faz a atualização e a renderização da aplicação nesse frame
	update(delta);
	draw();

	// Continua o loop de forma recursiva
	requestAnimationFrame(animate);
});



//#=========================#
//|   FUNÇÕES AUXILIARES    |
//#=========================#

/*
Nome: create3DSphericalObject()
Cria uma esfera 3D a partir de uma textura. Útil para criar os planetas, a lua e o sol
- Parâmetros:
	texturePath: String com o caminho para a textura

- Retorno:
	objectMesh: O objeto 3D criado
*/
function create3DSphericalObject(texturePath){
	let objectGeomety = new THREE.SphereBufferGeometry(1.9, 32, 32); // Dimensões obtidas com testes para uma boa visualização
	let objectTexture = new THREE.TextureLoader().load(texturePath);
	let objectMaterial = new THREE.MeshBasicMaterial({ map: objectTexture });
	let objectMesh = new THREE.Mesh(objectGeomety, objectMaterial);

	return objectMesh;
}


/*
Nome: createARMarkerGroup()
Cria um Group linkado a um marcador de Realidade Aumentada.
Podemos adicionar conteúdos a esse grupo, e eles serão mostrados sobre o marcador.
- Parâmetros:
	arContext: Objeto de contexto do AR.js
	scene: Objeto Scene do Three.JS, que contém todos os objetos a serem renderizados
	patternUrl: Caminho do arquivo usado para reconhecer o marcador

- Retorno:
	group: Objeto Group linkado ao marcador
*/
function createARMarkerGroup(arContext, scene, patternUrl){
	let group = new THREE.Group();
	let markerControls = new THREEx.ArMarkerControls(arContext, group,{
		type: "pattern",
		patternUrl: patternUrl
	});
	scene.add(group);
	return group;
}


/*
Nome: createTextPanel()
Cria um painel de texto em um Canvas
- Parâmetros:
	config: Objeto JSON com as configurações do planeta (que contém os textos)

- Retorno:
	canvas: Canvas com o painel de texto pronto
*/
function createTextPanel(config){
	let canvas = document.createElement("canvas");
	let context = canvas.getContext("2d");

	// Configuração inicial do Canvas
	canvas.width = 1024;
	canvas.height = 1024;

	// Fundo
	context.beginPath();
	context.moveTo(config.startX, config.startY + config.cornerRadius); // Início do canto arredondado
	context.arcTo(config.startX, config.startY, config.startX + config.cornerRadius, config.startY, config.cornerRadius); // Canto arredondado
	context.lineTo(config.startX + config.width - config.cornerRadius, config.startY); // Lado superior do retângulo
	context.arcTo(config.startX + config.width, config.startY, config.startX + config.width, config.startY + config.cornerRadius, config.cornerRadius);
	context.lineTo(config.startX + config.width, config.startY + config.height - config.cornerRadius); // Lado direito do retângulo
	context.arcTo(config.startX + config.width, config.startY + config.height, config.startX + config.width - config.cornerRadius, config.startY + config.height, config.cornerRadius);
	context.lineTo(config.startX + config.cornerRadius, config.startY + config.height); // Lado inferior do retângulo
	context.arcTo(config.startX, config.startY + config.height, config.startX, config.startY + config.height - config.cornerRadius, config.cornerRadius);
	context.closePath(); // Lado esquerdo do retângulo

	// Configura o estilo do fundo
	context.fillStyle = config.backgroundStyle;
	context.fill(); // Pinta a área criada

	// Moldura
	context.beginPath();
	context.moveTo(config.startX, config.startY + config.cornerRadius); // Início do canto arredondado
	context.arcTo(config.startX, config.startY, config.startX + config.cornerRadius, config.startY, config.cornerRadius); // Canto arredondado
	context.lineTo(config.startX + config.width - config.cornerRadius, config.startY); // Lado superior do retângulo
	context.arcTo(config.startX + config.width, config.startY, config.startX + config.width, config.startY + config.cornerRadius, config.cornerRadius);
	context.lineTo(config.startX + config.width, config.startY + config.height - config.cornerRadius); // Lado direito do retângulo
	context.arcTo(config.startX + config.width, config.startY + config.height, config.startX + config.width - config.cornerRadius, config.startY + config.height, config.cornerRadius);
	context.lineTo(config.startX + config.cornerRadius, config.startY + config.height); // Lado inferior do retângulo
	context.arcTo(config.startX, config.startY + config.height, config.startX, config.startY + config.height - config.cornerRadius, config.cornerRadius);
	context.closePath(); // Lado esquerdo do retângulo

	// Configura o estilo da moldura
	context.setLineDash([30, 10]);
	context.lineWidth = config.frameWidth;
	context.strokeStyle = config.frameStyle;
	context.stroke(); // Desenha a moldura

	// Título
	context.font = config.titleSize + "pt " + config.titleFont;
	context.fillStyle = config.titleStyle;
	context.textBaseline = "middle";
	wrapText(context, config.title, config.titleX, config.titleY,  config.width - config.startX - config.frameWidth, 1.5*config.titleSize);

	// Texto
	context.font = config.textSize + "pt " + config.textFont;
	context.fillStyle = config.textStyle;
	context.textBaseline = "middle";
	wrapText(context, config.text, config.textX, config.textY, config.width - config.textX, 1.5*config.textSize);

	return canvas;
}


/*
Nome: wrapText()
Escreve texto com quebra de linha em um Canvas
Parâmetross:
	context: Contexto do canvas
	text: Texto a ser escrito
	posX, posY: Posição inicial (nos eixos X e Y respectivcamente) de onde o texto começará a ser escrito
	lineHeight: Altura das linhas
*/
function wrapText(context, text, posX, posY, maxWidth, lineHeight){
	let lines = text.split("\n"); // Separa todas as linhas delimitadas pelo \n
	for(let i = 0; i < lines.length; i++){
		let words = lines[i].split(" "); // Separa todas as palavras, para compor as linhas com o tamanho correto 
		let line = ""; // Guardará a linha a ser escrita

		for(let j = 0; j < words.length; j++){
			let testLine = line + words[j] + " "; // Cria uma linha de teste com uma palavra a mais do que a anterior
			let testLineWidth = context.measureText(testLine).width; // Calcula o comprimento da linha de teste

			// Se o comprimento da linha de teste for maior que o comprimento máximo escreve a linha atual
			// e escreve a palavra da iteração do laço atual na próxima linha
			if(testLineWidth > maxWidth && j > 0){
				context.fillText(line, posX, posY);
				line = words[j] + " ";
				posY += lineHeight;
			}
			// Se não, passa a linha de teste atual para a próxima iteração do laço, para tentar adicionar
			// mais uma palavra à linha
			else{ line = testLine; }
		}
		context.fillText(line, posX, posY); // Escreve a última linha
		// Pula para a próxima linha (por conta do \n)
		posY += lineHeight;
	}
}