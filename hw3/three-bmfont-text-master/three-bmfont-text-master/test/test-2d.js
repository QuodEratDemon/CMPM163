/*
  This is an example of 2D rendering, simply
  using bitmap fonts in orthographic space.

  var geom = createText({
    multipage: true,
    ... other options
  })
 */

global.THREE = require('three')
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var createText = require('../')

require('./load')({
  font: 'fnt/Lato-Regular-64.fnt',
  image: 'fnt/lato.png'
}, start)

function start (font, texture) {
  var gui = new dat.GUI( { width: 350 } );
  var options1 = {
    text : 'insert text here',
    Red : '230',
    Green: '230',
    Blue: '230'

  }
  gui.add(options1, "text")
  gui.add(options1, "Red")
  gui.add(options1, "Green")
  gui.add(options1, "Blue")



  var app = createOrbitViewer({
    clearColor: 'rgb(80, 80, 80)',
    clearAlpha: 1.0,
    fov: 65,
    position: new THREE.Vector3()
  })

  app.camera = new THREE.OrthographicCamera()
  app.camera.left = 0
  app.camera.top = 0
  app.camera.near = -100
  app.camera.far = 100

  var geom = createText({
    text: options1.text,
    font: font,
    align: 'left',
    width: 700,
    flipY: texture.flipY
  })

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: 'rgb(230, 230, 230)'
  })

  var layout = geom.layout
  var text = new THREE.Mesh(geom, material)
  var padding = 40
  text.position.set(padding, -layout.descender + layout.height + padding, 0)

  var textAnchor = new THREE.Object3D()
  textAnchor.add(text)
  textAnchor.scale.multiplyScalar(1 / (window.devicePixelRatio || 1))
  app.scene.add(textAnchor)

  // update orthographic
  app.on('tick', function () {
    // update camera
    
    var width = app.engine.width
    var height = app.engine.height
    app.camera.right = width
    app.camera.bottom = height
    app.camera.updateProjectionMatrix()


    //console.log(app)

    var newMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      color: 'rgb(' + options1.Red +','+ options1.Green +','+options1.Blue + ')'
    });

    var newGeom = createText({
      text: options1.text,
      font: font,
      align: 'left',
      width: 700,
      flipY: texture.flipY
    })

    text = new THREE.Mesh(newGeom, newMat)

    text.position.y -= 0.9
    





  })
}
