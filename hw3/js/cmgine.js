var CMENGINE = {}

CMENGINE.Start = function (scene, renderer, camera) {
    for(var i = 0; i < scene.children.length; i++) {
        if(scene.children[i].Start != null) {
            scene.children[i].Start();
        }
    }

    CMENGINE.scene    = scene;
    CMENGINE.renderer = renderer;
    CMENGINE.camera   = camera;
}

CMENGINE.Update = function () {
    for(var i = 0; i < CMENGINE.scene.children.length; i++) {
        if(CMENGINE.scene.children[i].Update != null) {
            CMENGINE.scene.children[i].Update();
        }
    }

    requestAnimationFrame(CMENGINE.Update);
    CMENGINE.renderer.render(CMENGINE.scene, CMENGINE.camera);
}
