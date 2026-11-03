(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=typeof Float32Array<`u`?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var e=0,t=arguments.length;t--;)e+=arguments[t]*arguments[t];return Math.sqrt(e)});function t(){var t=new e(9);return e!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function n(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=t[4],s=t[5],c=t[6],l=t[7],u=t[8],d=t[9],f=t[10],p=t[11],m=t[12],h=t[13],g=t[14],_=t[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,T=u*g-f*m,E=u*_-p*m,D=d*g-f*h,O=d*_-p*h,k=f*_-p*g,A=v*k-y*O+b*D+x*E-S*T+C*w;return A?(A=1/A,e[0]=(s*k-c*O+l*D)*A,e[1]=(c*E-o*k-l*T)*A,e[2]=(o*O-s*E+l*w)*A,e[3]=(i*O-r*k-a*D)*A,e[4]=(n*k-i*E+a*T)*A,e[5]=(r*E-n*O-a*w)*A,e[6]=(h*C-g*S+_*x)*A,e[7]=(g*b-m*C-_*y)*A,e[8]=(m*S-h*b+_*v)*A,e):null}function r(){var t=new e(16);return e!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function i(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function a(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=t[4],s=t[5],c=t[6],l=t[7],u=t[8],d=t[9],f=t[10],p=t[11],m=t[12],h=t[13],g=t[14],_=t[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,T=u*g-f*m,E=u*_-p*m,D=d*g-f*h,O=d*_-p*h,k=f*_-p*g,A=v*k-y*O+b*D+x*E-S*T+C*w;return A?(A=1/A,e[0]=(s*k-c*O+l*D)*A,e[1]=(i*O-r*k-a*D)*A,e[2]=(h*C-g*S+_*x)*A,e[3]=(f*S-d*C-p*x)*A,e[4]=(c*E-o*k-l*T)*A,e[5]=(n*k-i*E+a*T)*A,e[6]=(g*b-m*C-_*y)*A,e[7]=(u*C-f*b+p*y)*A,e[8]=(o*O-s*E+l*w)*A,e[9]=(r*E-n*O-a*w)*A,e[10]=(m*S-h*b+_*v)*A,e[11]=(d*b-u*S-p*v)*A,e[12]=(s*T-o*D-c*w)*A,e[13]=(n*D-r*T+i*w)*A,e[14]=(h*y-m*x-g*v)*A,e[15]=(u*x-d*y+f*v)*A,e):null}function o(e,t){var n=Math.sin(t),r=Math.cos(t);return e[0]=r,e[1]=0,e[2]=-n,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=n,e[9]=0,e[10]=r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function s(e,t,n,r,i){var a=1/Math.tan(t/2),o;return e[0]=a/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,i!=null&&i!==1/0?(o=1/(r-i),e[10]=(i+r)*o,e[14]=2*i*r*o):(e[10]=-1,e[14]=-2*r),e}var c=s;function l(e,t,n,r){var a,o,s,c,l,u,d,f,p,m,h=t[0],g=t[1],_=t[2],v=r[0],y=r[1],b=r[2],x=n[0],S=n[1],C=n[2];return Math.abs(h-x)<1e-6&&Math.abs(g-S)<1e-6&&Math.abs(_-C)<1e-6?i(e):(d=h-x,f=g-S,p=_-C,m=1/Math.hypot(d,f,p),d*=m,f*=m,p*=m,a=y*p-b*f,o=b*d-v*p,s=v*f-y*d,m=Math.hypot(a,o,s),m?(m=1/m,a*=m,o*=m,s*=m):(a=0,o=0,s=0),c=f*s-p*o,l=p*a-d*s,u=d*o-f*a,m=Math.hypot(c,l,u),m?(m=1/m,c*=m,l*=m,u*=m):(c=0,l=0,u=0),e[0]=a,e[1]=c,e[2]=d,e[3]=0,e[4]=o,e[5]=l,e[6]=f,e[7]=0,e[8]=s,e[9]=u,e[10]=p,e[11]=0,e[12]=-(a*h+o*g+s*_),e[13]=-(c*h+l*g+u*_),e[14]=-(d*h+f*g+p*_),e[15]=1,e)}var u=`#version 300 es
// FixedFunction (FF) v1.0 vertex shader.
// Emulates the OpenGL 2 fixed-function vertex stage, in WORLD space.
// Read it, but do not edit it.
precision highp float;

const int MAX_LIGHTS = 1; // v1.0: one directional light

struct Light {
  bool enabled;
  vec4 position; // world space. w = 0: directional, xyz points TOWARD the light
  vec4 ambient;
  vec4 diffuse;
  vec4 specular;
};

struct Material {
  vec4 ambient;
  vec4 diffuse;
  vec4 specular;
  float shininess;
};

// Attribute slots. GL2: glVertexPointer, glNormalPointer, glColorPointer. Lecture 2A.
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec4 a_color;
// layout(location = 3) in vec2 a_uv;  // reserved. Sampled from v1.1.

// Matrices. GL2: the modelview matrix, split in model and view. Lecture 2B.
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normalMatrix; // inverse transpose of the model matrix, upper 3x3
uniform vec3 u_eyePosition;  // world space. Computed by FF from the view matrix.

// Switches. GL2: glEnable(GL_LIGHTING), glEnable(GL_COLOR_MATERIAL).
uniform bool u_lighting;
uniform bool u_colorMaterial;

uniform vec4 u_globalAmbient; // GL2: GL_LIGHT_MODEL_AMBIENT
uniform Light u_lights[MAX_LIGHTS];
uniform Material u_material;

out vec4 v_primary;  // ambient + diffuse + emission, with alpha
out vec3 v_specular; // added after texturing in later versions

void main() {
  // Vertex position. GL2: gl_ModelViewProjectionMatrix * gl_Vertex. Lecture 2B.
  vec4 worldPosition = u_model * vec4(a_position, 1.0);
  gl_Position = u_projection * u_view * worldPosition;

  // Unlit path. GL2: LIGHTING disabled. Output is the color attribute. Lecture 2A.
  if (!u_lighting) {
    v_primary = a_color;
    v_specular = vec3(0.0);
    return;
  }

  vec3 n = normalize(u_normalMatrix * a_normal);
  vec3 v = normalize(u_eyePosition - worldPosition.xyz);

  // GL2: GL_COLOR_MATERIAL with GL_AMBIENT_AND_DIFFUSE.
  vec4 ka = u_colorMaterial ? a_color : u_material.ambient;
  vec4 kd = u_colorMaterial ? a_color : u_material.diffuse;

  vec3 primary = ka.rgb * u_globalAmbient.rgb; // k_e (emission) arrives in v1.1
  vec3 specular = vec3(0.0);

  for (int i = 0; i < MAX_LIGHTS; i++) {
    if (!u_lights[i].enabled) continue;

    // v1.0: directional lights only (w = 0).
    vec3 l = normalize(u_lights[i].position.xyz);

    // Ambient and Lambert diffuse. GL2: GL_AMBIENT, GL_DIFFUSE. Lecture 9A.
    float nDotL = dot(n, l);
    primary += ka.rgb * u_lights[i].ambient.rgb;
    primary += kd.rgb * u_lights[i].diffuse.rgb * max(nDotL, 0.0);

    // Phong specular with the reflection vector r = 2(n.l)n - l. GL2: GL_SPECULAR. Lecture 9A.
    // GL2 uses the Blinn half-vector. FF uses Phong by course decision.
    if (nDotL > 0.0) {
      vec3 r = 2.0 * nDotL * n - l;
      // shininess = 0 would make pow(0, 0) undefined in GLSL. GL2 gives 1.
      float f = u_material.shininess > 0.0 ? pow(max(dot(r, v), 0.0), u_material.shininess) : 1.0;
      specular += u_material.specular.rgb * u_lights[i].specular.rgb * f;
    }
  }

  v_primary = vec4(clamp(primary, 0.0, 1.0), kd.a);
  v_specular = specular;
}
`,d=`#version 300 es
// FixedFunction (FF) v1.0 fragment shader.
// GL2: the color sum stage. Texturing arrives in v1.1. Lecture 2A.
precision mediump float;

in vec4 v_primary;  // interpolated across the triangle (Gouraud)
in vec3 v_specular;

out vec4 outColor;

void main() {
  // GL2: GL_SEPARATE_SPECULAR_COLOR. Specular is added last.
  outColor = vec4(v_primary.rgb + v_specular, v_primary.a);
}
`,f=`1.0.0`,p={POSITION:0,NORMAL:1,COLOR:2,UV:3},m=`lighting`,h=`colorMaterial`,g=1,_=e=>new Float32Array([e[0],e[1],e[2],e.length===4?e[3]:1]);function v(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r);throw e.deleteShader(r),Error(`FF: shader compile failed:\n${t}`)}return r}function y(e,t,n){let r=e.createProgram();if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS)){let t=e.getProgramInfoLog(r);throw e.deleteProgram(r),Error(`FF: program link failed:\n${t}`)}return r}function b(e,t={}){let n=t.debug??!1,i=y(e,v(e,e.VERTEX_SHADER,u),v(e,e.FRAGMENT_SHADER,d)),o=t=>e.getUniformLocation(i,t),s={model:o(`u_model`),view:o(`u_view`),projection:o(`u_projection`),normalMatrix:o(`u_normalMatrix`),eyePosition:o(`u_eyePosition`),lighting:o(`u_lighting`),colorMaterial:o(`u_colorMaterial`),globalAmbient:o(`u_globalAmbient`),lights:Array.from({length:g},(e,t)=>({enabled:o(`u_lights[${t}].enabled`),position:o(`u_lights[${t}].position`),ambient:o(`u_lights[${t}].ambient`),diffuse:o(`u_lights[${t}].diffuse`),specular:o(`u_lights[${t}].specular`)})),material:{ambient:o(`u_material.ambient`),diffuse:o(`u_material.diffuse`),specular:o(`u_material.specular`),shininess:o(`u_material.shininess`)}},c={[m]:!1,[h]:!1},l={projection:r(),view:r(),model:r(),normal:new Float32Array([1,0,0,0,1,0,0,0,1])},b=new Float32Array(3),x=new Float32Array([.2,.2,.2,1]),S=Array.from({length:g},(e,t)=>({enabled:!1,position:new Float32Array([0,0,1,0]),ambient:new Float32Array([0,0,0,1]),diffuse:new Float32Array(t===0?[1,1,1,1]:[0,0,0,1]),specular:new Float32Array(t===0?[1,1,1,1]:[0,0,0,1])})),C={ambient:new Float32Array([.2,.2,.2,1]),diffuse:new Float32Array([.8,.8,.8,1]),specular:new Float32Array([0,0,0,1]),shininess:0},w=new Set([`projection`,`view`,`model`,`normal`,`eye`,`switches`,`globalAmbient`,`lights`,`material`]);e.vertexAttrib4f(p.COLOR,1,1,1,1),e.vertexAttrib3f(p.NORMAL,0,0,1);let T=new Set,E=(e,t)=>{T.has(e)||(T.add(e),console.warn(`[FF] ${t}`))},D=!1,O=`FF`,k=(e,t)=>{if(n){for(let n=0;n<t.length;n++)if(!Number.isFinite(t[n])){E(`nan-${e}`,`${e} contains NaN or Infinity (often a zero-length vector normalized, e.g., lookAt with forward parallel to up).`);return}}},A=e=>{if(!Number.isInteger(e)||e<0||e>=g)throw RangeError(`FF: light index ${e} is outside [0, ${g}). FF v1.0 has ${g} light.`)},j=e=>{if(e===`lighting`||e===`colorMaterial`)return e;throw Error(e===`texture2D`?`FF: TEXTURE_2D arrives in FF v1.1 (week 6).`:e===`fog`?`FF: FOG arrives in FF v1.2 (week 9).`:`FF: unknown capability "${e}".`)},M=()=>{e.useProgram(i),w.size!==0&&(w.has(`projection`)&&e.uniformMatrix4fv(s.projection,!1,l.projection),w.has(`view`)&&e.uniformMatrix4fv(s.view,!1,l.view),w.has(`model`)&&e.uniformMatrix4fv(s.model,!1,l.model),w.has(`normal`)&&e.uniformMatrix3fv(s.normalMatrix,!1,l.normal),w.has(`eye`)&&e.uniform3fv(s.eyePosition,b),w.has(`switches`)&&(e.uniform1i(s.lighting,+!!c.lighting),e.uniform1i(s.colorMaterial,+!!c.colorMaterial)),w.has(`globalAmbient`)&&e.uniform4fv(s.globalAmbient,x),w.has(`lights`)&&S.forEach((t,n)=>{e.uniform1i(s.lights[n].enabled,+!!t.enabled),e.uniform4fv(s.lights[n].position,t.position),e.uniform4fv(s.lights[n].ambient,t.ambient),e.uniform4fv(s.lights[n].diffuse,t.diffuse),e.uniform4fv(s.lights[n].specular,t.specular)}),w.has(`material`)&&(e.uniform4fv(s.material.ambient,C.ambient),e.uniform4fv(s.material.diffuse,C.diffuse),e.uniform4fv(s.material.specular,C.specular),e.uniform1f(s.material.shininess,C.shininess)),w=new Set)},N=()=>{n&&(e.getVertexAttrib(p.POSITION,e.VERTEX_ATTRIB_ARRAY_ENABLED)||E(`no-position`,`No position data bound: did you bind your VAO?`),c.lighting&&(S.some(e=>e.enabled)||E(`no-light`,`Lighting is on but every light is disabled; only global ambient will show.`),D&&E(`stale-normal`,`Normal matrix may be stale: the model matrix changed but setNormalMatrix was not called (lecture 2B/9A).`),!c.colorMaterial&&e.getVertexAttrib(p.COLOR,e.VERTEX_ATTRIB_ARRAY_ENABLED)&&E(`color-ignored`,`Vertex colors are ignored under lighting unless COLOR_MATERIAL is enabled.`)))},P=()=>{if(!n)return;let t=e.getError();if(t===e.NO_ERROR)return;let r={[e.INVALID_ENUM]:`INVALID_ENUM`,[e.INVALID_VALUE]:`INVALID_VALUE`,[e.INVALID_OPERATION]:`INVALID_OPERATION`,[e.OUT_OF_MEMORY]:`OUT_OF_MEMORY`,[e.CONTEXT_LOST_WEBGL]:`CONTEXT_LOST_WEBGL`};E(`gl-${t}-${O}`,`GL error ${r[t]??t} after ${O}.`)};return{version:f,maxLights:g,program:i,enable(e){c[j(e)]=!0,w.add(`switches`)},disable(e){c[j(e)]=!1,w.add(`switches`)},isEnabled(e){return c[j(e)]},setColor(t){let n=_(t);e.vertexAttrib4f(p.COLOR,n[0],n[1],n[2],n[3])},setNormal(t){e.vertexAttrib3f(p.NORMAL,t[0],t[1],t[2])},setProjectionMatrix(e){k(`projection matrix`,e),l.projection.set(e),w.add(`projection`)},setViewMatrix(e){k(`view matrix`,e),l.view.set(e);let t=a(r(),l.view);t?b.set([t[12],t[13],t[14]]):E(`view-singular`,`View matrix is not invertible; the eye position was not updated.`),w.add(`view`).add(`eye`)},setModelMatrix(e){k(`model matrix`,e),l.model.set(e),D=!0,w.add(`model`)},setNormalMatrix(e){k(`normal matrix`,e),l.normal.set(e),D=!1,w.add(`normal`)},setGlobalAmbient(e){x.set(_(e)),w.add(`globalAmbient`)},setLight(e,t){A(e);let n=t;if([`constantAttenuation`,`linearAttenuation`,`quadraticAttenuation`,`spotDirection`,`spotCutoff`,`spotExponent`].some(e=>n[e]!==void 0)||t.position&&t.position[3]!==0)throw Error(`FF: positional and spot lights arrive in FF v1.2 (week 9). Use a directional light (position w = 0).`);let r=S[e];t.position&&r.position.set(t.position),t.ambient&&r.ambient.set(_(t.ambient)),t.diffuse&&r.diffuse.set(_(t.diffuse)),t.specular&&r.specular.set(_(t.specular)),w.add(`lights`)},enableLight(e){A(e),S[e].enabled=!0,w.add(`lights`)},disableLight(e){A(e),S[e].enabled=!1,w.add(`lights`)},setMaterial(e){if(e.emissive!==void 0)throw Error(`FF: emissive arrives in FF v1.1 (week 6).`);if(e.shininess!==void 0&&!(e.shininess>=0&&e.shininess<=128))throw RangeError(`FF: shininess ${e.shininess} is outside [0, 128].`);e.ambient&&C.ambient.set(_(e.ambient)),e.diffuse&&C.diffuse.set(_(e.diffuse)),e.specular&&C.specular.set(_(e.specular)),e.shininess!==void 0&&(C.shininess=e.shininess),w.add(`material`)},flush:M,drawArrays(t,n,r){O=`drawArrays`,M(),N(),e.drawArrays(t,n,r),P()},drawElements(t,n,r,i){O=`drawElements`,M(),N(),e.drawElements(t,n,r,i),P()},getState(){let e=e=>Object.freeze(Array.from(e));return Object.freeze({version:f,capabilities:Object.freeze({...c}),matrices:Object.freeze({projection:e(l.projection),view:e(l.view),model:e(l.model),normal:e(l.normal)}),eyePosition:e(b),globalAmbient:e(x),lights:Object.freeze(S.map(t=>Object.freeze({enabled:t.enabled,position:e(t.position),ambient:e(t.ambient),diffuse:e(t.diffuse),specular:e(t.specular)}))),material:Object.freeze({ambient:e(C.ambient),diffuse:e(C.diffuse),specular:e(C.specular),shininess:C.shininess})})}}}var x=[135/255,206/255,235/255,1],S=1024,C=[-10,-1,-10,10,-1,-10,10,-1,10,-10,-1,10],w=[0,1,2,0,2,3],T=[.3,.5,.3,1],E=[[0,1,1,1],[1,0,1,1],[1,1,0,1]],D=new Float32Array([-.5,-.5,.5,0,0,1,.5,-.5,.5,0,0,1,.5,.5,.5,0,0,1,-.5,.5,.5,0,0,1,.5,-.5,-.5,0,0,-1,-.5,-.5,-.5,0,0,-1,-.5,.5,-.5,0,0,-1,.5,.5,-.5,0,0,-1,.5,-.5,.5,1,0,0,.5,-.5,-.5,1,0,0,.5,.5,-.5,1,0,0,.5,.5,.5,1,0,0,-.5,-.5,-.5,-1,0,0,-.5,-.5,.5,-1,0,0,-.5,.5,.5,-1,0,0,-.5,.5,-.5,-1,0,0,-.5,.5,.5,0,1,0,.5,.5,.5,0,1,0,.5,.5,-.5,0,1,0,-.5,.5,-.5,0,1,0,-.5,-.5,-.5,0,-1,0,.5,-.5,-.5,0,-1,0,.5,-.5,.5,0,-1,0,-.5,-.5,.5,0,-1,0]),O=new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),k=.8,A=.1;function j(e){let t=e.getContext(`webgl2`);if(!t)throw Error(`WebGL2 is not available.`);return t}function M(e,t){let n=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),n}function N(e,t){let n=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bufferData(e.ELEMENT_ARRAY_BUFFER,t,e.STATIC_DRAW),n}function P(e,t,n){let r=e.createVertexArray();return e.bindVertexArray(r),e.bindBuffer(e.ARRAY_BUFFER,t),e.enableVertexAttribArray(p.POSITION),e.vertexAttribPointer(p.POSITION,3,e.FLOAT,!1,24,0),e.enableVertexAttribArray(p.NORMAL),e.vertexAttribPointer(p.NORMAL,3,e.FLOAT,!1,24,12),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n),e.bindVertexArray(null),r}function F(e,t){t.width=S,t.height=768,e.viewport(0,0,t.width,t.height),e.clearColor(...x),e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE)}function I(e){e.enable(m),e.setGlobalAmbient([.2,.2,.2,1]),e.setLight(0,{position:[1,1,.5,0],diffuse:[1,1,1,1]}),e.enableLight(0);let t=l(r(),[0,1.5,4],[0,0,0],[0,1,0]);e.setViewMatrix(t);let n=c(r(),Math.PI/4,S/768,.1,100);e.setProjectionMatrix(n)}var L={angle:0,colorIndex:0,rotating:!0},R=!1,z=!1;function B(){window.addEventListener(`keydown`,e=>{e.code===`Space`&&e.preventDefault(),!e.repeat&&(e.code===`Space`&&(R=!0),e.code===`KeyR`&&(z=!0))})}function V(){R&&(L.colorIndex=(L.colorIndex+1)%E.length),z&&(L.rotating=!L.rotating),R=!1,z=!1}function H(e){L.rotating&&(L.angle+=k*e)}var U=r(),W=t();function G(e,t,r){o(U,L.angle),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT);for(let i of r){let r=i.color;t.setMaterial({ambient:r,diffuse:r}),t.setModelMatrix(i.modelMatrix),t.setNormalMatrix(n(W,i.modelMatrix)),e.bindVertexArray(i.vao),t.drawElements(e.TRIANGLES,i.indexCount,e.UNSIGNED_SHORT,0)}}function K(e){let t=j(e),n=b(t,{debug:!0}),i=P(t,M(t,new Float32Array(C)),N(t,new Uint16Array(w))),a=P(t,M(t,D),N(t,O));F(t,e),I(n),B();let o=[{vao:i,indexCount:w.length,modelMatrix:r(),color:T},{vao:a,indexCount:O.length,modelMatrix:U,color:E[L.colorIndex]}];L.colorIndex=2;let s=null;function c(e){s===null&&(s=e);let r=Math.min((e-s)/1e3,A);s=e,V(),H(r),G(t,n,o),requestAnimationFrame(c)}requestAnimationFrame(c)}var q=document.createElement(`canvas`);document.getElementById(`stage`).append(q),K(q);