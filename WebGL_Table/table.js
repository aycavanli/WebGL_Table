var vertices = [
   //torso
   vec4( -1.0/25, 1.0/25, -1.0/25, 1.0 ),//0
   vec4( -1.0/25, 1.0/50, 10.0/25, 1.0 ),//1
   vec4( 10.0/25, 1.0/50, 10.0/25, 1.0 ),//2
   vec4( 10.0/25, 1.0/25, -1.0/25, 1.0 ),//3
   vec4( -1.0/25, -1.0/25, 10./25, 1.0),//4
   vec4(-1.0/25,-1.0/25,-1.0/25,1.0),//5
   vec4(10.0/25,-1.0/25,-1.0/25,1.0),//6
   vec4(10.0/25,-1.0/25,10.0/25,1.0),//7

   //front-left
   vec4(3.0/25,-1.0/25,10.0/25,1.0),//8
   vec4(3.0/25,-1.0/25,6.0/25,1.0),//9
   vec4(-1.0/25,-1.0/25,6.0/25,1.0),//10
   vec4(-1.0/25,-5.0/25,6.0/25,1.0),//11
   vec4(3.0/25,-5.0/25,6.0/25,1.0),//12
   vec4(3.0/25,-5.0/25,10.0/25,1.0),//13
   vec4(-1.0/25,-5.0/25,10.0/25,1.0),//14

   //front-right
   vec4(6.0/25,-1.0/25,10.0/25,1.0),//15
   vec4(6.0/25,-1.0/25,6.0/25,1.0),//16
   vec4(10.0/25,-1.0/25,6.0/25,1.0),//17
   vec4(6.0/25,-5.0/25,6.0/25,1.0),//18
   vec4(10.0/25,-5.0/25,6.0/25,1.0),//19
   vec4(10.0/25,-5.0/25,10.0/25,1.0),//20
   vec4(6.0/25,-5.0/25,10.0/25,1.0),//21       

   //back-left
   vec4(3.0/25,-1.0/25,3.0/25,1.0),//22
   vec4(3.0/25,-1.0/25,-1.0/25,1.0),//23
   vec4(-1.0/25,-1.0/25,-1.0/25,1.0),//24
   vec4(-1.0/25,-5.0/25,-1.0/25,1.0),//25
   vec4(3.0/25,-5.0/25,-1.0/25,1.0),//26
   vec4(3.0/25,-5.0/25,3.0/25,1.0),//27
   vec4(-1.0/25,-5.0/25,3.0/25,1.0),//28

   //back-right
   vec4(6.0/25,-1.0/25,3.0/25,1.0),//29
   vec4(6.0/25,-1.0/25,-1.0/25,1.0),//30
   vec4(10.0/25,-1.0/25,-1.0/25,1.0),//31
   vec4(6.0/25,-5.0/25,-1.0/25,1.0),//32
   vec4(10.0/25,-5.0/25,-1.0/25,1.0),//33
   vec4(10.0/25,-5.0/25,3.0/25,1.0),//34
   vec4(6.0/25,-5.0/25,3.0/25,1.0),//35 
   
   //5 yerine
   vec4(-1.0/25,-1.0/25,3.0/25,1.0),//36
   //6 yerine
   vec4(10.0/25,-1.0/25,3.0/25,1.0),//37
];

var canvas;
var gl;
var numVertices  = 36*5+2;

var pointsArray = [];
var normalsArray = [];

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 0.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 0.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 0.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 0.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 0.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 0.0 );
var materialShininess = 100.0;

var ctm = mat4();
var scale = mat4();

var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 3;
var theta =[0, 0, 0];

//lightning
var theta2  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;
var time = 0;
var radius = 1.5;
var lightx=false;
var lighty=false;
var lightz=false;


var flag = true;
var speed = 2.0;

var eye = vec3(2.0, 2.0, 2.0);
var at = vec3(0.5, 0.5, 0.5);
var up = vec3(0.0, 5.0, 0.0);

var near = -100
var far = 100

var wireframe = false;

//color
var color_red=false;
var color_black=false;
var color_green=false;
var color_blue=false;
var opacity = 0.7;

//texture
var text_flag = 0.0;
var texSize = 256;
var numChecks = 8;
var texture1, texture2;
var t1, t2;
var c;
var texCoordsArray = [];
var colorsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var image1 = new Uint8Array(4*texSize*texSize);

for ( var i = 0; i < texSize; i++ ) {
   for ( var j = 0; j <texSize; j++ ) {
      var patchx = Math.floor(i/(texSize/numChecks));
      var patchy = Math.floor(j/(texSize/numChecks));
      if(patchx%2 ^ patchy%2) c = 255;
      else c = 0;
      //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
      image1[4*i*texSize+4*j] = c;
      image1[4*i*texSize+4*j+1] = c;
      image1[4*i*texSize+4*j+2] = c;
      image1[4*i*texSize+4*j+3] = 255;
   }
}

var image2 = new Uint8Array(4*texSize*texSize);

// Create a checkerboard pattern
for ( var i = 0; i < texSize; i++ ) {
   for ( var j = 0; j <texSize; j++ ) {
      image2[4*i*texSize+4*j] = 127+127*Math.sin(0.1*i*j);
      image2[4*i*texSize+4*j+1] = 127+127*Math.sin(0.1*i*j);
      image2[4*i*texSize+4*j+2] = 127+127*Math.sin(0.1*i*j);
      image2[4*i*texSize+4*j+3] = 255;
      }
}
function configureTexture() {
   texture1 = gl.createTexture();
   gl.bindTexture( gl.TEXTURE_2D, texture1 );
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
   gl.generateMipmap( gl.TEXTURE_2D );
   gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                     gl.NEAREST_MIPMAP_LINEAR );
   gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

   texture2 = gl.createTexture();
   gl.bindTexture( gl.TEXTURE_2D, texture2 );
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
   gl.generateMipmap( gl.TEXTURE_2D );
   gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                     gl.NEAREST_MIPMAP_LINEAR );
   gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}
function quad(a, b, c, d) {

   var t1 = subtract(vertices[b], vertices[a]);
   var t2 = subtract(vertices[c], vertices[b]);
   var normal = cross(t1, t2);
   var normal = vec3(normal);

   pointsArray.push(vertices[a]);
   normalsArray.push(normal);
   texCoordsArray.push(texCoord[0]);

   pointsArray.push(vertices[b]);
   normalsArray.push(normal);
   texCoordsArray.push(texCoord[1]);

   pointsArray.push(vertices[c]);
   normalsArray.push(normal);
   texCoordsArray.push(texCoord[2]);

   pointsArray.push(vertices[a]);
   normalsArray.push(normal);
   texCoordsArray.push(texCoord[0]);

   pointsArray.push(vertices[c]);
   normalsArray.push(normal);
   texCoordsArray.push(texCoord[2]);

   pointsArray.push(vertices[d]);
   normalsArray.push(normal);
   texCoordsArray.push(texCoord[3]);
}

function colorCube()
{
   //torso
   quad( 1, 2, 7, 4 );//1
   quad( 2, 3, 6, 7 );//2
   quad( 4, 5, 6, 7 );//3
   quad( 1, 0, 3, 2 );//4
   quad( 0, 3, 6, 5 );//5
   quad( 0, 1, 4, 5 );//6

   //front-left
   quad( 8, 4, 14, 13 );//1
   quad( 8, 9, 12, 13 );//2
   quad( 14, 11, 12, 13 );//3
   quad( 4, 8, 9, 10 );//4
   quad( 10, 9, 12, 11 );//5
   quad( 4, 10, 11, 14 );//6

   //front-right
   quad( 21, 20, 7, 15 );//1
   quad( 7, 17, 19, 20 );//2
   quad( 21, 20, 19, 18 );//3
   quad( 7, 15, 16, 17 );//4
   quad( 16, 17, 19, 18 );//5
   quad( 21, 18, 16, 15 );//6

   //back-left
   quad( 22, 36, 28, 27 );//1
   quad( 22, 23, 26, 27 );//2
   quad( 28, 25, 26, 27 );//3
   quad( 36, 22, 23, 24 );//4
   quad( 24, 23, 26, 25 );//5
   quad( 36, 24, 25, 28 );//6

   //front-right
   quad( 35, 34, 37, 29 );//1
   quad( 37, 31, 33, 34 );//2
   quad( 35, 34, 33, 32 );//3
   quad( 37, 29, 30, 31 );//4
   quad( 30, 31, 33, 32 );//5
   quad( 35, 32, 30, 29 );//6

}

window.onload = function init() {

   canvas = document.getElementById( "gl-canvas" );
   gl = WebGLUtils.setupWebGL( canvas );
   gl.viewport( 0, 0, canvas.width, canvas.height );
   gl.clearColor( 1.0, 1.0, 1.0, 0.5 );
   gl.enable(gl.DEPTH_TEST);

   program = initShaders( gl, "vertex-shader", "fragment-shader" );
   gl.useProgram( program );

   colorCube();

   var nBuffer = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
   gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

   var vNormal = gl.getAttribLocation( program, "vNormal" );
   gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
   gl.enableVertexAttribArray( vNormal );

   var vBuffer = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
   gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

   var vPosition = gl.getAttribLocation(program, "vPosition");
   gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(vPosition);

   var cBuffer = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
   gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
   
   var tBuffer = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
   gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

   var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
   gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
   gl.enableVertexAttribArray( vTexCoord );

   //default
   projection = ortho(-1, 1, -1, 1, near, far);

   var ambientProduct = mult(lightAmbient, materialAmbient);
   var diffuseProduct = mult(lightDiffuse, materialDiffuse);
   var specularProduct = mult(lightSpecular, materialSpecular);


   gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
      flatten(ambientProduct));
   gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
      flatten(diffuseProduct) );
   gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
      flatten(specularProduct) );
   gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
      flatten(lightPosition) );
   gl.uniform1f(gl.getUniformLocation(program,"shininess"),materialShininess);

   //event listeners
   document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
   document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
   document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
   document.getElementById("ButtonT").onclick = function(){flag = !flag;};

   var textMenu = document.getElementById("textMenu"); 
   textMenu.addEventListener("click", function() {  
      switch (textMenu.selectedIndex) {  
         case 0:
            wireframe=true;
            break; 
         case 1:
            wireframe=false;
            break;
         case 2:
            text_flag = 1.0;
            gl.uniform1f(gl.getUniformLocation(program,
               "text_flag"),this.text_flag);
            configureTexture();
            gl.activeTexture( gl.TEXTURE0 );
            gl.bindTexture( gl.TEXTURE_2D, texture1 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
         
            gl.activeTexture( gl.TEXTURE1 );
            gl.bindTexture( gl.TEXTURE_2D, texture2 );
            gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);
            break;
         case 3:
            text_flag = 0.0;
            break;
         } 
      }
   );
   var colorMenu = document.getElementById("colorMenu"); 
   colorMenu.addEventListener("click", function() {  
      switch (colorMenu.selectedIndex) {  
         case 0:
            color_black = 1.0;
            color_blue = 0.0;
            color_red = 0.0;
            color_green = 0.0;
            break; 
         case 1:
            color_black = 0.0;
            color_blue = 0.0;
            color_red = 1.0;
            color_green = 0.0;
            break;
         case 2:
            color_black = 0.0;
            color_blue = 0.0;
            color_red = 0.0;
            color_green = 1.0;
            break;
         case 3:
            color_black = 0.0;
            color_blue = 1.0;
            color_red = 0.0;
            color_green = 0.0;
            break;
         }
         var cBuffer = gl.createBuffer();
         gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
         gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
         
         var vColor = gl.getAttribLocation( program, "vColor" );
         gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
         gl.enableVertexAttribArray( vColor );
      }
   );
   document.getElementById("ButtonPerspective").onclick = function(){
      projection = perspective(30.0, 7, 0.5, 5);   
   };
   document.getElementById("ButtonOrtho").onclick = function(){
      projection = ortho(-1, 1, -1, 1, near, far);  
   };
   document.getElementById("ButtonFaster").onclick = function(){speed += 1;};
   document.getElementById("ButtonSlower").onclick = function(){if(speed > 0) speed -= 1;};
   document.getElementById("ButtonChangeRotate").onclick = function(){speed *= -1;};
   document.getElementById("ButtonScaleUp").onclick = function(){ scale = scalem(2,2,2);};
   document.getElementById("ButtonScaleDown").onclick = function(){ scale = scalem(1/2,1/2,1/2);};

   document.getElementById("ButtonRight").onclick = function(){ ctm = translate(1,0,0);  };
   document.getElementById("ButtonLeft").onclick = function(){ ctm = translate(-1,0,0);  };
   document.getElementById("ButtonUp").onclick = function(){ ctm = translate(0,1,0); };
   document.getElementById("ButtonDown").onclick = function(){ ctm = translate(0,-1,0);  };

   document.getElementById("ButtonLightX").onclick = function(){lightx += true;};
   document.getElementById("ButtonLightY").onclick = function(){lighty += true;};
   document.getElementById("ButtonLightZ").onclick = function(){lightz += true;};

   document.getElementById("ButtonOpacityUp").onclick = function(){opacity += 0.1;};
   document.getElementById("ButtonOpacityDown").onclick = function(){opacity -= 0.1;};

   window.onkeydown =     function(event) { 
      var key = String.fromCharCode(event.keyCode);       
      switch (key) { 
            case 'W':             
               ctm = translate(0,1,0);            
            break;          
            case 'S':             
               ctm =translate(0,-1,0);           
            break;          
            case 'A':             
               ctm = translate(-1,0,0);             
            break;  
            case 'D':             
               ctm = translate(1,0,0);            
            break;     
            case 'O':             
               projection = ortho(-1, 1, -1, 1, near, far);              
            break;  
            case 'P':             
               projection = perspective(30.0, 7, 0.5, 5);             
            break;   
         }    
      }
   
   render();

}

var render = function(){

   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
   if(flag  ) theta[axis] += speed;
  
   modelView = mat4();
   modelView  = lookAt(eye, at, up);
  
   modelView = mult(modelView, scale);   
   modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
   modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
   modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));
   modelView = mult(modelView, ctm);

   if(lightx)
      lightPosition[1] = 5.5*Math.sin(0.01*time);
   if(lighty)
      lightPosition[1] = 5.5*Math.sin(0.01*time);
   if(lightz)
      lightPosition[2] = 5.5*Math.cos(0.01*time);

   time += 1;

   gl.uniformMatrix4fv( gl.getUniformLocation(program,"modelViewMatrix"), false, flatten(modelView) );
   gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),false, flatten(projection));
   gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );


   gl.uniform1f(gl.getUniformLocation(program,"opacity"),this.opacity);
   gl.uniform1f(gl.getUniformLocation(program,"text_flag"),this.text_flag);

   gl.uniform1f(gl.getUniformLocation(program,"color_blue"),color_blue);
   gl.uniform1f(gl.getUniformLocation(program,"color_black"),this.color_black);
   gl.uniform1f(gl.getUniformLocation(program,"color_red"),this.color_red);
   gl.uniform1f(gl.getUniformLocation(program,"color_green"),this.color_green);

   if(!wireframe)
      gl.drawArrays( gl.TRIANGLES, 0, numVertices );

   if(wireframe)
   gl.drawArrays( gl.LINE_LOOP, 0, numVertices );

   requestAnimFrame(render);
}