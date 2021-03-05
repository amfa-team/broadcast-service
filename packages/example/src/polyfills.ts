/* eslint-disable import/no-unassigned-import */

import "whatwg-fetch";
import "abortcontroller-polyfill/dist/polyfill-patch-fetch";
import "webrtc-adapter";
import ResizeObserver from "resize-observer-polyfill";

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}
