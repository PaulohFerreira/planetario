/*
	player_modelo.js

	Aplicação de Realidade Aumentada na web para apoiar o ensido do Sistema Solar
	Parte do Trabalho de Conclusão de Curso para obtenção da Graduação em
	Ciência da Computação pela Universidade Federal de São Paulo - Unifesp
	
	Paulo Henrique da Silva Ferreira
	18/10/2018
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
document.body.appendChild(threeRenderer.domElement);

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

// Grupo que guardará o modelo do Sistema Solar
let markerGroup = createARMarkerGroup(
	arToolkitContext,
	scene3D,
	backendDiretoryPath + "files/sun.patt"
);

// Cria as linhas de órbita dos planetas
for(let i=0; i<8; i++){
	// Modelo 3D da Órbita
	let orbitModel = new THREE.Mesh(
		new THREE.RingBufferGeometry(0.6 + i*0.3, 0.6 + i*0.3+0.02, 32),
		new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
	);

	// Posiciona o anel corretamente
	orbitModel.rotation.x = Math.PI/2;
	orbitModel.position.y = 0.5;
	
	// Como as linhas de órbita estão no mesmo marcador dos planetas,
	// precisamos indicar que esses modelos não serão rotacionados
	orbitModel.isPlanet = false;

	// Adiciona a linha de órbita criada ao marcador de RA
	markerGroup.add(orbitModel);
}

// Uma vez criadas as linhas de órbita dos planetas, vamos criar os planetas em si
let translationRadiusIncrement = 0; // Guardará o incremento de distâncias entre os planetas, para posiconar os planetas sobre as linhas
for(object in spaceObjects){
	// Modelo 3D
	let model = create3DSphericalObject(textureDirectoryPath + spaceObjects[object].modelInformation.textureName);
	model.position.y = 0.5;

	// Caso o objeto a ser renderizado seja Saturno, devemos criar além do modelo do planeta o modelo do anel. Assim, é necessário um tratamento à parte
	if(object === "saturn"){
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

		// Posiciona corretamente o anel
		ringModel.rotation.x = Math.PI/2;
		ringModel.position.y = 0.5;

		// Adiciona o modelo do anel ao modelo do planeta
		model.add(ringModel);
	}

	// Configura a posição e o tamanho dos planetas
	// Como essa é uma aplicação de visualização apenas, não há uma relação real de tamanho entre os corpos celestes	
	// Se o modelo a ser adicionado for o Sol, deixa ele maior, e aumenta a distância para o posicionamento do
	// próximo planeta (para que ele não seja escondido pelo sol)
	if(object === "sun"){
		model.scale.set(0.2, 0.2, 0.2);
		model.radius = 0; // O Sol não tem raio
		translationRadiusIncrement += 0.6;
	}
	// Se não for o Sol, todos os outros corpos celestes possuem o mesmo tamanho nessa aplicação
	else{
		model.scale.set(0.05, 0.05, 0.05);
		model.position.x = translationRadiusIncrement;

		//let pointInCircle = Math.random() * 2 * Math.PI;
		//model.position.x = distanceIncrement * Math.cos(pointInCircle);
		//model.position.z = distanceIncrement * Math.sin(pointInCircle);

		model.radius = translationRadiusIncrement;
		translationRadiusIncrement += 0.3;
	}

	// Indicamos que é um modelo de planeta, que possui movimento de rotação e translação
	model.isPlanet = true;

	// Guardamos uma referência das informações científicas do planeta real, para podermos usá-las no futuro
	model.scientificInformation = spaceObjects[object].scientificInformation;

	// Vincula o modelo ao grupo à ser mostrado no marcador
	markerGroup.add(model);
}


//#=========================#
//|       ATUALIZAÇÃO       |
//#=========================#
// Aqui fica todo o código referente a atualizações de estado da aplicação
// Essa função é executada uma vez a cada frame
let visibleElapsedTime = 0; // Tempo corrido em que os marcadores estavam visívies
function update(delta){
	// Antes de atualizar as outras coisas, tenta atualizar os objetos da AR.js
	if(arToolkitSource.onReady === false){ return; }
	arToolkitContext.update(arToolkitSource.domElement);

	// Faz os movimentos dos planetas
	if(markerGroup.visible){
		// Atualiza o tempo decorrido com os marcadores visíveis
		visibleElapsedTime += delta;
		for(i in markerGroup.children){
			let model = markerGroup.children[i];

			if(model.isPlanet){
				// Apesar de a aplicação não possuir a escala correta de tamanho entre os planetas, a proporção
				// entre a rotação e a translação entre os planetas está correta.
				// Como todas as informações da ficha técnica da NASA usam unidades da Terra como referência,
				// comparamos os valores dos astros com os da Terra
				let orbitalMovementFactor = model.scientificInformation.orbitalPeriod == 0 ? 0 : visibleElapsedTime * (365 / model.scientificInformation.orbitalPeriod);
				let rotationMovementFactor = visibleElapsedTime * (365 * 24 / model.scientificInformation.rotationPeriod);
				
				// Rotação
				model.rotation.y = rotationMovementFactor;

				// Translação
				model.position.x = Math.cos(orbitalMovementFactor) * model.radius;
				model.position.z = Math.sin(orbitalMovementFactor) * model.radius;
			}
		}
	}
}


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
	// Faz a atualização e a renderização da aplicação nesse frame
	update(clock.getDelta()); // clock.getDelta() irá, nesse caso, retornar o tempo em ms entre cada frame de animação
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