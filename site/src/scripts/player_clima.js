/*
	player_clima.js

	Aplicação de Realidade Aumentada na web para apoiar o ensido do Sistema Solar
	Parte do Trabalho de Conclusão de Curso para obtenção da Graduação em
	Ciência da Computação pela Universidade Federal de São Paulo - Unifesp

	OBS: Para utilizar essa aplicação, por favor gere uma chave de API do OpenWeatherMaps,
	e substitua o termo <OpenWeatherMaps API Key> por ela.
	
	Paulo Henrique da Silva Ferreira
	10/07/2018
*/

//#=========================#
//|       CONSTANTES        |
//#=========================#
// Caminho do diretório onde estão todas as texturas que serão utilzadas
const textureDirectoryPath = "./src/images/textures/"; 
// Caminho do diretório onde estão todos os arquivos necessários para o funcionamento da aplicação
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
window.addEventListener("resize", function(){ onResize(); }); // Quando a janela é redimensionada


// O objeto do tipo THREEx.ArToolkitContext é o principal da biblioteca. Ele é o
// responsável por encontrar a posição do marcador na origem das imagens
let arToolkitContext = new THREEx.ArToolkitContext({
	cameraParametersUrl: backendDiretoryPath + "files/camera_para.dat", // Predefinições de câmera
	detectionMode: "mono" // Nessa aplicação os marcadores são monocromáticos, mas também pode-se usar marcadores coloridos
});
arToolkitContext.init(function onCompleted(){
	// Copia a matriz de projeção da câmera da cena 3D para o objeto responsável pelo posicionamento dos marcadores
	camera3D.projectionMatrix.copy(arToolkitContext.getProjectionMatrix()); 
});


//#========================================#
//|       INICIALIZAÇÃO DA APLICAÇÃO       |
//#========================================#
// Aqui fica todo o código relacionado à inicialização de objetos da aplicação

// Grupo que guardará o modelo da Terra
let markerGroup = createARMarkerGroup(
	arToolkitContext,
	scene3D,
	backendDiretoryPath + "files/earth.patt"
);

// Modelo da Terra
let earthModel = create3DSphericalObject(textureDirectoryPath + "earth.jpg");
earthModel.position.y = 0.5;
earthModel.scale.set(3, 3, 3);

// Vincula o modelo ao marcador
markerGroup.add(earthModel);

// Cria meshs com diferentes camadas de informação
let weatherLayers = ["clouds_new", "precipitation_new", "pressure_new", "temp_new", "wind_new"]; // Camadas
let weatherLayerMeshes = []; // Guardará os meshes com as camadas
for(layer in weatherLayers){
	// Cria o mesh com a camada de informação
	weatherLayerMeshes[layer] = new THREE.Mesh(
		new THREE.SphereBufferGeometry(1.08, 32, 32),
		new THREE.MeshBasicMaterial({
			map: new THREE.CanvasTexture(downloadAndConvertWeatherLayer(weatherLayers[layer])),
			transparent: true
		})
	);

	// Vincula o mesh ao modelo do planeta Terra
	earthModel.add(weatherLayerMeshes[layer]);

	// Deixa a camada invisível, já que ela só será visivel se o usuário escolher-la
	weatherLayerMeshes[layer].visible = false;
}

// Tenta captar a posição atual do usuário
if(navigator.geolocation){
	navigator.geolocation.getCurrentPosition(position => {
		// Cria um objeto 3D, semelhante a um alfinete, para mostrar a posição do usuário no mapa
		let pinGroup = new THREE.Group();
		// Agulha do alfinete
		let needleMesh = new THREE.Mesh(
			new THREE.CylinderBufferGeometry(0.005, 0, 0.05, 16, 16),
			new THREE.MeshBasicMaterial({ color: "#AFAFAF" })
		);
		// Cabeça do alfinete
		let headMesh = new THREE.Mesh(
			new THREE.SphereBufferGeometry(0.02, 16, 16),
			new THREE.MeshBasicMaterial({color: "#EE0000"})
		);

		// Adiciona os modelos ao grupo, para que eles se comportem como um único modelo
		pinGroup.add(needleMesh);
		pinGroup.add(headMesh);
		headMesh.position.y = 0.04; // Posiciona a cabeça do alfinete no local correto

		// Determina a posição onde o alfinete deverá ser colocado na esfera
		let latitude = position.coords.latitude
		let longitude = position.coords.longitude;

		// Converte latitude e longitude para coordenadas 3D (para plotar no modelo da Terra)
		let phi = (90 - latitude)*(Math.PI/180);
		let theta = (longitude + 180)*(Math.PI/180);
		let rho = 1; // Raio

		// Coordenadas esféricas para cartesianas
		let x = -rho * Math.sin(phi) * Math.cos(theta);
		let y = rho * Math.cos(phi);
		let z = rho * Math.sin(phi) * Math.sin(theta);

		// Agora, precisamos rotacionar o alfinete para que ele fique posicionado
		// como se estivesse "espetado" na esfera no lugar correto.
		// Para isso, temos que manipular matrizes
		let normal = new THREE.Vector3(x, y, z); // Vetor perpendicular à superfície da esfera no ponto dado
		let up = new THREE.Vector3(0.0, 1.0, 0.0); // Vetor view-up padrão
		
		// Queremos que alfinete esteja apontado na direção do vetor normal à superfície
		// Assim, precisamos determinar um eixo para se rotacionar
		// O produto vetorial não funcionará se normal == +-view-up, então precisamos lidar com um caso especial
		let axis = null;
		if(normal.y === 1 || normal.y === -1) axis = new THREE.Vector3(1.0, 0.0, 0.0);
		else axis = new THREE.Vector3().crossVectors(up, normal).normalize();

		// Descobre o ângulo entre o vetor view-up e o vetor normal
		let radians = Math.acos(normal.dot(up));

		// Cria a matriz de rotação que implementa a rotação
		let matrix = new THREE.Matrix4().makeRotationAxis(axis, radians);

		// Rotaciona e posiciona corretamente o alfinete
		pinGroup.rotation.setFromRotationMatrix(matrix);
		pinGroup.position.set(x, y, z+0.05);
	
		// Adiciona o modelo do alfinete ao modelo da Terra, para que rotações
		// do modelo da Terra também rotacione o alfinete
		earthModel.add(pinGroup);

	});
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
}

// Faz a troca da visualização das camadas com o elemento <select> no HTML
document.getElementById("layerSelector").onchange = ()=>{
	// Torna todas as camadas anteriores invisíveis novamente
	for(layer in weatherLayers){ weatherLayerMeshes[layer].visible = false; }
	// Facilita o acesso ao objeto que vai conter a legenda
	let layerKey = document.getElementById("layerKey");

	// Deixa visível apenas a camada selecionada, junto a sua respectiva legenda
	switch(document.getElementById("layerSelector").value){
		case "clouds_new": // Nuvens
			weatherLayerMeshes[0].visible = true;
			layerKey.src = textureDirectoryPath+"scale_clouds.png";
		break;

		case "precipitation_new": // Precipitação
			weatherLayerMeshes[1].visible = true;
			layerKey.src = textureDirectoryPath+"scale_precipitation.png";
		break; 

		case "pressure_new": // Pressão
			weatherLayerMeshes[2].visible = true;
			layerKey.src = textureDirectoryPath+"scale_pressure.png";
		break;

		case "temp_new": // Temperatura
			weatherLayerMeshes[3].visible = true;
			layerKey.src = textureDirectoryPath+"scale_temperature.png";
		break;

		case "wind_new": // Velocidade do Vento
			weatherLayerMeshes[4].visible = true;
			layerKey.src = textureDirectoryPath+"scale_wind.png";
		break;

		default: // Nenhuma camada
			layerKey.src = "";
		break;
	}
};


// Essa bloco de código é responsável por detectar e reagir a toques na tela, girando o globo terrestre
let touchManager = {
	// Informações necessárias para o funcionamento geral da detecção de toque
	currentMovementState: 0, // 0: Nenhum movimento; 1: Rotação; 2: Zoom 
	// Informações necessárias para a rotação
	lastTouchPosition: new THREE.Vector2(),
	// Informações necessárias para o zoom
	lastPinchDistance: 0,
	lastScale: 1
}
window.addEventListener("touchstart", e => {
	// O número de toques detectado determina o que se deve fazer
	// 1 toque - Rotação do modelo
	// 2 toques - Zoom

	if(e.touches.length == 1){
		touchManager.lastTouchPosition.set(e.touches[0].clientX, e.touches[0].clientY);
		touchManager.currentMovementState = 1;
	}
	// Caso seja detectado 2 toques, significa que queremos dar um zoom no modelo
	else if(e.touches.length == 2){
		// Guarda distância inicial entre os dois toques
		let dx = e.touches[1].clientX - e.touches[0].clientX;
		let dy = e.touches[1].clientY - e.touches[0].clientY;
		touchManager.lastPinchDistance = Math.sqrt(dx*dx + dy*dy);

		// Guarda o fator inicial de escala, que no caso é a escala original no modelo
		touchManager.lastScale = earthModel.scale.x;

		// Indica o tipo de movimento a ser feito para o próximo evento
		touchManager.currentMovementState = 2;
	}
});

window.addEventListener("touchmove", e => {
	// Rotação
	if(markerGroup.visible && touchManager.currentMovementState == 1){
		// Calcula a distância entre o toque anterior e o atual
		let deltaMove = new THREE.Vector2(
			e.touches[0].clientX - touchManager.lastTouchPosition.x,
			e.touches[0].clientY - touchManager.lastTouchPosition.y
		);

		// Calcula o quaternion de rotação
		let deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
			new THREE.Euler(
				(deltaMove.y/4 * (Math.PI/180)),
				(deltaMove.x/4 * (Math.PI/180)),
				0,
				"XYZ"
			)
		);

		// Aplica o quaternion de rotação ao modelo
		earthModel.quaternion.multiply(deltaRotationQuaternion);

		// Atualiza a informação do último toque
		touchManager.lastTouchPosition.x = e.changedTouches[0].clientX;
		touchManager.lastTouchPosition.y = e.changedTouches[0].clientY;
	}
	// Zoom
	else if(markerGroup.visible && touchManager.currentMovementState == 2){
		// Calcula a distância atual entre os dois toques
		let dx = e.touches[0].clientX - e.touches[1].clientX;
		let dy = e.touches[0].clientY - e.touches[1].clientY;
		let actualPinchDistance = Math.sqrt(dx*dx + dy*dy);

		// Tendo a distância entre os dois toques inicial e atual, podemos
		// calcular quanto a distância atual variou em relação à distância inicial.
		// Essa variação é o nosso fator de escala atual
		let actualScaleFactor = actualPinchDistance / touchManager.lastPinchDistance;

		// Aplica a escala atual
		earthModel.scale.set(
			touchManager.lastScale * actualScaleFactor,
			touchManager.lastScale * actualScaleFactor,
			touchManager.lastScale * actualScaleFactor
		);
	}
});

window.addEventListener("touchend", e => {
	// Reseta os tipo do movimento
	touchManager.currentMovementState = 0;
});


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
	let objectGeomety = new THREE.SphereBufferGeometry(1, 32, 32); // Dimensões obtidas com testes para uma boa visualização
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
Nome: downloadAndConvertWeatherLayer()
Baixa uma determinada camada de informação do clima do OpenWeatherMap.com e
converte da projeção Mercator para Equiretangular
- Parâmetros:
	layerName: String com o nome da camada de informação. Varia entre
	"clouds_new" (Nuvens), "precipitation_new" (Chuva e neve(onde possível)), "pressure_new" (Pressão), "temp_new"(Temperatura) e "wind_new"(Velocidade do vento)

- Retorno:
	layerDestiny: Canvas com a imagem da camada já convertida
*/
// 
function downloadAndConvertWeatherLayer(layerName){
	// Canvas que conterá a imagem baixada e possível de ser manipulada
	let layerSource = document.createElement("canvas");
	layerSource.width = 256;
	layerSource.height = 256;
	let layerSourceContext = layerSource.getContext("2d");

	// Canvas que conterá a imagem já modificada
	let layerDestiny = document.createElement("canvas");
	layerDestiny.width = 256;
	layerDestiny.height = 128;
	let layerDestinyContext = layerDestiny.getContext("2d");

	// Faz o download da camada
	let layer = new Image();
	layer.crossOrigin = "Anonymous";
	layer.src = `https://tile.openweathermap.org/map/${layerName}/0/0/0.png?appid=<OpenWeatherMaps API Key>`; // Imagem do OpenWeatherMap
	layer.onload = () => {
		// Inicia o processo de conversão de projeções cartográficas (Mercator -> Equiretangular(wgs84))
		layerSourceContext.drawImage(layer, 0, 0); // Copia a imagem baixada para o canvas, para ser manipulada

		// Retorna uma cópia do vetor de informações da imagem (um vetor com informação de todos os pixels da imagem)
		let sourceImageData = layerSourceContext.getImageData(0, 0, 256, 256);
		let destinyImageData = layerDestinyContext.getImageData(0, 0, 256, 128);

		// Varre o vetor da imagem de destino (a ser usada como textura final)
		for(let x = 0; x < destinyImageData.width; x++){
			for(let y = 0; y < destinyImageData.height; y++){
				// Apesar de representarmos intuitivamente imagens como uma matriz de duas dimensões,
				// o objeto Canvas guarda a imagem como um vetor. Logo, como estamos varrendo a imagem
				// pensando nela como uma matriz, precisamos converter as coordenadas (x, y) do pixel
				// para funcionar com a representação de vetor.
				let destinyPixelOffset = (y * destinyImageData.width + x) * 4; // Cada conjunto de 4 elementos do vetor representa um pixel (R,G,B,A)
				
				// Sabendo o pixel da iteração atual, queremos saber qual pixel da imagem original
				// (na projeção Mercator) é equivalente a esse pixel (na projeção Equiretangular).
				// Usamos fórmulas matemáticas que levam em conta a posição do pixel e os tamamnhos dos mapas de origem e de destino
				let sourcePixel = getSourcePixel(x, y);
				
				// Posição do pixel determinado anteriormente dentro do vetor
				let sourcePixelOffset = (sourcePixel[1] * sourceImageData.width + sourcePixel[0]) * 4; // (R,G,B,A)

				// Copia os pixel do mapa original para o mapa de destino
				destinyImageData.data[destinyPixelOffset] = sourceImageData.data[sourcePixelOffset]; // R
				destinyImageData.data[destinyPixelOffset+1] = sourceImageData.data[sourcePixelOffset+1]; // G
				destinyImageData.data[destinyPixelOffset+2] = sourceImageData.data[sourcePixelOffset+2]; // B
				destinyImageData.data[destinyPixelOffset+3] = sourceImageData.data[sourcePixelOffset+3]; // A
			}
		}

		// Copia a imagem modificada para o canvas de destino
		layerDestinyContext.putImageData(destinyImageData, 0, 0);
	}

	return layerDestiny;
}

/*
Nome: getSourcePixel()
Conhecendo as coordenadas de um pixel na projeção Equiretangular, retorna as coordenadas
do pixel equivalente na projeção Mercator
- Parâmetros:
	sourceX: Posição do pixel na projeção Equiretangular no eixo X
	sourceY: Posição do pixel na projeção Equiretangular no eixo Y

- Retorno:
	[x, y]: Par de coordenadas do pixel na projeção Mercator
*/
function getSourcePixel(sourceX, sourceY){
	// Constantes necessárias relacionadas à dimensão dos mapas
	const wgs84MapWidth = 256;
	const wgs84MapHeight = 128;
	const mercatorMapWidth = 256;
	const mercatorMapHeight = 256;

	// Converte os pixels do WGS84 para Latitude e Longitude
	let latitude = 90 - (180 * sourceY / wgs84MapHeight);
	let longitude = (360 * sourceX / wgs84MapWidth) - 180;

	// Converte Latitude e Longitude para pixels do mercator
	let x = (longitude + 180) * (mercatorMapWidth / 360);
	let mercN = Math.log(Math.tan((Math.PI / 4) + (latitude * Math.PI / 360)));
	let y = (mercatorMapHeight / 2) - (mercatorMapHeight * mercN / (2 * Math.PI)); 

	return [parseInt(x), parseInt(y)];
}