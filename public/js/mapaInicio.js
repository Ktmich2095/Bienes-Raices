/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n    const lat =  20.67444163271174;// ?? se ejecuta cuando el primero es null o undefined\r\n    const lng = -103.38739216304566;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 13);\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa)\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    //JSON (javaScript object notation)\r\n\r\n    const obtenerPropiedades = async () => {\r\n        try {\r\n            const url = '/api/propiedades' \r\n            const respuesta = await fetch(url) \r\n            const propiedades = await respuesta.json()\r\n            mostrarPropiedades(propiedades)\r\n            \r\n            console.log(propiedades)\r\n\r\n        } catch (error) {\r\n            console.log(error)\r\n        }\r\n    }\r\n\r\n    const mostrarPropiedades = propiedades => {\r\n        propiedades.forEach(propiedad => {\r\n            if (propiedad.lat && propiedad.lng) {\r\n                \r\n                const marker = new L.marker([propiedad.lat, propiedad.lng], {\r\n                    autoPan: true,\r\n                })\r\n                    .addTo(mapa)\r\n                    .bindPopup(`\r\n                        <p class=\"text-cyan-600 font-bold\">${propiedad.categoria.nombre}</p>\r\n                        <h1 class=\"text-xl font-extrabold uppercase my-3\">${propiedad?.titulo}</h1>\r\n                        <img src=\"/uploads/${propiedad?.imagen}\" alt=\"Imagen de la propiedad ${propiedad.titulo}\">\r\n                        <p class=\"text-gray-600 font-bold\">${propiedad.precio.precio}</p>\r\n                        <a href=\"/propiedad/${propiedad.id}\" class=\"bg-cyan-600 block p-2 text-center font-bold uppercase\">Ver propiedad</a>\r\n\r\n                        `);\r\n    \r\n                markers.addLayer(marker);\r\n            } else {\r\n                console.warn(\"Propiedad sin coordenadas:\", propiedad);\r\n            }\r\n        });\r\n    };\r\n    \r\n    obtenerPropiedades()\r\n\r\n\r\n})()\n\n//# sourceURL=webpack://bienes-raices/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;