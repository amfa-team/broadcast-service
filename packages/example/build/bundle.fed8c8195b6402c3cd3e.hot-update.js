webpackHotUpdate("bundle",{

/***/ "./src/BroadcastPage.tsx":
/*!*******************************!*\
  !*** ./src/BroadcastPage.tsx ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return BroadcastPage; });\n/* harmony import */ var _amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @amfa-team/picnic-sdk */ \"./node_modules/@amfa-team/picnic-sdk/dist/index.module.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"../../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ \"../../node_modules/react-router-dom/esm/react-router-dom.js\");\n/* harmony import */ var _useApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useApi */ \"./src/useApi.tsx\");\n\n\n\n\nfunction BroadcastPage() {\n  var _useParams = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"useParams\"])(),\n      token = _useParams.token;\n\n  var endpoint = Object(_useApi__WEBPACK_IMPORTED_MODULE_3__[\"useApi\"])().ws;\n  var settings = {\n    endpoint: endpoint,\n    token: token\n  };\n  var state = Object(_amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__[\"useSDK\"])(settings);\n\n  if (!state.loaded) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__[\"Loading\"], null);\n  }\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__[\"StageContainer\"], {\n    sdk: state.sdk,\n    broadcastEnabled: true\n  });\n}\n\n//# sourceURL=webpack:///./src/BroadcastPage.tsx?");

/***/ }),

/***/ "./src/CreateParticipantPage.tsx":
/*!***************************************!*\
  !*** ./src/CreateParticipantPage.tsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return CreateParticipantPage; });\n/* harmony import */ var _amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @amfa-team/picnic-sdk */ \"./node_modules/@amfa-team/picnic-sdk/dist/index.module.js\");\n/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core */ \"./node_modules/@material-ui/core/esm/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"../../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _useApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useApi */ \"./src/useApi.tsx\");\n\n\n\n\nfunction CreateParticipantPage(props) {\n  var _useCreateParticipant = Object(_useApi__WEBPACK_IMPORTED_MODULE_3__[\"useCreateParticipant\"])(),\n      loading = _useCreateParticipant.loading,\n      createParticipant = _useCreateParticipant.createParticipant;\n\n  var role = props.role;\n  Object(react__WEBPACK_IMPORTED_MODULE_2__[\"useEffect\"])(function () {\n    createParticipant(role);\n  }, [role, createParticipant]);\n\n  if (loading) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__[\"Loading\"], null);\n  }\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_1__[\"Typography\"], null, \"Unexpected Error happen; Please reload\");\n}\n\n//# sourceURL=webpack:///./src/CreateParticipantPage.tsx?");

/***/ }),

/***/ "./src/ViewerPage.tsx":
/*!****************************!*\
  !*** ./src/ViewerPage.tsx ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ViewerPage; });\n/* harmony import */ var _amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @amfa-team/picnic-sdk */ \"./node_modules/@amfa-team/picnic-sdk/dist/index.module.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"../../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ \"../../node_modules/react-router-dom/esm/react-router-dom.js\");\n/* harmony import */ var _useApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useApi */ \"./src/useApi.tsx\");\n\n\n\n\nfunction ViewerPage() {\n  var _useParams = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"useParams\"])(),\n      token = _useParams.token;\n\n  var endpoint = Object(_useApi__WEBPACK_IMPORTED_MODULE_3__[\"useApi\"])().ws;\n  var settings = {\n    endpoint: endpoint,\n    token: token\n  };\n  var state = Object(_amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__[\"useSDK\"])(settings);\n\n  if (!state.loaded) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__[\"Loading\"], null);\n  }\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__[\"StageContainer\"], {\n    sdk: state.sdk,\n    broadcastEnabled: false\n  });\n}\n\n//# sourceURL=webpack:///./src/ViewerPage.tsx?");

/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @amfa-team/picnic-sdk */ \"./node_modules/@amfa-team/picnic-sdk/dist/index.module.js\");\n/* harmony import */ var _sentry_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/react */ \"../../node_modules/@sentry/react/esm/index.js\");\n/* harmony import */ var _sentry_tracing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/tracing */ \"../../node_modules/@sentry/tracing/esm/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"../../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-dom */ \"../../node_modules/react-dom/index.js\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ \"../../node_modules/react-router-dom/esm/react-router-dom.js\");\n/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./App */ \"./src/App.tsx\");\n\n\n\n\n\n\n\n\nif (true) {\n  Object(_sentry_react__WEBPACK_IMPORTED_MODULE_1__[\"init\"])({\n    dsn: \"https://4fa79ba1896f420bba7a468048eee137@o443877.ingest.sentry.io/5418207\",\n    integrations: [new _sentry_tracing__WEBPACK_IMPORTED_MODULE_2__[\"Integrations\"].BrowserTracing()],\n    tracesSampleRate:  false ? undefined : 1.0,\n    environment: \"local\"\n  });\n}\n\nreact_dom__WEBPACK_IMPORTED_MODULE_4___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_3___default.a.StrictMode, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_amfa_team_picnic_sdk__WEBPACK_IMPORTED_MODULE_0__[\"ErrorBoundary\"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_5__[\"BrowserRouter\"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_App__WEBPACK_IMPORTED_MODULE_6__[\"default\"], null)))), document.getElementById(\"root\"));\n\n//# sourceURL=webpack:///./src/index.tsx?");

/***/ })

})