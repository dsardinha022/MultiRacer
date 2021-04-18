import { MutationObserverFactory } from '@angular/cdk/observers';
import { Component, OnInit } from '@angular/core';
import $ from "jquery";
import { ProblemGenComponent } from '../problem-gen/problem-gen.component'
import { OBJLoader2,Group, PlaneGeometry,VertexColors, FaceColors, OrbitControls, TextureLoader,sRGBEncoding, DoubleSide, RepeatWrapping, PCFSoftShadowMap, GLTFLoader, MTLLoader, DRACOLoader, AmbientLight, BasicShadowMap, Box3, BoxBufferGeometry, Box3Helper, BoxGeometry, Color, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, PerspectiveCamera, SpotLight, Quaternion, Scene, Vector3, WebGLRenderer, AxesHelper, BufferGeometry } from 'node_modules/three-full/builds/Three.es.js';
import {THREEx} from '../../../threex.dynamictexture.js'
import { WHITE_ON_BLACK_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';

export class MouseCoordinates {
  x: number = 0;
  y: number = 0;
  constructor(){
    this.x = 0;
    this.y = 0;
  }
}


@Component({
  selector: 'app-game-engine',
  templateUrl: './game-engine.component.html',
  styleUrls: ['./game-engine.component.scss']
})
export class GameEngineComponent implements OnInit {
  quizProblems: ProblemGenComponent;
  problemCubes = new Group();
  collisions = [];
   scene = new Scene();
  cameraOne = new PerspectiveCamera();
  //followCamera = new PerspectiveCamera();
  orbitControls: OrbitControls;
  car: Object3D;
  carSpeed: number = 0;
  isForward: boolean = false;
  isReverse: boolean = false;
  isGoingLeft: boolean = false;
  isGoingRight: boolean = false;

  ambientLight = new AmbientLight();
  spotLight = new SpotLight();
  renderer: WebGLRenderer;
  worldOriginPoint: Mesh;

  isResized: boolean = true;

  oldModelRotationY: number = 0;

  loadingValue: number = 0;
  animateCallback: any;
  lastMousePosition = new MouseCoordinates();
  lastMouseClickedPosition= new MouseCoordinates();
  targetRotationX = 0;
  targetRotationOnMouseDownX = 0;
  targetRotationY = 0;
  targetRotationOnMouseDownY = 0;

  constructor() { 

  }

  async ngOnInit() {    
    //Problems Component
    this.quizProblems = new ProblemGenComponent();
    this.quizProblems.ngOnInit();

    //Camge Engine Component
    this.configureScene();
    await this.configureProduct();
    this.configureLights();    
    this.configureCameras(); 
    this.configureRenderer();

    //Problem Cubes
    this.generateProblemCubes();

    //Always calls animate function Repeatedly
    this.animateCallback = {
      callAnimate: (this.animate).bind(this)
    };
    this.animateCallback.callAnimate();
  }



  configureScene() : void {
    this.scene.background = new Color(0xd1d3da);
    const geometry = new BoxGeometry( 1, 1, 1 );
    const material = new MeshBasicMaterial( {color: 0x00ff00} );
    this.worldOriginPoint = new Mesh(geometry,material);
    this.worldOriginPoint.visible = false;
    this.scene.add(this.worldOriginPoint);

    //World Floor
    const floorGeo = new PlaneGeometry( 1000000, 1000000, 0 );
    let floorImage = new TextureLoader().load("assets/gravel.jpg");
    floorImage.wrapS = floorImage.wrapT = RepeatWrapping;
    floorImage.repeat.set( 1000, 1000 );
    floorImage.encoding = sRGBEncoding;
    const floorMat = new MeshBasicMaterial( {map: floorImage, side: DoubleSide} );
    let floor = new Mesh( floorGeo, floorMat );
    floor.rotation.x = Math.PI / 2;
    console.log(floor);
    this.scene.add( floor );

    //Debug Tool
    const axesHelper = new AxesHelper( 500 );
    this.scene.add(axesHelper);
  }

  configureCameras() {
    //Debugging
    this.cameraOne = new PerspectiveCamera(75, 2, 1, 100);
    this.cameraOne.near = 2;
    this.cameraOne.far = 100000;
    this.cameraOne.position.z = 125;
    this.cameraOne.lookAt(this.scene.position);

    // this.followCamera = new PerspectiveCamera(75, 2, 1, 100);
    // this.followCamera.near = 2;
    // this.followCamera.far = 100000;   
    // this.followCamera.lookAt(this.scene.position);

  }
  configureLights() {
    this.ambientLight = new AmbientLight(0xffffff, 0.2);
    this.scene.add(this.ambientLight);
    this.spotLight = new SpotLight(0xffffff, 0.75);
    this.spotLight.position.set(150, 150, 150);    
    this.scene.add(this.spotLight);
  }
  async configureProduct(){
    const graphicLoader = new MTLLoader();
    await graphicLoader.load('Models/mazda.mtl', (gObj) => {
      gObj.preload();
      const objLoader = new OBJLoader2();
      objLoader.addMaterials(gObj.materials, false);
      objLoader.load('Models/mazda.obj', (object) => { 

        //Load Models on Ground
        this.car = object;
        this.car.name = "car";
        this.spotLight.target = this.car;
        this.scene.add(this.car);

        //Collision Bounding Box
        for(let child of this.car.children){
          if(child.geometry){
            child.geometry.computeBoundingBox();            
         }
        }
        
      }, (xhr) => {
        this.loadingValue = xhr.loaded / xhr.total * 100;
        if(xhr = 100){
        }
        console.log( ( this.loadingValue ) + '% loaded' );
      }, (error) => {
        console.log( 'Error occured when loading model:', error );
      });
    });    

    this.cameraOne.lookAt(this.scene.position);
  }



  configureRenderer() {
    this.renderer = new WebGLRenderer({antialias: true});
    let load_model = document.getElementById('game_world');

    this.renderer.setSize($(load_model).width(), $(load_model).height());
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap; 

    //Adds EventListeners to handle screen controls
    this.addEventListeners();

    //Adds follow Cam offset & position
    //this.cameraOne.position.set(0,0,0);
    //this.updateCamera();

    // //Adds Orbit Controls - IF REMOVED; game will crash
    this.orbitControls = new OrbitControls( this.cameraOne, this.renderer.domElement );
    this.orbitControls.update();


    if(load_model != null){
      load_model.appendChild(this.renderer.domElement);
    }
  }  


  generateProblemCubes() {
    for(let i = 0; i < this.quizProblems.currentProblem.possibleAnswers.length; i++){
      let geometry = new BoxGeometry( 50, 50, 50 );
      let dynamicTexture = new THREEx.DynamicTexture(512,512);
      dynamicTexture.context.font	= "bold "+(0.5*512)+"px Arial";
      dynamicTexture.clear('black')
      dynamicTexture.drawTextCooked({
        text		:  this.quizProblems.currentProblem.possibleAnswers[i].value.toString(),
        align   :  'center',
        fillStyle: 'white',
        lineHeight	: 0.5,
      })
      let material = new MeshBasicMaterial( { map: dynamicTexture.texture} );
      let cube = new Mesh( geometry, material );      
      this.positionCube(cube);      
      this.calculateCollisionPoints(cube, cube.scale);
      
      this.problemCubes.add(cube);
      
    }
    this.scene.add( this.problemCubes );
  }

  positionCube(cube: Mesh) {
    let randomXPos = this.quizProblems.randomNumber(-500, 500);
    let randomZPos = this.quizProblems.randomNumber(-500, 500);
    if(this.car){
      cube.position.set(randomXPos + this.car.position.x + 200, 75, randomZPos);
    }else{
      cube.position.set(randomXPos - 500, 75, randomZPos - 500);
    }
   
  }

  resizeCanvasToDisplaySize() {   
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.renderer.setSize(width, height, false); 
    this.cameraOne.aspect = width / height;
    this.cameraOne.updateProjectionMatrix(); 
    this.isResized = false;
  }

  addEventListeners() {
    $(this.renderer.domElement).keydown((a) => {
      if(a.key == "w"){
        this.isForward = true;        
      }
      if(a.key == "s"){
       this.isReverse = true;
      }        
      if(a.key == "a"){
        //this.orbitControls.enabled = false;
        this.isGoingLeft = true;        
      }        
      if(a.key == "d"){
        //this.orbitControls.enabled = false;
        this.isGoingRight = true;
      }              
    }),
    $(self).keyup((b) => {
      if(b.key == "w"){
        this.isForward = false;        
      }
      if(b.key == "s"){
        this.isReverse = false;
      }
      if(b.key == "a"){
        this.isGoingLeft = false; 
      }
      if(b.key == "d"){
        this.isGoingRight = false; 
      }
    }),
    $(window).on('resize', () => {
      this.isResized = true;    
    })
  }

  calculateCollisionPoints( mesh: Mesh, scale, type = 'collision' ) { 
    // Compute the bounding box after scale, translation, etc.
    var bbox = new Box3().setFromObject(mesh);

    var bounds = {
      type: type,
      xMin: bbox.min.x,
      xMax: bbox.max.x,
      yMin: bbox.min.y,
      yMax: bbox.max.y,
      zMin: bbox.min.z,
      zMax: bbox.max.z,
    };
   
    this.collisions.push( bounds );
  }

  protected animate() {    
    requestAnimationFrame(this.animateCallback.callAnimate); 
    //this.updateCamera();
    this.renderAnimation();       
  }

  protected renderAnimation(){  
    this.orbitControls.update();  
    if(this.car != undefined){      
      if(this.isResized){
        this.resizeCanvasToDisplaySize();
      }
      if ( this.collisions.length > 0 ) {
        this.detectCollisions();
      }       
      if(this.isForward || this.isReverse){
        this.carMovement();
      } else {
        this.speedDecay();
      }
      this.updateProblemCubes();  
    }
    //this.car = undefined;
    this.renderer.render(this.scene, this.cameraOne);
  }

  protected carMovement(): void {
    if(this.isForward){
      if(this.carSpeed < 125){
        this.carSpeed += 0.5;
      }  
      this.handleSteering();

      this.car.position.x -= this.carSpeed * 0.05;
    }
    if(this.isReverse){
      if(this.carSpeed >= -75){
        this.carSpeed -= 1;
      }
      this.handleSteering();      
      this.car.position.x += -(this.carSpeed) * 0.05;
    }
  }

  protected speedDecay(): void {
    if(this.carSpeed != 0){
      if(this.carSpeed > 0){
        this.carSpeed -= 0.5;
        this.car.position.x -= this.carSpeed * 0.05;
      }
      if(this.carSpeed < 0){
        this.carSpeed += 0.5;
        this.car.position.x += -(this.carSpeed) * 0.05;
      }
    }
  }

  protected handleSteering(): void {
    if(this.isGoingLeft){
      this.car.position.z += 3;
    }        
    if(this.isGoingRight){
      this.car.position.z -= 3;
    }  
  }

  protected updateCamera(){
    if(this.car != undefined){
      const x1 = this.car.position.x + 250;
      const y1 = this.car.position.y + 100;
      const z1 = this.car.position.z;
      var offset = new Vector3(x1, y1, z1);
      //this.followCamera.position.lerp(offset, 0.2);
      //this.followCamera.lookAt(x1, y1, z1);
    }
  }

  protected updateProblemCubes(){
    if(this.problemCubes.children.length > 0){
      this.problemCubes.children.forEach(cube => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      });
    }
  }

  protected detectCollisions(){
  console.log("detectCollisionSystem Running");
  for ( var index = 0; index < this.collisions.length; index ++ ) {
    var bbox = new Box3().setFromObject(this.car);

    var bounds = {
      xMin: bbox.min.x,
      xMax: bbox.max.x,
      yMin: bbox.min.y,
      yMax: bbox.max.y,
      zMin: bbox.min.z,
      zMax: bbox.max.z,
    };
 
    if (this.collisions[ index ].type == 'collision' ) {
      if ( (bounds.xMin <= this.collisions[ index ].xMax && bounds.xMax >= this.collisions[ index ].xMin ) &&
         ( bounds.yMin <= this.collisions[ index ].yMax && bounds.yMax >= this.collisions[ index ].yMin) &&
         ( bounds.zMin <=+ this.collisions[ index ].zMax && bounds.zMax >= this.collisions[ index ].zMin) ) {
        // We hit a solid object! Stop all movements.
          console.log("HIT CAPTIAN!");

        this.problemCubes = new Group();
 
        // // Move the object in the clear. Detect the best direction to move.
        // if ( bounds.xMin <= this.collisions[ index ].xMax && bounds.xMax >= this.collisions[ index ].xMin ) {
        //   // Determine center then push out accordingly.
        //   var objectCenterX = ((this.collisions[ index ].xMax - this.collisions[ index ].xMin) / 2) + this.collisions[ index ].xMin;
        //   var playerCenterX = ((bounds.xMax - bounds.xMin) / 2) + bounds.xMin;
        //   var objectCenterZ = ((this.collisions[ index ].zMax - this.collisions[ index ].zMin) / 2) + this.collisions[ index ].zMin;
        //   var playerCenterZ = ((bounds.zMax - bounds.zMin) / 2) + bounds.zMin;
 
        //   // Determine the X axis push.
        //   if (objectCenterX > playerCenterX) {
        //     rotationPoint.position.x -= 1;
        //   } else {
        //     rotationPoint.position.x += 1;
        //   }
        // }
        // if ( bounds.zMin <= this.collisions[ index ].zMax && bounds.zMax >= this.collisions[ index ].zMin ) {
        //   // Determine the Z axis push.
        //   if (objectCenterZ > playerCenterZ) {
        //   rotationPoint.position.z -= 1;
        //   } else {
        //     rotationPoint.position.z += 1;
        //   }
         }
      }
    }
  }


}