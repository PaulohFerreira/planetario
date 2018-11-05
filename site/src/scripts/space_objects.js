/*
	spaceObjects.js

	Arquivo com as definições dos modelos 3D a serem renderizados
	Parte do Trabalho de Conclusão de Curso para obtenção da Graduação em
	Ciência da Computação pela Universidade Federal de São Paulo - Unifesp
	
	Paulo Henrique da Silva Ferreira
	10/07/2018
*/

var spaceObjects = {
	"sun": {
		scientificInformation: {
			name: "Sol",
	    	diameter: 1391016,
	    	distanceToSun: 0,
	    	orbitalPeriod: 0,
	    	rotationPeriod: 609.12,
	    },

		modelInformation: {
			textureName: "sun.jpg",
			markerPatternName: "sun.patt",
		},
		
		textboxInformation: {
		    startX: 20,
		    startY: 20,
		    width: 400,
		    height: 600,
		    cornerRadius: 20,
		    backgroundStyle: "#c43402",
		    frameStyle: "#ffffb4",
		    frameWidth: 15,
			title: "Sol",
		    titleFont: "Open Sans Semibold",
		    titleStyle: "#FFFFFF",
		    titleX: 50,
		    titleY: 75,
		    titleSize: 60,
		    text: `O Sol é a estrela central do Sistema Solar. Todos os outros corpos do Sistema Solar, como planetas, planetas anões, asteroides, cometas e poeira, bem como todos os satélites associados a estes corpos, giram ao seu redor.

Informações:

Diâmetro:  1.391.400 km
Gravidade:  274,0 m/s²
Período de Rotação:  25 dias, 9 horas e 7 minutos
Temperatura Média:  5.498,85 °C
`,
		    textFont: "Open Sans",
		    textStyle: "#FFFFFF",
		    textX: 50,
		    textY: 150,
		    textSize: 15,
		}
	},

	"mercury": {
		scientificInformation: {
			name: "Mercúrio",
	    	diameter: 4879,
	    	distanceToSun: 57.9, // em 10^6 km
	    	orbitalPeriod: 88.0, // em dias
	    	rotationPeriod: 1407.6, // em horas
	    },

		modelInformation: {
			textureName: "mercury.jpg",
			markerPatternName: "mercury.patt",
		},
		
		textboxInformation: {
		    startX: 20,
		    startY: 20,
		    width: 400,
		    height: 600,
		    cornerRadius: 20,
		    backgroundStyle: "#737373",
		    frameStyle: "#9d9d9d",
		    frameWidth: 15,
			title: "Mercúrio",
		    titleFont: "Open Sans Semibold",
		    titleStyle: "#FFFFFF",
		    titleX: 50,
		    titleY: 75,
		    titleSize: 60,
		    text: `Mercúrio é um dos quatro planetas telúricos (rochosos) do Sistema Solar, sendo o menor e mais interno planeta desse sistema. Possui uma aparência semelhante à da Lua, com crateras de impacto e planícies lisas.

Informações:

Diâmetro:  4.879 km
Gravidade:  3,7 m/s²
Período de Rotação:  58 dias, 15 horas e 36 minutos
Período de Translação: 88 dias
Temperatura Média: 167 °C
Número de Luas:  0
`,
		    textFont: "Open Sans",
		    textStyle: "#FFFFFF",
		    textX: 50,
		    textY: 150,
		    textSize: 15,
		}
	},

	"venus": {
		scientificInformation: {
			name: "Vênus",
	    	diameter: 12104,
	    	distanceToSun: 108.2,
	    	orbitalPeriod: 224.7,
	    	rotationPeriod: -5832.5,
	    },

		modelInformation: {
			textureName: "venus.jpg",
			markerPatternName: "venus.patt",
		},
		
		textboxInformation: {
		    startX: 20,
		    startY: 20,
		    width: 400,
		    height: 600,
		    cornerRadius: 20,
		    backgroundStyle: "#c96e25",
		    frameStyle: "#dc973a",
		    frameWidth: 15,
			title: "Vênus",
		    titleFont: "Open Sans Semibold",
		    titleStyle: "#FFFFFF",
		    titleX: 50,
		    titleY: 75,
		    titleSize: 60,
		    text: `Vénus ou Vênus é o segundo planeta do Sistema Solar em ordem de distância a partir do Sol. Recebeu seu nome em homenagem à deusa romana do amor e da beleza Vénus, equivalente romana a deusa grega Afrodite.

Informações:

Diâmetro:  12.104 km
Gravidade:  8,9 m/s²
Período de Rotação:  116 dias e 18 horas
Período de Translação: 224 dias, 16 horas e 48 minutos
Temperatura Média: 464 °C
Número de Luas:  0
`,
		    textFont: "Open Sans",
		    textStyle: "#FFFFFF",
		    textX: 50,
		    textY: 150,
		    textSize: 15,
		}
	},

 	"earth": {
	    scientificInformation: {
	    	name: "Terra",
	    	diameter: 12756,
	    	distanceToSun: 149.6,
	    	orbitalPeriod: 365.2,
	    	rotationPeriod: 23.9,
	    },

		modelInformation: {
			textureName: "earth.jpg",
			markerPatternName: "earth.patt",
		},
		
		textboxInformation: {
		    startX: 20,
		    startY: 20,
		    width: 400,
		    height: 600,
		    cornerRadius: 20,
		    backgroundStyle: "#0056a2",
		    frameStyle: "#0aa300",
		    frameWidth: 15,
			title: "Terra",
		    titleFont: "Open Sans Semibold",
		    titleStyle: "#FFFFFF",
		    titleX: 50,
		    titleY: 75,
		    titleSize: 60,
		    text: `A Terra é o terceiro planeta mais próximo do Sol, o mais denso e o quinto maior dos oito planetas do Sistema Solar. É também o maior dos quatro planetas telúricos. É por vezes designada como Mundo ou Planeta Azul.

Informações:

Diâmetro:  12.756 km
Gravidade:  9,8 m/s²
Período de Rotação:  23 horas e 54 minutos
Período de Translação:  365 dias, 4 horas e 48 minutos
Temperatura Média:  15 °C
Número de Luas:  1
`,
		    textFont: "Open Sans",
		    textStyle: "#FFFFFF",
		    textX: 50,
		    textY: 150,
		    textSize: 15,
		} 
 	},

 	"mars": {
 		scientificInformation: {
 			name: "Marte",
	    	diameter: 6792,
	    	distanceToSun: 227.9,
	    	orbitalPeriod: 687.0,
	    	rotationPeriod: 24.6,
	    },

		modelInformation: {
			textureName: "mars.jpg",
			markerPatternName: "mars.patt",
		},
		
		textboxInformation: {
		    startX: 20,
		    startY: 20,
		    width: 400,
		    height: 600,
		    cornerRadius: 20,
		    backgroundStyle: "#5e3931",
		    frameStyle: "#db5d34",
		    frameWidth: 15,
			title: "Marte",
		    titleFont: "Open Sans Semibold",
		    titleStyle: "#FFFFFF",
		    titleX: 50,
		    titleY: 75,
		    titleSize: 60,
		    text: `Marte é o quarto planeta a partir do Sol, o segundo menor do Sistema Solar. Batizado em homenagem ao deus romano da guerra, muitas vezes é descrito como o "Planeta Vermelho", porque o óxido de ferro presente em sua superfície lhe dá uma aparência avermelhada.

Informações:

Diâmetro:  6.792 km
Gravidade:  3,7 m/s²
Período de Rotação:  24 horas e 36 minutos
Período de Translação: 1 ano, 10 meses, 2 semanas e 3 dias
Temperatura Média: -65 °C
Número de Luas:  2
`,
		    textFont: "Open Sans",
		    textStyle: "#FFFFFF",
		    textX: 50,
		    textY: 150,
		    textSize: 15,
		}
 	},

 	"jupter": {
 		scientificInformation: {
 			name: "Júpiter",
	    	diameter: 142984,
	    	distanceToSun: 778.6,
	    	orbitalPeriod: 4331.0,
	    	rotationPeriod: 9.9,
	    },

		modelInformation: {
			textureName: "jupiter.jpg",
			markerPatternName: "jupiter.patt",
		},
		
		textboxInformation: {
		    startX: 20,
		    startY: 20,
		    width: 400,
		    height: 600,
		    cornerRadius: 20,
		    backgroundStyle: "#798585",
		    frameStyle: "#c6ae96",
		    frameWidth: 15,
			title: "Júpiter",
		    titleFont: "Open Sans Semibold",
		    titleStyle: "#FFFFFF",
		    titleX: 50,
		    titleY: 75,
		    titleSize: 60,
		    text: `Júpiter é o maior planeta do Sistema Solar, tanto em diâmetro quanto em massa, e é o quinto mais próximo do Sol. Apesar de ser um planeta gasoso, tem 2.5 vezes a massa de todos os outros planetas do Sistema Solar em conjunto.

Informações:

Diâmetro:  142.984 km
Gravidade:  23,1 m/s²
Período de Rotação:  9 horas e 54 minutos
Período de Translação: 11 anos, 10 meses, 1 semana e 4 dias
Temperatura Média: -110 °C
Número de Luas:  79
`,
		    textFont: "Open Sans",
		    textStyle: "#FFFFFF",
		    textX: 50,
		    textY: 150,
		    textSize: 15,
		}
 	},

 	"saturn": {
 		scientificInformation: {
	    	name: "Saturno",
	    	diameter: 120536,
	    	distanceToSun: 1433.5,
	    	orbitalPeriod: 10747.0,
	    	rotationPeriod: 10.7,
	    },

		modelInformation: {
			textureName: "saturn.jpg",
			markerPatternName: "saturn.patt",
		},
		
		textboxInformation: {
		    startX: 20,
		    startY: 20,
		    width: 400,
		    height: 600,
		    cornerRadius: 20,
		    backgroundStyle: "#8c9990",
		    frameStyle: "#ffeacd",
		    frameWidth: 15,
			title: "Saturno",
		    titleFont: "Open Sans Semibold",
		    titleStyle: "#FFFFFF",
		    titleX: 50,
		    titleY: 75,
		    titleSize: 60,
		    text: `Saturno é o sexto planeta a partir do Sol e o segundo maior do Sistema Solar atrás de Júpiter. Seu sistema de anéis planetários é o mais proeminente do Sistema Solar, embora não seja o único planeta com anéis.

Informações:

Diâmetro:  120.536 km
Gravidade:  9,0 m/s²
Período de Rotação:  10 horas e 42 minutos
Período de Translação: 29 anos, 5 meses, 1 semana e 2 dias
Temperatura Média: -140 °C
Número de Luas:  62
`,
		    textFont: "Open Sans",
		    textStyle: "#FFFFFF",
		    textX: 50,
		    textY: 150,
		    textSize: 15,
		}
 	},

 	"uranus": {
 		scientificInformation: {
 			name: "Urano",
	    	diameter: 51118,
	    	distanceToSun: 2872.5,
	    	orbitalPeriod: 30589.0,
	    	rotationPeriod: -17.2,
	    },

		modelInformation: {
			textureName: "uranus.jpg",
			markerPatternName: "uranus.patt",
		},
		
		textboxInformation: {
		    startX: 20,
		    startY: 20,
		    width: 400,
		    height: 600,
		    cornerRadius: 20,
		    backgroundStyle: "#82adb4",
		    frameStyle: "#afe4ea",
		    frameWidth: 15,
			title: "Urano",
		    titleFont: "Open Sans Semibold",
		    titleStyle: "#FFFFFF",
		    titleX: 50,
		    titleY: 75,
		    titleSize: 60,
		    text: `Urano é o sétimo planeta a partir do Sol, o terceiro maior e o quarto mais massivo dos oito planetas do Sistema Solar. Foi nomeado em homenagem ao deus grego do céu, Urano, o pai de Cronos e o avô de Zeus.

Informações:

Diâmetro:  51.118 km
Gravidade:  8,7 m/s²
Período de Rotação:  17 horas e 12 minutos
Período de Translação: 83 anos, 9 meses, 3 semanas e 6 dias
Temperatura Média: -195 °C
Número de Luas:  27
`,
		    textFont: "Open Sans",
		    textStyle: "#FFFFFF",
		    textX: 50,
		    textY: 150,
		    textSize: 15,
		}
 	},

 	"neptune": {
 		scientificInformation: {
 			name: "Netuno",
	    	diameter: 49528,
	    	distanceToSun: 4495.1,
	    	orbitalPeriod: 59800.0,
	    	rotationPeriod: 16.1,
	    },

		modelInformation: {
			textureName: "neptune.jpg",
			markerPatternName: "neptune.patt",
		},
		
		textboxInformation: {
		    startX: 20,
		    startY: 20,
		    width: 400,
		    height: 600,
		    cornerRadius: 20,
		    backgroundStyle: "#2d3484",
		    frameStyle: "#3e7ad0",
		    frameWidth: 15,
			title: "Netuno",
		    titleFont: "Open Sans Semibold",
		    titleStyle: "#FFFFFF",
		    titleX: 50,
		    titleY: 75,
		    titleSize: 60,
		    text: `Netuno ou Neptuno é o oitavo planeta do Sistema Solar, o último a partir do Sol desde a reclassificação de Plutão para a categoria de planeta anão, em 2006.

Informações:

Diâmetro:  49.528 km
Gravidade:  11,0 m/s²
Período de Rotação:  16 horas e 6 minutos
Período de Translação: 163 anos e 10 meses
Temperatura Média: -200 °C
Número de Luas:  14
`,
		    textFont: "Open Sans",
		    textStyle: "#FFFFFF",
		    textX: 50,
		    textY: 150,
		    textSize: 15,
		}
 	}
 }