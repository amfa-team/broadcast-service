(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/admin/handler.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../types/src/db/participant.ts":
/*!**************************************!*\
  !*** ../types/src/db/participant.ts ***!
  \**************************************/
/*! exports provided: Role, createParticipantDecoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Role\", function() { return Role; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createParticipantDecoder\", function() { return createParticipantDecoder; });\n/* harmony import */ var ts_data_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ts.data.json */ \"ts.data.json\");\n/* harmony import */ var ts_data_json__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ts_data_json__WEBPACK_IMPORTED_MODULE_0__);\n\nvar Role;\n\n(function (Role) {\n  Role[\"host\"] = \"host\";\n  Role[\"guest\"] = \"guest\";\n})(Role || (Role = {}));\n\nconst createParticipantDecoder = ts_data_json__WEBPACK_IMPORTED_MODULE_0__[\"JsonDecoder\"].object({\n  role: ts_data_json__WEBPACK_IMPORTED_MODULE_0__[\"JsonDecoder\"].oneOf(Object.values(Role).map(v => ts_data_json__WEBPACK_IMPORTED_MODULE_0__[\"JsonDecoder\"].isExactly(v)), \"role\")\n}, \"CreateParticipant\");\n\n//# sourceURL=webpack:///../types/src/db/participant.ts?");

/***/ }),

/***/ "../types/src/db/server.ts":
/*!*********************************!*\
  !*** ../types/src/db/server.ts ***!
  \*********************************/
/*! exports provided: createServerDecoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createServerDecoder\", function() { return createServerDecoder; });\n/* harmony import */ var ts_data_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ts.data.json */ \"ts.data.json\");\n/* harmony import */ var ts_data_json__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ts_data_json__WEBPACK_IMPORTED_MODULE_0__);\n\nconst createServerDecoder = ts_data_json__WEBPACK_IMPORTED_MODULE_0__[\"JsonDecoder\"].object({\n  ip: ts_data_json__WEBPACK_IMPORTED_MODULE_0__[\"JsonDecoder\"].string,\n  token: ts_data_json__WEBPACK_IMPORTED_MODULE_0__[\"JsonDecoder\"].string,\n  port: ts_data_json__WEBPACK_IMPORTED_MODULE_0__[\"JsonDecoder\"].number\n}, \"CreateServer\");\n\n//# sourceURL=webpack:///../types/src/db/server.ts?");

/***/ }),

/***/ "./src/admin/handler.ts":
/*!******************************!*\
  !*** ./src/admin/handler.ts ***!
  \******************************/
/*! exports provided: registerParticipant, topology, registerServer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"registerParticipant\", function() { return registerParticipant; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"topology\", function() { return topology; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"registerServer\", function() { return registerServer; });\n/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! source-map-support/register */ \"source-map-support/register\");\n/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(source_map_support_register__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var ts_data_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ts.data.json */ \"ts.data.json\");\n/* harmony import */ var ts_data_json__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ts_data_json__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _types_src_db_participant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../types/src/db/participant */ \"../types/src/db/participant.ts\");\n/* harmony import */ var _types_src_db_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../types/src/db/server */ \"../types/src/db/server.ts\");\n/* harmony import */ var _db_repositories_connectionRepository__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../db/repositories/connectionRepository */ \"./src/db/repositories/connectionRepository.ts\");\n/* harmony import */ var _db_repositories_participantRepository__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../db/repositories/participantRepository */ \"./src/db/repositories/participantRepository.ts\");\n/* harmony import */ var _db_repositories_recvTransportRepository__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../db/repositories/recvTransportRepository */ \"./src/db/repositories/recvTransportRepository.ts\");\n/* harmony import */ var _db_repositories_sendTransportRepository__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../db/repositories/sendTransportRepository */ \"./src/db/repositories/sendTransportRepository.ts\");\n/* harmony import */ var _db_repositories_serverRepository__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../db/repositories/serverRepository */ \"./src/db/repositories/serverRepository.ts\");\n/* harmony import */ var _db_repositories_streamConsumerRepository__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../db/repositories/streamConsumerRepository */ \"./src/db/repositories/streamConsumerRepository.ts\");\n/* harmony import */ var _db_repositories_streamRepository__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../db/repositories/streamRepository */ \"./src/db/repositories/streamRepository.ts\");\n/* harmony import */ var _io_io__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../io/io */ \"./src/io/io.ts\");\n/* harmony import */ var _sfu_serverService__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../sfu/serverService */ \"./src/sfu/serverService.ts\");\n// eslint-disable-next-line import/no-unassigned-import\n\n\n\n\n\n\n\n\n\n\n\n\n\nasync function registerParticipant(event) {\n  try {\n    const {\n      data\n    } = await Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"parseHttpAdminRequest\"])(event, _types_src_db_participant__WEBPACK_IMPORTED_MODULE_2__[\"createParticipantDecoder\"]);\n    const participant = await Object(_db_repositories_participantRepository__WEBPACK_IMPORTED_MODULE_5__[\"createParticipant\"])(data);\n    return Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"handleSuccessResponse\"])(participant);\n  } catch (e) {\n    return Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"handleHttpErrorResponse\"])(e);\n  }\n}\nasync function topology(event) {\n  try {\n    await Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"parseHttpAdminRequest\"])(event, ts_data_json__WEBPACK_IMPORTED_MODULE_1__[\"JsonDecoder\"].isNull(null));\n    const [participants, servers, connections, sendTransports, recvTransports, streams, streamConsumers, serverTopology] = await Promise.all([Object(_db_repositories_participantRepository__WEBPACK_IMPORTED_MODULE_5__[\"getAllParticipants\"])(), Object(_db_repositories_serverRepository__WEBPACK_IMPORTED_MODULE_8__[\"getAllServers\"])(), Object(_db_repositories_connectionRepository__WEBPACK_IMPORTED_MODULE_4__[\"getAllConnections\"])(), Object(_db_repositories_sendTransportRepository__WEBPACK_IMPORTED_MODULE_7__[\"getAllSendTransport\"])(), Object(_db_repositories_recvTransportRepository__WEBPACK_IMPORTED_MODULE_6__[\"getAllRecvTransport\"])(), Object(_db_repositories_streamRepository__WEBPACK_IMPORTED_MODULE_10__[\"getAllStreams\"])(), Object(_db_repositories_streamConsumerRepository__WEBPACK_IMPORTED_MODULE_9__[\"getAllStreamConsumers\"])(), Object(_sfu_serverService__WEBPACK_IMPORTED_MODULE_12__[\"requestServer\"])(\"/topology\").catch(() => null)]);\n    return Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"handleSuccessResponse\"])({\n      db: {\n        participants,\n        servers,\n        connections,\n        sendTransports,\n        recvTransports,\n        streams,\n        streamConsumers\n      },\n      server: serverTopology\n    });\n  } catch (e) {\n    return Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"handleHttpErrorResponse\"])(e);\n  }\n}\nasync function registerServer(event) {\n  try {\n    // TODO: check resources sync\n    const {\n      data\n    } = await Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"parseHttpAdminRequest\"])(event, _types_src_db_server__WEBPACK_IMPORTED_MODULE_3__[\"createServerDecoder\"]);\n    const [existingServer, server] = await Promise.all([Object(_db_repositories_serverRepository__WEBPACK_IMPORTED_MODULE_8__[\"getServer\"])(data), Object(_db_repositories_serverRepository__WEBPACK_IMPORTED_MODULE_8__[\"createServer\"])(data)]); // // TODO: recreate client side properly\n    // // This is to ensure we're able to recover from Server failure restart\n\n    if (existingServer !== null && existingServer.token !== data.token) {\n      console.error(\"Server restarted, trigger client restart\");\n      await Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"broadcastToConnections\"])(JSON.stringify({\n        type: \"cmd\",\n        payload: {\n          fn: \"reload\"\n        }\n      }));\n    }\n\n    return Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"handleSuccessResponse\"])(server);\n  } catch (e) {\n    return Object(_io_io__WEBPACK_IMPORTED_MODULE_11__[\"handleHttpErrorResponse\"])(e);\n  }\n}\n\n//# sourceURL=webpack:///./src/admin/handler.ts?");

/***/ }),

/***/ "./src/db/repositories/connectionRepository.ts":
/*!*****************************************************!*\
  !*** ./src/db/repositories/connectionRepository.ts ***!
  \*****************************************************/
/*! exports provided: createConnection, deleteConnection, getConnection, getConnectionsByToken, getAllConnections, patchConnection, findConnectionByRecvTransportId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createConnection\", function() { return createConnection; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteConnection\", function() { return deleteConnection; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getConnection\", function() { return getConnection; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getConnectionsByToken\", function() { return getConnectionsByToken; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAllConnections\", function() { return getAllConnections; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"patchConnection\", function() { return patchConnection; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"findConnectionByRecvTransportId\", function() { return findConnectionByRecvTransportId; });\n/* harmony import */ var _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../io/exceptions/PicnicError */ \"./src/io/exceptions/PicnicError.ts\");\n/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../schema */ \"./src/db/schema.ts\");\n\n\nasync function createConnection(data) {\n  const connection = new _schema__WEBPACK_IMPORTED_MODULE_1__[\"ConnectionModel\"](data);\n  await connection.save();\n  return connection.toJSON();\n}\nasync function deleteConnection({\n  connectionId\n}) {\n  await _schema__WEBPACK_IMPORTED_MODULE_1__[\"ConnectionModel\"].delete({\n    connectionId\n  });\n}\nasync function getConnection({\n  connectionId\n}) {\n  var _doc$toJSON;\n\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"ConnectionModel\"].get({\n    connectionId\n  }); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n  return (_doc$toJSON = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON !== void 0 ? _doc$toJSON : null;\n}\nasync function getConnectionsByToken({\n  token\n}) {\n  // TODO: Add index to use query instead\n  // TODO: fix typing\n  const results = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"ConnectionModel\"].scan({\n    token: {\n      eq: token\n    }\n  }).exec();\n  return results;\n}\nasync function getAllConnections() {\n  const results = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"ConnectionModel\"].scan().exec();\n  return results;\n}\nasync function patchConnection(params) {\n  const {\n    connectionId,\n    ...rest\n  } = params;\n\n  try {\n    var _doc$toJSON2;\n\n    const doc = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"ConnectionModel\"].update({\n      connectionId\n    }, rest); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n    return (_doc$toJSON2 = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON2 !== void 0 ? _doc$toJSON2 : null;\n  } catch (e) {\n    throw new _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"patchConnection: fail\", e);\n  }\n}\nasync function findConnectionByRecvTransportId(recvTransportId) {\n  try {\n    const results = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"ConnectionModel\"].scan({\n      recvTransportId: {\n        eq: recvTransportId\n      }\n    }).exec();\n    return results;\n  } catch (e) {\n    throw new _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"findConnectionByRecvTransportId: failed\", e);\n  }\n}\n\n//# sourceURL=webpack:///./src/db/repositories/connectionRepository.ts?");

/***/ }),

/***/ "./src/db/repositories/participantRepository.ts":
/*!******************************************************!*\
  !*** ./src/db/repositories/participantRepository.ts ***!
  \******************************************************/
/*! exports provided: createParticipant, getParticipant, getAllParticipants */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createParticipant\", function() { return createParticipant; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getParticipant\", function() { return getParticipant; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAllParticipants\", function() { return getAllParticipants; });\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../schema */ \"./src/db/schema.ts\");\n\n\nasync function createParticipant(params) {\n  const participant = { ...params,\n    token: Object(uuid__WEBPACK_IMPORTED_MODULE_0__[\"v4\"])()\n  };\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"ParticipantModel\"].create(participant);\n  return doc.toJSON();\n}\nasync function getParticipant(token) {\n  var _doc$toJSON;\n\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"ParticipantModel\"].get(token); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n  return (_doc$toJSON = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON !== void 0 ? _doc$toJSON : null;\n}\nasync function getAllParticipants() {\n  const results = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"ParticipantModel\"].scan().exec();\n  return results;\n}\n\n//# sourceURL=webpack:///./src/db/repositories/participantRepository.ts?");

/***/ }),

/***/ "./src/db/repositories/recvTransportRepository.ts":
/*!********************************************************!*\
  !*** ./src/db/repositories/recvTransportRepository.ts ***!
  \********************************************************/
/*! exports provided: createRecvTransport, deleteRecvTransport, getRecvTransport, getAllRecvTransport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createRecvTransport\", function() { return createRecvTransport; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteRecvTransport\", function() { return deleteRecvTransport; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getRecvTransport\", function() { return getRecvTransport; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAllRecvTransport\", function() { return getAllRecvTransport; });\n/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../schema */ \"./src/db/schema.ts\");\n\nasync function createRecvTransport(transport) {\n  await _schema__WEBPACK_IMPORTED_MODULE_0__[\"RecvTransportModel\"].create(transport);\n}\nasync function deleteRecvTransport({\n  transportId\n}) {\n  await _schema__WEBPACK_IMPORTED_MODULE_0__[\"RecvTransportModel\"].delete({\n    transportId\n  });\n}\nasync function getRecvTransport({\n  transportId\n}) {\n  var _doc$toJSON;\n\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_0__[\"RecvTransportModel\"].get({\n    transportId\n  }); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n  return (_doc$toJSON = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON !== void 0 ? _doc$toJSON : null;\n}\nasync function getAllRecvTransport() {\n  const results = await _schema__WEBPACK_IMPORTED_MODULE_0__[\"RecvTransportModel\"].scan().exec();\n  return results;\n}\n\n//# sourceURL=webpack:///./src/db/repositories/recvTransportRepository.ts?");

/***/ }),

/***/ "./src/db/repositories/sendTransportRepository.ts":
/*!********************************************************!*\
  !*** ./src/db/repositories/sendTransportRepository.ts ***!
  \********************************************************/
/*! exports provided: createSendTransport, deleteSendTransport, getSendTransport, patchSendTransport, getAllSendTransport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createSendTransport\", function() { return createSendTransport; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteSendTransport\", function() { return deleteSendTransport; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getSendTransport\", function() { return getSendTransport; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"patchSendTransport\", function() { return patchSendTransport; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAllSendTransport\", function() { return getAllSendTransport; });\n/* harmony import */ var _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../io/exceptions/PicnicError */ \"./src/io/exceptions/PicnicError.ts\");\n/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../schema */ \"./src/db/schema.ts\");\n\n\nasync function createSendTransport(transport) {\n  await _schema__WEBPACK_IMPORTED_MODULE_1__[\"SendTransportModel\"].create(transport);\n}\nasync function deleteSendTransport({\n  transportId\n}) {\n  try {\n    await _schema__WEBPACK_IMPORTED_MODULE_1__[\"SendTransportModel\"].delete({\n      transportId\n    });\n  } catch (e) {\n    throw new _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"deleteSendTransport: failed\", e);\n  }\n}\nasync function getSendTransport({\n  transportId\n}) {\n  var _doc$toJSON;\n\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"SendTransportModel\"].get({\n    transportId\n  }); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n  return (_doc$toJSON = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON !== void 0 ? _doc$toJSON : null;\n}\nasync function patchSendTransport(params) {\n  var _doc$toJSON2;\n\n  const {\n    transportId,\n    ...rest\n  } = params;\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"SendTransportModel\"].update({\n    transportId\n  }, rest); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n  return (_doc$toJSON2 = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON2 !== void 0 ? _doc$toJSON2 : null;\n}\nasync function getAllSendTransport() {\n  const results = await _schema__WEBPACK_IMPORTED_MODULE_1__[\"SendTransportModel\"].scan().exec();\n  return results;\n}\n\n//# sourceURL=webpack:///./src/db/repositories/sendTransportRepository.ts?");

/***/ }),

/***/ "./src/db/repositories/serverRepository.ts":
/*!*************************************************!*\
  !*** ./src/db/repositories/serverRepository.ts ***!
  \*************************************************/
/*! exports provided: createServer, getServer, getAllServers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createServer\", function() { return createServer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getServer\", function() { return getServer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAllServers\", function() { return getAllServers; });\n/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../schema */ \"./src/db/schema.ts\");\n\nasync function createServer(server) {\n  // TODO: Use TTL to detect unexpected die to recover\n  const doc = new _schema__WEBPACK_IMPORTED_MODULE_0__[\"ServerModel\"](server);\n  await doc.save();\n  return doc.toJSON();\n}\nasync function getServer({\n  ip,\n  port\n}) {\n  var _doc$toJSON;\n\n  // TODO: fix dynamoose typescript for number key\n  // eslint-disable-next-line @typescript-eslint/no-explicit-any\n  const key = {\n    ip,\n    port\n  };\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_0__[\"ServerModel\"].get(key); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n  return (_doc$toJSON = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON !== void 0 ? _doc$toJSON : null;\n}\nasync function getAllServers() {\n  const results = await _schema__WEBPACK_IMPORTED_MODULE_0__[\"ServerModel\"].scan().exec();\n  return results;\n}\n\n//# sourceURL=webpack:///./src/db/repositories/serverRepository.ts?");

/***/ }),

/***/ "./src/db/repositories/streamConsumerRepository.ts":
/*!*********************************************************!*\
  !*** ./src/db/repositories/streamConsumerRepository.ts ***!
  \*********************************************************/
/*! exports provided: createStreamConsumer, getAllStreamConsumers, findStreamConsumerByTransportId, findStreamConsumerBySourceTransportId, getStreamConsumer, deleteStreamConsumer, deleteStreamConsumerByTransportId, deleteStreamConsumerBySoourceTransportId, patchStreamConsumer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createStreamConsumer\", function() { return createStreamConsumer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAllStreamConsumers\", function() { return getAllStreamConsumers; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"findStreamConsumerByTransportId\", function() { return findStreamConsumerByTransportId; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"findStreamConsumerBySourceTransportId\", function() { return findStreamConsumerBySourceTransportId; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getStreamConsumer\", function() { return getStreamConsumer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteStreamConsumer\", function() { return deleteStreamConsumer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteStreamConsumerByTransportId\", function() { return deleteStreamConsumerByTransportId; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteStreamConsumerBySoourceTransportId\", function() { return deleteStreamConsumerBySoourceTransportId; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"patchStreamConsumer\", function() { return patchStreamConsumer; });\n/* harmony import */ var _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../io/exceptions/PicnicError */ \"./src/io/exceptions/PicnicError.ts\");\n/* harmony import */ var _io_promises__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../io/promises */ \"./src/io/promises.ts\");\n/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../schema */ \"./src/db/schema.ts\");\nvar _process$env$STREAM_C;\n\n\n\n\nconst INDEX_SOURCE_TRANSPORT = (_process$env$STREAM_C = process.env.STREAM_CONSUMER_TABLE_INDEX_SOURCE_TRANSPORT) !== null && _process$env$STREAM_C !== void 0 ? _process$env$STREAM_C : \"\";\nasync function createStreamConsumer(stream) {\n  try {\n    const doc = await _schema__WEBPACK_IMPORTED_MODULE_2__[\"StreamConsumerModel\"].create(stream);\n    return doc.toJSON();\n  } catch (e) {\n    throw new _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"createStreamConsumer: failed\", e);\n  }\n}\nasync function getAllStreamConsumers() {\n  try {\n    const results = await _schema__WEBPACK_IMPORTED_MODULE_2__[\"StreamConsumerModel\"].scan().exec();\n    return results;\n  } catch (e) {\n    throw new _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"getAllStreamConsumers: failed\", e);\n  }\n}\nasync function findStreamConsumerByTransportId(transportId) {\n  try {\n    const results = await _schema__WEBPACK_IMPORTED_MODULE_2__[\"StreamConsumerModel\"].query({\n      transportId: {\n        eq: transportId\n      }\n    }).exec();\n    return results;\n  } catch (e) {\n    throw new _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"findStreamConsumerByTransportId: failed\", e);\n  }\n}\nasync function findStreamConsumerBySourceTransportId(sourceTransportId) {\n  try {\n    const results = await _schema__WEBPACK_IMPORTED_MODULE_2__[\"StreamConsumerModel\"].query({\n      sourceTransportId: {\n        eq: sourceTransportId\n      }\n    }).using(INDEX_SOURCE_TRANSPORT).exec();\n    return results;\n  } catch (e) {\n    throw new _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"findStreamConsumerBySourceTransportId: failed\", e);\n  }\n}\nasync function getStreamConsumer(transportId, consumerId) {\n  try {\n    var _result$toJSON;\n\n    const result = await _schema__WEBPACK_IMPORTED_MODULE_2__[\"StreamConsumerModel\"].get({\n      transportId,\n      consumerId\n    }); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n    return (_result$toJSON = result === null || result === void 0 ? void 0 : result.toJSON()) !== null && _result$toJSON !== void 0 ? _result$toJSON : null;\n  } catch (e) {\n    throw new _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"getStreamConsumer: failed\", e);\n  }\n}\nasync function deleteStreamConsumer(transportId, consumerId) {\n  try {\n    await _schema__WEBPACK_IMPORTED_MODULE_2__[\"StreamConsumerModel\"].delete({\n      consumerId,\n      transportId\n    });\n  } catch (e) {\n    throw new _io_exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\"deleteStreamConsumer: failed\", e);\n  }\n}\nasync function deleteStreamConsumerByTransportId(transportId) {\n  const items = await findStreamConsumerByTransportId(transportId);\n  const results = await Promise.allSettled(items.map(async item => deleteStreamConsumer(item.transportId, item.consumerId)));\n  Object(_io_promises__WEBPACK_IMPORTED_MODULE_1__[\"getAllSettledValues\"])(results, \"deleteStreamConsumerByTransportId: Unexpected Error\");\n}\nasync function deleteStreamConsumerBySoourceTransportId(sourceTransportId) {\n  const items = await findStreamConsumerBySourceTransportId(sourceTransportId);\n  const results = await Promise.allSettled(items.map(async item => deleteStreamConsumer(item.transportId, item.consumerId)));\n  Object(_io_promises__WEBPACK_IMPORTED_MODULE_1__[\"getAllSettledValues\"])(results, \"deleteStreamConsumerBySoourceTransportId: Unexpected Error\");\n}\nasync function patchStreamConsumer(params) {\n  var _doc$toJSON;\n\n  const {\n    transportId,\n    consumerId,\n    ...rest\n  } = params;\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_2__[\"StreamConsumerModel\"].update({\n    transportId,\n    consumerId\n  }, rest); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n  return (_doc$toJSON = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON !== void 0 ? _doc$toJSON : null;\n}\n\n//# sourceURL=webpack:///./src/db/repositories/streamConsumerRepository.ts?");

/***/ }),

/***/ "./src/db/repositories/streamRepository.ts":
/*!*************************************************!*\
  !*** ./src/db/repositories/streamRepository.ts ***!
  \*************************************************/
/*! exports provided: createStream, deleteStream, getStream, findStreamByTransportId, deleteStreamByTransportId, getAllStreams, patchStream */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createStream\", function() { return createStream; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteStream\", function() { return deleteStream; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getStream\", function() { return getStream; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"findStreamByTransportId\", function() { return findStreamByTransportId; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteStreamByTransportId\", function() { return deleteStreamByTransportId; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAllStreams\", function() { return getAllStreams; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"patchStream\", function() { return patchStream; });\n/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../schema */ \"./src/db/schema.ts\");\n\nasync function createStream(stream) {\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_0__[\"StreamModel\"].create(stream);\n  return doc.toJSON();\n}\nasync function deleteStream(transportId, producerId) {\n  await _schema__WEBPACK_IMPORTED_MODULE_0__[\"StreamModel\"].delete({\n    transportId,\n    producerId\n  });\n}\nasync function getStream(transportId, producerId) {\n  var _doc$toJSON;\n\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_0__[\"StreamModel\"].get({\n    transportId,\n    producerId\n  }); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n  return (_doc$toJSON = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON !== void 0 ? _doc$toJSON : null;\n}\nasync function findStreamByTransportId(transportId) {\n  const results = await _schema__WEBPACK_IMPORTED_MODULE_0__[\"StreamModel\"].scan({\n    transportId: {\n      eq: transportId\n    }\n  }).exec();\n  return results;\n}\nasync function deleteStreamByTransportId(transportId) {\n  const items = await findStreamByTransportId(transportId);\n  await Promise.all(items.map(async item => deleteStream(item.transportId, item.producerId)));\n}\nasync function getAllStreams() {\n  const results = await _schema__WEBPACK_IMPORTED_MODULE_0__[\"StreamModel\"].scan().exec();\n  return results;\n}\nasync function patchStream(params) {\n  var _doc$toJSON2;\n\n  const {\n    transportId,\n    producerId,\n    ...rest\n  } = params;\n  const doc = await _schema__WEBPACK_IMPORTED_MODULE_0__[\"StreamModel\"].update({\n    transportId,\n    producerId\n  }, rest); // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition\n\n  return (_doc$toJSON2 = doc === null || doc === void 0 ? void 0 : doc.toJSON()) !== null && _doc$toJSON2 !== void 0 ? _doc$toJSON2 : null;\n}\n\n//# sourceURL=webpack:///./src/db/repositories/streamRepository.ts?");

/***/ }),

/***/ "./src/db/schema.ts":
/*!**************************!*\
  !*** ./src/db/schema.ts ***!
  \**************************/
/*! exports provided: serverSchema, ServerModel, participantSchema, ParticipantModel, connectionSchema, ConnectionModel, recvTransportSchema, RecvTransportModel, sendTransportSchema, SendTransportModel, streamSchema, StreamModel, streamConsumerSchema, StreamConsumerModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"serverSchema\", function() { return serverSchema; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ServerModel\", function() { return ServerModel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"participantSchema\", function() { return participantSchema; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ParticipantModel\", function() { return ParticipantModel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"connectionSchema\", function() { return connectionSchema; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ConnectionModel\", function() { return ConnectionModel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"recvTransportSchema\", function() { return recvTransportSchema; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RecvTransportModel\", function() { return RecvTransportModel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sendTransportSchema\", function() { return sendTransportSchema; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SendTransportModel\", function() { return SendTransportModel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"streamSchema\", function() { return streamSchema; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StreamModel\", function() { return StreamModel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"streamConsumerSchema\", function() { return streamConsumerSchema; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StreamConsumerModel\", function() { return StreamConsumerModel; });\n/* harmony import */ var dynamoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dynamoose */ \"dynamoose\");\n/* harmony import */ var dynamoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dynamoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _types_src_db_participant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../types/src/db/participant */ \"../types/src/db/participant.ts\");\nvar _process$env$STREAM_C, _process$env$SERVER_T, _process$env$PARTICIP, _process$env$CONNECTI, _process$env$RECV_TRA, _process$env$SEND_TRA, _process$env$STREAM_T, _process$env$STREAM_C2;\n\n\n // Depends on serverless-offline plugin which adds IS_OFFLINE to process.env when running offline\n\nif (process.env.IS_OFFLINE) {\n  dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"aws\"].ddb.local(\"http://localhost:9005\");\n}\n\nconst INDEX_SOURCE_TRANSPORT = (_process$env$STREAM_C = process.env.STREAM_CONSUMER_TABLE_INDEX_SOURCE_TRANSPORT) !== null && _process$env$STREAM_C !== void 0 ? _process$env$STREAM_C : \"\";\nconst serverSchema = new dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  ip: {\n    type: String,\n    required: true,\n    hashKey: true\n  },\n  port: {\n    type: Number,\n    required: true,\n    rangeKey: true\n  },\n  token: {\n    type: String,\n    required: true\n  }\n});\nconst ServerModel = Object(dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"model\"])((_process$env$SERVER_T = process.env.SERVER_TABLE) !== null && _process$env$SERVER_T !== void 0 ? _process$env$SERVER_T : \"\", serverSchema);\nconst participantSchema = new dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  token: {\n    type: String,\n    required: true,\n    hashKey: true\n  },\n  role: {\n    type: String,\n    required: true,\n    enum: [_types_src_db_participant__WEBPACK_IMPORTED_MODULE_1__[\"Role\"].host, _types_src_db_participant__WEBPACK_IMPORTED_MODULE_1__[\"Role\"].guest]\n  }\n});\nconst ParticipantModel = Object(dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"model\"])((_process$env$PARTICIP = process.env.PARTICIPANT_TABLE) !== null && _process$env$PARTICIP !== void 0 ? _process$env$PARTICIP : \"\", participantSchema);\nconst connectionSchema = new dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  connectionId: {\n    type: String,\n    required: true,\n    hashKey: true\n  },\n  token: {\n    type: String,\n    required: true\n  },\n  sendTransportId: {\n    type: String,\n    required: false\n  },\n  recvTransportId: {\n    type: String,\n    required: false\n  }\n});\nconst ConnectionModel = Object(dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"model\"])((_process$env$CONNECTI = process.env.CONNECTION_TABLE) !== null && _process$env$CONNECTI !== void 0 ? _process$env$CONNECTI : \"\", connectionSchema);\nconst recvTransportSchema = new dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  transportId: {\n    type: String,\n    required: true,\n    hashKey: true\n  }\n});\nconst RecvTransportModel = Object(dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"model\"])((_process$env$RECV_TRA = process.env.RECV_TRANSPORT_TABLE) !== null && _process$env$RECV_TRA !== void 0 ? _process$env$RECV_TRA : \"\", recvTransportSchema);\nconst sendTransportSchema = new dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  transportId: {\n    type: String,\n    required: true,\n    hashKey: true\n  },\n  audioTrack: {\n    type: String,\n    required: false\n  },\n  videoTrack: {\n    type: String,\n    required: false\n  }\n});\nconst SendTransportModel = Object(dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"model\"])((_process$env$SEND_TRA = process.env.SEND_TRANSPORT_TABLE) !== null && _process$env$SEND_TRA !== void 0 ? _process$env$SEND_TRA : \"\", sendTransportSchema);\nconst streamSchema = new dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  transportId: {\n    type: String,\n    required: true,\n    hashKey: true\n  },\n  producerId: {\n    type: String,\n    required: true,\n    rangeKey: true\n  },\n  kind: {\n    type: String,\n    required: true,\n    enum: [\"audio\", \"video\"]\n  },\n  score: {\n    type: Number,\n    required: true\n  }\n});\nconst StreamModel = Object(dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"model\"])((_process$env$STREAM_T = process.env.STREAM_TABLE) !== null && _process$env$STREAM_T !== void 0 ? _process$env$STREAM_T : \"\", streamSchema);\nconst streamConsumerSchema = new dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"Schema\"]({\n  transportId: {\n    type: String,\n    required: true,\n    hashKey: true\n  },\n  consumerId: {\n    type: String,\n    required: true,\n    rangeKey: true\n  },\n  sourceTransportId: {\n    type: String,\n    required: true,\n    index: {\n      name: INDEX_SOURCE_TRANSPORT,\n      global: true,\n      project: true\n    }\n  },\n  producerId: {\n    type: String,\n    required: true\n  },\n  score: {\n    type: Number,\n    required: true\n  },\n  producerScore: {\n    type: Number,\n    required: true\n  }\n});\nconst StreamConsumerModel = Object(dynamoose__WEBPACK_IMPORTED_MODULE_0__[\"model\"])((_process$env$STREAM_C2 = process.env.STREAM_CONSUMER_TABLE) !== null && _process$env$STREAM_C2 !== void 0 ? _process$env$STREAM_C2 : \"\", streamConsumerSchema);\n\n//# sourceURL=webpack:///./src/db/schema.ts?");

/***/ }),

/***/ "./src/io/exceptions/ForbiddenError.ts":
/*!*********************************************!*\
  !*** ./src/io/exceptions/ForbiddenError.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ForbiddenError; });\n/* harmony import */ var _InvalidRequestError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./InvalidRequestError */ \"./src/io/exceptions/InvalidRequestError.ts\");\n\nclass ForbiddenError extends _InvalidRequestError__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor() {\n    super(\"Forbidden\", 403);\n  }\n\n}\n\n//# sourceURL=webpack:///./src/io/exceptions/ForbiddenError.ts?");

/***/ }),

/***/ "./src/io/exceptions/InvalidRequestError.ts":
/*!**************************************************!*\
  !*** ./src/io/exceptions/InvalidRequestError.ts ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return InvalidRequestError; });\nclass InvalidRequestError extends Error {\n  constructor(message = \"invalid request\", code = 400) {\n    super(message);\n    this.code = code;\n  }\n\n}\n\n//# sourceURL=webpack:///./src/io/exceptions/InvalidRequestError.ts?");

/***/ }),

/***/ "./src/io/exceptions/PicnicError.ts":
/*!******************************************!*\
  !*** ./src/io/exceptions/PicnicError.ts ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return PicnicError; });\nclass PicnicError extends Error {\n  constructor(message, cause) {\n    super(message);\n    this.cause = cause;\n\n    if (true) {\n      console.error(\"PicnicError\", message, cause);\n    }\n  }\n\n}\n\n//# sourceURL=webpack:///./src/io/exceptions/PicnicError.ts?");

/***/ }),

/***/ "./src/io/io.ts":
/*!**********************!*\
  !*** ./src/io/io.ts ***!
  \**********************/
/*! exports provided: wsOnlyRoute, parse, parseHttpParticipantRequest, parseHttpAdminRequest, parseWsParticipantRequest, handleHttpErrorResponse, handleSuccessResponse, postToConnection, broadcastToConnections, handleWebSocketSuccessResponse, handleWebSocketErrorResponse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"wsOnlyRoute\", function() { return wsOnlyRoute; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"parse\", function() { return parse; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"parseHttpParticipantRequest\", function() { return parseHttpParticipantRequest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"parseHttpAdminRequest\", function() { return parseHttpAdminRequest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"parseWsParticipantRequest\", function() { return parseWsParticipantRequest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"handleHttpErrorResponse\", function() { return handleHttpErrorResponse; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"handleSuccessResponse\", function() { return handleSuccessResponse; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"postToConnection\", function() { return postToConnection; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"broadcastToConnections\", function() { return broadcastToConnections; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"handleWebSocketSuccessResponse\", function() { return handleWebSocketSuccessResponse; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"handleWebSocketErrorResponse\", function() { return handleWebSocketErrorResponse; });\n/* harmony import */ var _sentry_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/node */ \"@sentry/node\");\n/* harmony import */ var _sentry_node__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sentry_node__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var ts_data_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ts.data.json */ \"ts.data.json\");\n/* harmony import */ var ts_data_json__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ts_data_json__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _db_repositories_connectionRepository__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../db/repositories/connectionRepository */ \"./src/db/repositories/connectionRepository.ts\");\n/* harmony import */ var _security_security__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../security/security */ \"./src/security/security.ts\");\n/* harmony import */ var _exceptions_InvalidRequestError__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./exceptions/InvalidRequestError */ \"./src/io/exceptions/InvalidRequestError.ts\");\n/* harmony import */ var _promises__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./promises */ \"./src/io/promises.ts\");\nvar _process$env$WEBSOCKE;\n\n\n\n\n\n\n\n\nconst DOMAIN_NAME = (_process$env$WEBSOCKE = process.env.WEBSOCKET_DOMAIN) !== null && _process$env$WEBSOCKE !== void 0 ? _process$env$WEBSOCKE : \"\";\n\nif (process.env.SENTRY_ENVIRONMENT !== \"dev\") {\n  Object(_sentry_node__WEBPACK_IMPORTED_MODULE_0__[\"init\"])({\n    dsn: process.env.SENTRY_DNS,\n    environment: process.env.SENTRY_ENVIRONMENT\n  });\n}\n\nconst apigwManagementApi = new aws_sdk__WEBPACK_IMPORTED_MODULE_1__[\"ApiGatewayManagementApi\"](process.env.IS_OFFLINE ? {\n  apiVersion: \"2018-11-29\",\n  endpoint: `http://localhost:3001`\n} : {\n  apiVersion: \"2018-11-29\",\n  endpoint: `${DOMAIN_NAME}`\n});\nfunction wsOnlyRoute(event) {\n  const {\n    connectionId\n  } = event.requestContext;\n\n  if (!connectionId) {\n    throw new Error(`Route: Require websocket connection`);\n  }\n\n  return connectionId;\n}\nfunction parse(body) {\n  try {\n    return body === null ? body : JSON.parse(body);\n  } catch (e) {\n    throw new _exceptions_InvalidRequestError__WEBPACK_IMPORTED_MODULE_5__[\"default\"](`Unable to parse body: ${e.message}`);\n  }\n}\n\nfunction decode(data, decoder) {\n  const result = decoder.decode(data);\n\n  if (!result.isOk()) {\n    throw new _exceptions_InvalidRequestError__WEBPACK_IMPORTED_MODULE_5__[\"default\"](result.error);\n  }\n\n  return result.value;\n}\n\nfunction parseWsRequest(event, decoder) {\n  const body = parse(event.body);\n  const requestDecoder = ts_data_json__WEBPACK_IMPORTED_MODULE_2__[\"JsonDecoder\"].object({\n    token: ts_data_json__WEBPACK_IMPORTED_MODULE_2__[\"JsonDecoder\"].string,\n    data: decoder,\n    msgId: ts_data_json__WEBPACK_IMPORTED_MODULE_2__[\"JsonDecoder\"].string\n  }, \"WebSocketRequest\");\n  return decode(body, requestDecoder);\n}\n\nfunction parseHttpRequest(event, decoder) {\n  const token = event.headers[\"x-api-key\"];\n\n  if (!token) {\n    throw new _exceptions_InvalidRequestError__WEBPACK_IMPORTED_MODULE_5__[\"default\"](\"Missing x-api-key header\");\n  }\n\n  const body = parse(event.body);\n  return {\n    token,\n    data: decode(body, decoder)\n  };\n}\n\nasync function parseHttpParticipantRequest(event, roles, decoder) {\n  const result = parseHttpRequest(event, decoder);\n  const participant = await Object(_security_security__WEBPACK_IMPORTED_MODULE_4__[\"authParticipant\"])(result, roles);\n  return { ...result,\n    participant\n  };\n}\nasync function parseHttpAdminRequest(event, decoder) {\n  const result = parseHttpRequest(event, decoder);\n  await Object(_security_security__WEBPACK_IMPORTED_MODULE_4__[\"authAdmin\"])(result);\n  return result;\n}\nasync function parseWsParticipantRequest(event, roles, decoder) {\n  const result = parseWsRequest(event, decoder);\n  const participant = await Object(_security_security__WEBPACK_IMPORTED_MODULE_4__[\"authParticipant\"])(result, roles);\n  return { ...result,\n    participant\n  };\n}\nasync function handleHttpErrorResponse(e, msgId = null) {\n  if (e instanceof _exceptions_InvalidRequestError__WEBPACK_IMPORTED_MODULE_5__[\"default\"]) {\n    return {\n      statusCode: e.code,\n      body: JSON.stringify({\n        success: false,\n        error: e.message,\n        msgId\n      })\n    };\n  }\n\n  console.error(e);\n  Object(_sentry_node__WEBPACK_IMPORTED_MODULE_0__[\"captureException\"])(e);\n  await Object(_sentry_node__WEBPACK_IMPORTED_MODULE_0__[\"flush\"])(2000).catch(() => {\n    console.error(\"io.handleHttpErrorResponse: fail to flush errors\");\n  });\n  return {\n    statusCode: 500,\n    body: JSON.stringify({\n      success: false,\n      error: \"Unexpected Server error\"\n    })\n  };\n}\nfunction handleSuccessResponse(data, msgId = null) {\n  return {\n    statusCode: 200,\n    headers: {\n      \"Access-Control-Allow-Origin\": \"*\"\n    },\n    body: JSON.stringify({\n      type: \"response\",\n      success: true,\n      payload: data,\n      msgId\n    })\n  };\n}\nasync function postToConnection(connectionId, data) {\n  try {\n    await apigwManagementApi.postToConnection({\n      ConnectionId: connectionId,\n      Data: data\n    }).promise();\n  } catch (e) {\n    // 410 Gone error\n    // https://medium.com/@lancers/websocket-api-what-does-it-mean-that-disconnect-is-a-best-effort-event-317b7021456f\n    if (typeof e === \"object\" && (e === null || e === void 0 ? void 0 : e.statusCode) === 410) {\n      console.warn(\"io.postToConnection: client gone\", connectionId);\n    } else {\n      throw e;\n    }\n  }\n}\nasync function broadcastToConnections(data) {\n  const connections = await Object(_db_repositories_connectionRepository__WEBPACK_IMPORTED_MODULE_3__[\"getAllConnections\"])();\n  const results = await Promise.allSettled(connections.map(async c => postToConnection(c.connectionId, data)));\n  Object(_promises__WEBPACK_IMPORTED_MODULE_6__[\"getAllSettledValues\"])(results, \"broadcastToConnections: Unexpected Error\");\n}\nasync function handleWebSocketSuccessResponse(connectionId, msgId, data) {\n  const result = handleSuccessResponse(data, msgId); // Lambda response is sent through WebSocket in Api Gateway but not in serverless offline\n  // https://github.com/dherault/serverless-offline/issues/1008\n\n  if (process.env.IS_OFFLINE) {\n    await postToConnection(connectionId, result.body);\n  }\n\n  return result;\n}\nasync function handleWebSocketErrorResponse(connectionId, msgId, e) {\n  const result = await handleHttpErrorResponse(e, msgId); // Lambda response is sent through WebSocket in Api Gateway but not in serverless offline\n  // https://github.com/dherault/serverless-offline/issues/1008\n\n  if (process.env.IS_OFFLINE) {\n    await postToConnection(connectionId, result.body);\n  }\n\n  return result;\n}\n\n//# sourceURL=webpack:///./src/io/io.ts?");

/***/ }),

/***/ "./src/io/promises.ts":
/*!****************************!*\
  !*** ./src/io/promises.ts ***!
  \****************************/
/*! exports provided: getAllSettledValues */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAllSettledValues\", function() { return getAllSettledValues; });\n/* harmony import */ var _sentry_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/node */ \"@sentry/node\");\n/* harmony import */ var _sentry_node__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sentry_node__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exceptions/PicnicError */ \"./src/io/exceptions/PicnicError.ts\");\n\n\nfunction getAllSettledValues(results, errorMessage) {\n  const errorIndexes = [];\n  const values = [];\n\n  for (let i = 0; i < results.length; i += 1) {\n    const result = results[i];\n\n    if (result.status === \"fulfilled\") {\n      values.push(result.value);\n    } else {\n      Object(_sentry_node__WEBPACK_IMPORTED_MODULE_0__[\"captureException\"])(result.reason);\n      errorIndexes.push(i);\n    }\n  }\n\n  if (errorIndexes.length > 0) {\n    throw new _exceptions_PicnicError__WEBPACK_IMPORTED_MODULE_1__[\"default\"](`${errorMessage} at indexes [${errorIndexes.join(\", \")}]`, null);\n  }\n\n  return values;\n}\n\n//# sourceURL=webpack:///./src/io/promises.ts?");

/***/ }),

/***/ "./src/security/security.ts":
/*!**********************************!*\
  !*** ./src/security/security.ts ***!
  \**********************************/
/*! exports provided: authAdmin, authParticipant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"authAdmin\", function() { return authAdmin; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"authParticipant\", function() { return authParticipant; });\n/* harmony import */ var _db_repositories_participantRepository__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../db/repositories/participantRepository */ \"./src/db/repositories/participantRepository.ts\");\n/* harmony import */ var _io_exceptions_ForbiddenError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../io/exceptions/ForbiddenError */ \"./src/io/exceptions/ForbiddenError.ts\");\n\n\nfunction authAdmin({\n  token\n}) {\n  if (!process.env.SECRET) {\n    throw new Error(\"Missing SECRET env-vars\");\n  }\n\n  if (token !== process.env.SECRET) {\n    throw new Error(\"Someone is trying to access admin\");\n  }\n}\nasync function authParticipant({\n  token\n}, roles) {\n  const participant = await Object(_db_repositories_participantRepository__WEBPACK_IMPORTED_MODULE_0__[\"getParticipant\"])(token);\n\n  if (participant == null) {\n    throw new _io_exceptions_ForbiddenError__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\n  }\n\n  if (!roles.includes(participant.role)) {\n    throw new _io_exceptions_ForbiddenError__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\n  }\n\n  return participant;\n}\n\n//# sourceURL=webpack:///./src/security/security.ts?");

/***/ }),

/***/ "./src/sfu/serverService.ts":
/*!**********************************!*\
  !*** ./src/sfu/serverService.ts ***!
  \**********************************/
/*! exports provided: requestServer, postToServer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"requestServer\", function() { return requestServer; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"postToServer\", function() { return postToServer; });\n/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node-fetch */ \"node-fetch\");\n/* harmony import */ var node_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fetch__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _db_repositories_serverRepository__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../db/repositories/serverRepository */ \"./src/db/repositories/serverRepository.ts\");\n\n\n\nasync function getDestServer() {\n  const servers = await Object(_db_repositories_serverRepository__WEBPACK_IMPORTED_MODULE_1__[\"getAllServers\"])();\n\n  if (servers.length === 0) {\n    throw new Error(\"No registered server\");\n  }\n\n  return servers[0];\n}\n\nasync function requestServer(path, options = null) {\n  var _options$headers;\n\n  const server = await getDestServer();\n  const res = await node_fetch__WEBPACK_IMPORTED_MODULE_0___default()(`http://${server.ip}:${server.port}${path}`, { ...options,\n    headers: { ...((_options$headers = options === null || options === void 0 ? void 0 : options.headers) !== null && _options$headers !== void 0 ? _options$headers : null),\n      \"x-api-key\": server.token\n    }\n  });\n\n  if (!res.ok) {\n    const err = await res.json().then(body => body.error).catch(() => \"Unknown SFU error\");\n    throw new Error(`requestSFU: fail with ${err}`);\n  }\n\n  const body = await res.json();\n\n  if (!body.success) {\n    throw new Error(`requestSFU: fail with ${body.error}`);\n  }\n\n  return body.payload;\n}\nasync function postToServer(path, data) {\n  const options = {\n    method: \"POST\",\n    headers: {\n      \"content-type\": \"application/json\"\n    },\n    body: JSON.stringify(data)\n  };\n  return requestServer(path, options);\n}\n\n//# sourceURL=webpack:///./src/sfu/serverService.ts?");

/***/ }),

/***/ "@sentry/node":
/*!*******************************!*\
  !*** external "@sentry/node" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@sentry/node\");\n\n//# sourceURL=webpack:///external_%22@sentry/node%22?");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"aws-sdk\");\n\n//# sourceURL=webpack:///external_%22aws-sdk%22?");

/***/ }),

/***/ "dynamoose":
/*!****************************!*\
  !*** external "dynamoose" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dynamoose\");\n\n//# sourceURL=webpack:///external_%22dynamoose%22?");

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-fetch\");\n\n//# sourceURL=webpack:///external_%22node-fetch%22?");

/***/ }),

/***/ "source-map-support/register":
/*!**********************************************!*\
  !*** external "source-map-support/register" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/register\");\n\n//# sourceURL=webpack:///external_%22source-map-support/register%22?");

/***/ }),

/***/ "ts.data.json":
/*!*******************************!*\
  !*** external "ts.data.json" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"ts.data.json\");\n\n//# sourceURL=webpack:///external_%22ts.data.json%22?");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");\n\n//# sourceURL=webpack:///external_%22uuid%22?");

/***/ })

/******/ })));