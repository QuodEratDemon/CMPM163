/*
  This is an example of 3D rendering, using a
  signed distance field shader and standard derivatives
  for improved edge quality and scaling.

  We've also enabled anisotropy on the texture for
  crisp rendering at sharp angles.
 */

global.THREE = require('three')
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var createText = require('../')
var SDFShader = require('../shaders/sdf')
var loadFont = require('load-bmfont')



// load up a 'fnt' and texture
require('./load')({
  font: 'fnt/DejaVu-sdf.fnt',
  image: 'fnt/DejaVu-sdf.png'}
  
, start)


function rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function byteToHexString(uint8arr) {
  if (!uint8arr) {
    return '';
  }
  
  var hexStr = '';
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }
  
  return hexStr.toUpperCase();
}

function hexStringToByte(str) {
  if (!str) {
    return new Uint8Array();
  }
  
  var a = [];
  for (var i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i,2),16));
  }
  
  return new Uint8Array(a);
}


function start (font, texture, font2, texture2) {
  var app = createOrbitViewer({
    clearColor: 'rgb(40, 40, 40)',
    clearAlpha: 1.0,
    fov: 55,
    position: new THREE.Vector3(0, 0, -5)
  })

console.log(app)
  app.controls.enabled = false;
  
  var textureLoader = new THREE.TextureLoader();
  var maxAni = app.renderer.getMaxAnisotropy()
  var newFont = font
  var newTex = texture

  function setFont(f,t){
    newFont = f;
    newTex = t;
    

  }


  var gui = new dat.GUI( { width: 350 } );
  var options1 = {
    Text : 'insert text here',
    Width: 500,
    Red : 255,
    Green: 255,
    Blue: 255,
    DejaVu: function(){
    newFont = font
    newTex = texture
    },
    Arial: function(){
    require('./load')({
    font: 'fnt/arial.fnt',
    image: 'fnt/arial.png'
    }
  
    , setFont)

    },

    Lato: function(){
    require('./load')({
    font: 'fnt/Lato-Regular-32.fnt',
    image: 'fnt/lato.png'
    }
  
    , setFont)

    },

    Segoe: function(){
    require('./load')({
    font: 'fnt/Segoe.fnt',
    image: 'fnt/Segoe.png'
    }
  
    , setFont)

    },

    Rotation: 0.0,
    Scale : 1.0,
    PositionX : 0.0,
    PositionY: 0.0



  }
  gui.add(options1, "Text")
  gui.add(options1, "Width",100,1000)
    gui.add(options1, "Rotation",0.0,6.5),
    gui.add(options1, "Scale",1.0,5.0),
  gui.add(options1, "PositionX",-2.0,2.0),
  gui.add(options1, "PositionY",-2.0,2.0),
  gui.add(options1, "Red",0,255)
  gui.add(options1, "Green",0,255)
  gui.add(options1, "Blue",0,255)
  gui.add(options1, "DejaVu")
  gui.add(options1, "Lato")
  gui.add(options1, "Arial")
   gui.add(options1, "Segoe")


  // setup our texture with some nice mipmapping etc
  texture.needsUpdate = true
  texture.minFilter = THREE.LinearMipMapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.anisotropy = maxAni

  var copy = getCopy()

  // create our text geometry
  var geom = createText({
    text: options1.Text, // the string to render
    font: font, // the bitmap font definition
    width: options1.Width // optional width for word-wrap
  })

  // here we use 'three-bmfont-text/shaders/sdf'
  // to help us build a shader material
  var material = new THREE.RawShaderMaterial(SDFShader({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    color: 'rgb(230, 230, 230)'
  }))

  var layout = geom.layout
  var text = new THREE.Mesh(geom, material)
  // center it horizontally
  text.position.x = -layout.width / 2
  // origin uses bottom left of last line
  // so we need to move it down a fair bit
  text.position.y = layout.height /2 //* 1.035

  // scale it down so it fits in our 3D units
  var textAnchor = new THREE.Object3D()
  textAnchor.scale.multiplyScalar(-0.005)
  textAnchor.add(text)
  app.scene.add(textAnchor)

  // scroll text
  app.on('tick', function (t) {
    //text.position.y -= 0.9
    
    var newMat = new THREE.RawShaderMaterial(SDFShader({
    map: newTex,
    side: THREE.DoubleSide,
    transparent: true,
    color: parseInt( rgbToHex(options1.Red,options1.Green,options1.Blue),16) //'rgb(' + options1.Red.toString() +','+ options1.Green.toString() +','+options1.Blue.toString() + ')'
  }))

    //console.log(hexStringToByte(rgbToHex(options1.Red,options1.Green,options1.Blue)))
//console.log(0xFFFFFF);
    text.material = newMat


    //console.log(text.material)

    //text.geometry._opt.font = newFont
    geom.update({
      font: newFont,
      text: options1.Text,
      width: options1.Width
    })

    textAnchor.rotation.z = options1.Rotation;
    textAnchor.position.x = options1.PositionX;
    textAnchor.position.y = options1.PositionY;

    textAnchor.scale.y = -0.005 * options1.Scale
    textAnchor.scale.x = -0.005 * options1.Scale

  })
}

function getCopy () {
  return [
    'Total characters: 3,326',
    'Click + drag to rotate',
    '',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sodales arcu felis, sed molestie ante faucibus a. Integer ligula est, cursus a nisl nec, tempus euismod lorem. Nullam risus felis, fringilla aliquam eros nec, condimentum pretium felis. Praesent rutrum ornare massa, ac rutrum nisl pharetra sit amet. Morbi scelerisque diam quis eleifend lacinia. Sed a porttitor leo. Aenean et vestibulum eros, id condimentum ligula. Quisque maximus, eros et bibendum tristique, enim nulla laoreet mi, molestie imperdiet felis dolor et turpis. Cras sed nunc nec tortor mollis auctor. Aenean cursus blandit metus, in viverra lacus fringilla nec. Nulla a consectetur urna. Sed scelerisque leo in arcu viverra, quis euismod leo maximus. Maecenas ultrices, ligula et malesuada volutpat, sapien nisi placerat ligula, quis dapibus eros diam vitae justo. Sed in elementum ante. Phasellus sed sollicitudin odio. Fusce iaculis tortor ut suscipit aliquam. Curabitur eu nunc id est commodo ornare eu nec arcu. Phasellus et placerat velit, ut tincidunt lorem. Sed at gravida urna. Vivamus id tristique lacus, nec laoreet dolor. Vivamus maximus quam nec consectetur aliquam. Integer condimentum nulla a elit porttitor molestie. Nullam nec dictum lacus. Curabitur rhoncus scelerisque magna ac semper. Curabitur porta est nec cursus tempus. Phasellus hendrerit ac dolor quis pellentesque. Aenean diam nisl, dapibus eget enim vitae, convallis tempor nibh. Proin sit amet ante suscipit, gravida odio ac, euismod neque. Sed sodales, leo eget congue ultricies, leo tellus euismod mauris, tempor finibus elit orci sit amet massa. Pellentesque aliquam magna a neque aliquet, ac dictum tortor dictum.',
    '',
    'Praesent vestibulum ultricies aliquam. Morbi ut ex at nunc ultrices convallis vel et metus. Aliquam venenatis diam ut sodales tristique. Duis et facilisis ipsum. Sed sed ex dictum, mattis urna nec, dictum ex. Donec facilisis tincidunt aliquam. Sed pellentesque ullamcorper tellus nec eleifend. Mauris pulvinar mi diam, et pretium magna molestie eu. In volutpat euismod porta. Etiam a magna non dolor accumsan finibus. Suspendisse potenti. Phasellus blandit nibh vel tortor facilisis auctor.',
    '',
    'Mauris vel iaculis libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Etiam et porttitor enim, eget semper ipsum. Vestibulum nec eros massa. Nullam ornare dui eget diam tincidunt tristique. Pellentesque molestie finibus pretium. Quisque in tempor elit. Fusce quis orci ut lacus cursus hendrerit. Curabitur iaculis eros et justo condimentum sodales. In massa sapien, mattis nec nibh id, sagittis semper ex. Nunc cursus sem sit amet leo maximus, vitae molestie lectus cursus.',
    '',
    'Morbi viverra ipsum purus, eu fermentum urna tincidunt at. Maecenas feugiat, est quis feugiat interdum, est ante egestas sem, sed porttitor arcu dui quis nulla. Praesent sed auctor enim. Sed vel dolor et nunc bibendum placerat. Nunc venenatis luctus tortor, ut gravida nunc auctor semper. Suspendisse non orci ut justo iaculis pretium lobortis nec nunc. Donec non libero tellus. Mauris felis mauris, consequat sed tempus ut, tincidunt sit amet nibh. Nam pellentesque lacinia massa, quis rhoncus erat fringilla facilisis. Pellentesque nunc est, lobortis non libero vel, dapibus suscipit dui.'
  ].join('\n')
}
