"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unity = void 0;
var react_1 = require("react");
var react_2 = require("react");
var use_unity_instance_1 = require("../hooks/use-unity-instance");
var use_unity_loader_1 = require("../hooks/use-unity-loader");
var generate_unity_instance_parameters_1 = require("../utils/generate-unity-instance-parameters");
/**
 * A unique instance identifier for each mounted Unity Instance.
 */
var unityInstanceIdentifier = 0;
/**
 * Renders the Unity Instance to the React DOM.
 * @param props Properties of the Unity Component.
 * @returns A React Element.
 */
function Unity(props) {
    var htmlCanvasElement = react_2.useRef(null);
    var unityContext = react_2.useState(props.unityContext)[0];
    var unityInstanceParameters = generate_unity_instance_parameters_1.generateUnityInstanceParameters(unityContext, props);
    // The Unity Loader is required for the unity instance to be created.
    var unityLoaderStatus = use_unity_loader_1.useUnityLoader(unityContext.unityConfig.loaderUrl);
    // Creates the Unity Instance while defining a set of hooks which indicate
    // whether the Unity Instance is ready to be used among with its progression.
    var _a = use_unity_instance_1.useUnityInstance(unityLoaderStatus, htmlCanvasElement.current, unityInstanceParameters), unityInstance = _a.unityInstance, progression = _a.progression, error = _a.error;
    // Effect hook will be called when the Unity instance changes.
    react_2.useEffect(function () {
        // If the Unity Instance has been defined, it will be passed to the
        // Unity Context.
        if (unityInstance !== null) {
            unityContext.unityInstance = unityInstance;
        }
    }, [unityInstance]);
    // Effect hook will be called when the reference to the canvas changes.
    react_2.useEffect(function () {
        // Whether or not the canvas has been defined, it will be set as the
        // current html canvas element on the Unity Context.
        unityContext.htmlCanvasElement = htmlCanvasElement.current;
        // Only when it is defined, an event will be dispatched.
        if (unityContext.htmlCanvasElement !== null) {
            unityContext.dispatchEvent("canvas", htmlCanvasElement.current);
        }
    }, [htmlCanvasElement]);
    // Effect hook will be called when the Unity Instance progession changes.
    react_2.useEffect(function () {
        // If the Unity Instance loading progression hits 1, then the Unity
        // Instance is ready to be used and the loaded event is dispatched.
        if (progression === 1) {
            unityContext.dispatchEvent("loaded");
        }
        // Dispatches an event every time the Unity Instance progression changes.
        unityContext.dispatchEvent("progress", progression);
    }, [progression]);
    // Effect hook will be called when the Unity Instance threw an error.
    react_2.useEffect(function () {
        // If the Unity Instance threw an error, then the error event is
        // dispatched.
        if (error !== null) {
            unityContext.dispatchEvent("error", error);
        }
    }, [error]);
    // Event hook will be called when the component mounts and unmounts.
    react_2.useEffect(function () {
        // Each time a component is mounted, the Unity Context identifier is
        // incremented to ensure that each component is referenced correctly.
        unityInstanceIdentifier++;
        return function () {
            // If the Unity Instance is defined, Quit will be invoked on the Unity
            // Instance. This removes the Unity Loader and Framework from memory.
            unityContext === null || unityContext === void 0 ? void 0 : unityContext.quitUnityInstance();
        };
    }, []);
    // Renders the actual canvas element which Unity will use to render.
    return react_1.createElement("canvas", {
        // Unity 2021.2 and above requires a unique identifier for each canvas
        // internally. This is not documented in the Unity documentation, but
        // it is required for the canvas to be rendered. This is further explained
        // in https://github.com/jeffreylanters/react-unity-webgl/issues/223.
        id: "unity-canvas-" + unityInstanceIdentifier,
        // A reference to the canvas element is required to create a Unity Instance.
        ref: htmlCanvasElement,
        // Push through of some properties.
        className: props.className || undefined,
        style: props.style || {},
        tabIndex: props.tabIndex || undefined,
    });
}
exports.Unity = Unity;
//# sourceMappingURL=unity.js.map