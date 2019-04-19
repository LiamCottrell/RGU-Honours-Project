!function(e){function t(i){if(a[i])return a[i].exports;var r=a[i]={exports:{},id:i,loaded:!1};return e[i].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t,a){a(6),a(5),a(4),a(3),a(1),a(2)},function(e,t){AFRAME.registerComponent("ar-camera",{schema:{enabled:{default:!0}},init:function(){this.wasLookControlsEnabled=this.el.getAttribute("look-controls","enabled")},update:function(e){e&&e.enabled===this.data.enabled||(this.data.enabled?(this.wasLookControlsEnabled=this.el.getAttribute("look-controls","enabled"),this.el.setAttribute("look-controls","enabled",!1)):this.el.setAttribute("look-controls","enabled",this.wasLookControlsEnabled===!0))},tick:function(e,t){if(this.data.enabled){var a=this.checkWhichAR();a&&(this.el.setAttribute("position",a.getPosition()),this.el.setAttribute("rotation",a.getRotation()),this.el.sceneEl.is("vr-mode")||(this.el.components.camera.camera.projectionMatrix=a.getProjectionMatrix()))}},checkWhichAR:function(){if(!this.whichar){var e=this.el.sceneEl.components["three-ar"];if(e&&e.arDisplay||(e=this.el.sceneEl.components["mozilla-xr-ar"]),!e||!e.arDisplay)return;this.whichar=e}return this.whichar}})},function(e,t){AFRAME.registerComponent("ar-raycaster",{dependencies:["raycaster"],schema:{x:{default:.5},y:{default:.5},el:{type:"selector"}},init:function(){this.raycaster=this.el.components.raycaster.raycaster,this.raycasterIntersectObjects=this.raycaster.intersectObjects.bind(this.raycaster),this.raycaster.intersectObjects=this.intersectObjects.bind(this)},update:function(e){this.data.el||this.el.sceneEl.object3D.el||(this.el.sceneEl.object3D.el=this.el.sceneEl)},intersectObjects:function(e,t){var a=this.raycasterIntersectObjects(e,t);return a.concat(this.hitAR())},hitAR:function(){var e=this.checkWhichAR();return e&&e.arDisplay?e.hitAR(this.data.x,this.data.y,this.data.el,this.el):[]},checkWhichAR:function(){if(!this.whichar){var e=this.el.sceneEl.components["three-ar"];if(e&&e.arDisplay||(e=this.el.sceneEl.components["mozilla-xr-ar"]),!e||!e.arDisplay)return;this.whichar=e}return this.whichar}})},function(e,t){AFRAME.registerComponent("ar",{schema:{takeOverCamera:{default:!0},cameraUserHeight:{default:!1},hideUI:{default:!0}},dependencies:["three-ar-planes","mozilla-xr-ar"],init:function(){this.el.setAttribute("three-ar",{takeOverCamera:this.data.takeOverCamera,cameraUserHeight:this.data.cameraUserHeight}),this.el.setAttribute("mozilla-xr-ar",{takeOverCamera:this.data.takeOverCamera,cameraUserHeight:this.data.cameraUserHeight}),this.data.hideUI&&this.el.sceneEl.setAttribute("vr-mode-ui",{enabled:!1}),document.head.insertAdjacentHTML("beforeend","<style>html,body {background-color: transparent !important;}</style>")}})},function(e,t){AFRAME.registerComponent("mozilla-xr-ar",{schema:{takeOverCamera:{default:!0},cameraUserHeight:{default:!1}},init:function(){this.onInit=this.onInit.bind(this),this.onWatch=this.onWatch.bind(this),this.poseMatrix=new THREE.Matrix4,this.posePosition=new THREE.Vector3,this.poseQuaternion=new THREE.Quaternion,this.poseEuler=new THREE.Euler(0,0,0,"YXZ"),this.poseRotation=new THREE.Vector3,this.projectionMatrix=new THREE.Matrix4,this.viewMatrix=new THREE.Matrix4,this.onceSceneLoaded=this.onceSceneLoaded.bind(this),this.el.sceneEl.hasLoaded?(console.log("mozilla-xr-ar: hasLoaded, setTimeout"),setTimeout(this.onceSceneLoaded)):(console.log("mozilla-xr-ar: !hasLoaded, addEventListener"),this.el.sceneEl.addEventListener("loaded",this.onceSceneLoaded)),this.planes_=new Map,this.anchors_=new Map},takeOverCamera:function(e){this.arCamera=e,e.el.setAttribute("ar-camera","enabled",!0)},onceSceneLoaded:function(){if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.initAR){setTimeout(function(){var e=AFRAME.scenes[0];e.canvas.style.position="absolute !important",e.canvas.style.width="100% !important",e.canvas.style.height="100% !important",setTimeout(function(){e.resize()})},1e3),window.arkitCallback0=this.onInit,window.arkitCallback1=this.onWatch;var e={options:{ui:{browser:!0,points:!0,focus:!1,rec:!0,rec_time:!0,mic:!1,build:!1,plane:!0,warnings:!0,anchors:!1,debug:!0,statistics:!1}},callback:"arkitCallback0"};window.webkit.messageHandlers.initAR.postMessage(e)}},checkForARDisplay:function(){if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.watchAR){this.arDisplay=!0;var e={options:{location:!0,camera:!0,objects:!0,light_intensity:!0},callback:"arkitCallback1"};window.webkit.messageHandlers.watchAR.postMessage(e);var t=this,a=t.el.sceneEl;t.data.takeOverCamera&&setTimeout(function(){t.takeOverCamera(a.camera)}),a.renderer.setPixelRatio(1),a.renderer.autoClear=!1,a.renderer.setClearColor("#000",0),a.renderer.alpha=!0}},onInit:function(e){this.checkForARDisplay()},onWatch:function(e){this.frameData=e,this.handleFrame(e)},handleFrame:function(e){this.el.sceneEl;this.poseMatrix.fromArray(e.camera_transform),this.poseMatrix.decompose(this.posePosition,this.poseQuaternion,this.poseRotation),this.poseEuler.setFromQuaternion(this.poseQuaternion),this.poseRotation.set(THREE.Math.RAD2DEG*this.poseEuler.x,THREE.Math.RAD2DEG*this.poseEuler.y,THREE.Math.RAD2DEG*this.poseEuler.z),this.projectionMatrix.fromArray(e.projection_camera),this.viewMatrix.fromArray(e.camera_view),this.arCamera&&this.data.cameraUserHeight&&(this.posePosition.y+=this.arCamera.el.components.camera.data.userHeight);var t=this.posePosition.x||this.posePosition.y||this.posePosition.z||this.poseQuaternion.x||this.poseQuaternion.y||this.poseQuaternion.z;t?this.poseLost!==!1&&(this.poseLost=!1,this.el.emit("poseFound")):this.poseLost!==!0&&(this.poseLost=!0,this.el.emit("poseLost",!1));var a;if(e.newObjects&&e.newObjects.length)for(a=0;a<e.newObjects.length;a++){var i=e.newObjects[a];i.h_plane_center?this.planes_.set(i.uuid,{id:i.uuid,center:i.h_plane_center,extent:[i.h_plane_extent.x,i.h_plane_extent.z],modelMatrix:i.transform}):this.anchors_.set(i.uuid,{id:i.uuid,modelMatrix:i.transform})}if(e.removedObjects&&e.removedObjects.length)for(a=0;a<e.removedObjects.length;a++){var i=e.removedObjects[a];i.h_plane_center?this.planes_.delete(i.uuid):this.anchors_.delete(i.uuid)}if(e.objects&&e.objects.length)for(a=0;a<e.objects.length;a++){var i=e.objects[a];if(i.h_plane_center){var r=this.planes_.get(i.uuid);r?(r.center=i.h_plane_center,r.extent=[i.h_plane_extent.x,i.h_plane_extent.z],r.transform=i.transform):this.planes_.set(i.uuid,{id:i.uuid,center:i.h_plane_center,extent:[i.h_plane_extent.x,i.h_plane_extent.z],transform:i.transform})}else{var n=this.anchors_.get(i.uuid);n?n.transform=i.transform:this.anchors_.set(i.uuid,{id:i.uuid,transform:i.transform})}}},getPosition:function(){return this.arDisplay?this.posePosition:null},getOrientation:function(){return this.arDisplay?this.poseQuaternion:null},getRotation:function(){return this.arDisplay?this.poseRotation:null},getProjectionMatrix:function(){return this.arDisplay?this.projectionMatrix:null},getPlanes:function(){return Array.from(this.planes_.values())},hitTestNoAnchor:function(){function e(){return this.modelMatrix=new Float32Array(16),this}var t={rayStart:new THREE.Vector3,rayEnd:new THREE.Vector3,cameraPosition:new THREE.Vector3,cameraQuaternion:new THREE.Quaternion,projViewMatrix:new THREE.Matrix4,worldRayStart:new THREE.Vector3,worldRayEnd:new THREE.Vector3,worldRayDir:new THREE.Vector3,planeMatrix:new THREE.Matrix4,planeMatrixInverse:new THREE.Matrix4,planeExtent:new THREE.Vector3,planePosition:new THREE.Vector3,planeCenter:new THREE.Vector3,planeNormal:new THREE.Vector3,planeIntersection:new THREE.Vector3,planeIntersectionLocal:new THREE.Vector3,planeHit:new THREE.Matrix4},a=function(){var e=new THREE.Vector3;return function(t,a,i,r){var n=t.dot(r);return e.subVectors(a,i),e.dot(t)/n}}(),i=function(e,a){t.planeMatrix.fromArray(e.modelMatrix),t.planeIntersection.setFromMatrixPosition(t.planeMatrix);var i=t.planeIntersection.distanceTo(t.cameraPosition);t.planeMatrix.fromArray(a.modelMatrix),t.planeIntersection.setFromMatrixPosition(t.planeMatrix);var r=t.planeIntersection.distanceTo(t.cameraPosition);return i<r?-1:1};return function(r,n){if(r<0||r>1||n<0||n>1)throw new Error("hitTest - x and y values must be normalized [0,1]!");var s=[],o=this.getPlanes();if(!o||0==o.length)return s;t.rayStart.set(2*r-1,2*(1-n)-1,0),t.rayEnd.set(2*r-1,2*(1-n)-1,1),t.planeMatrix.multiplyMatrices(this.projectionMatrix,this.viewMatrix),t.projViewMatrix.getInverse(t.planeMatrix),t.worldRayStart.copy(t.rayStart).applyMatrix4(t.projViewMatrix),t.worldRayEnd.copy(t.rayEnd).applyMatrix4(t.projViewMatrix),t.worldRayDir.subVectors(t.worldRayEnd,t.worldRayStart).normalize();for(var l=0;l<o.length;l++){var c=o[l];t.planeMatrix.fromArray(c.modelMatrix),t.planeCenter.set(0,0,0),t.planePosition.copy(t.planeCenter).applyMatrix4(t.planeMatrix),t.planeNormal.set(0,1,0);var h=a(t.planeNormal,t.planePosition,t.worldRayStart,t.worldRayDir);if(!(h<0)){t.planeIntersectionLocal.copy(t.worldRayDir).multiplyScalar(h),t.planeIntersection.addVectors(t.worldRayStart,t.planeIntersectionLocal),t.planeExtent.set(c.extent[0],0,c.extent[1]),t.planeMatrixInverse.getInverse(t.planeMatrix),t.planeIntersectionLocal.copy(t.planeIntersection).applyMatrix4(t.planeMatrixInverse);var p=.0075;if(!(Math.abs(t.planeIntersectionLocal.x)>t.planeExtent.x/2+p||Math.abs(t.planeIntersectionLocal.z)>t.planeExtent.z/2+p)){t.planeHit.makeTranslation(t.planeIntersection.x,t.planeIntersection.y,t.planeIntersection.z);for(var d=new e,u=0;u<16;u++)d.modelMatrix[u]=t.planeHit.elements[u];d.i=l,s.push(d)}}}return s.sort(i),s}}(),hitAR:function(){var e=new THREE.Matrix4,t=new THREE.Vector3,a=new THREE.Quaternion,i=new THREE.Vector3,r=new THREE.Vector3;return function(n,s,o,l){if(!this.arDisplay)return[];var c=this.hitTestNoAnchor(n,s);return!c||c.length<=0?[]:(e.fromArray(c[0].modelMatrix),e.decompose(t,a,i),l.object3D.getWorldPosition(r),[{distance:t.distanceTo(r),point:t,object:o&&o.object3D||this.el.sceneEl.object3D}])}}()})},function(e,t){AFRAME.registerComponent("three-ar-planes",{dependencies:["three-ar"],init:function(){this.planes={},this.anchorsAdded=[],this.anchorsAddedDetail={type:"added",anchors:this.anchorsAdded},this.anchorsUpdated=[],this.anchorsUpdatedDetail={type:"updated",anchors:this.anchorsUpdated},this.anchorsRemoved=[],this.anchorsRemovedDetail={type:"removed",anchors:this.anchorsRemoved}},tick:function(e,t){var a=new THREE.Vector3(1,1,1),i=(new THREE.Vector3,new THREE.Matrix4),r=new THREE.Vector3,n=(new THREE.Vector3,new THREE.Quaternion);new THREE.Euler(0,0,0,"YXZ");return function(e,t){var s=this.el.components["three-ar"];if(s&&s.arDisplay){var o,l=s.arDisplay,c=l.getPlanes?l.getPlanes():l.anchors_,h=[],p=[],d=[],u={};for(o=0;c&&o<c.length;o++){var m,E=c[o],f=(void 0!==E.identifier?E.identifier:E.id).toString(),w=E.timestamp;u[f]=!0;var R=!this.planes[f],y=void 0!==w;if(R||!y||w!==this.planes[f].timestamp){var m={identifier:f};if(void 0!==w&&(m.timestamp=w),E.modelMatrix||E.transform?m.modelMatrix=E.modelMatrix||E.transform:(r.fromArray(E.position),n.fromArray(E.orientation),a.set(1,1,1),i.compose(r,n,a),m.modelMatrix=i.elements.slice()),m.extent=E.extent,E.center&&(m.center=E.center),E.polygon?m.vertices=E.polygon:E.vertices&&(m.vertices=E.vertices),R)h.push(m);else if(y)p.push(m);else{if(AFRAME.utils.deepEqual(m,this.planes[f]))continue;p.push(m)}y?this.planes[f]=m:(this.planes[f]={identifier:m.identifier,modelMatrix:m.modelMatrix.slice(),extent:m.extent.slice()},m.center&&(this.planes[f].center=m.center.slice()),m.vertices&&(this.planes[f].vertices=m.vertices.slice()))}}var x=this;Object.keys(x.planes).forEach(function(e){u[e]||(d.push(x.planes[e]),delete x.planes[e])}),this.anchorsAdded=h,h.length>0&&(this.anchorsAddedDetail.anchors=h,this.el.emit("anchorsadded",this.anchorsAddedDetail)),this.anchorsUpdated=p,p.length>0&&(this.anchorsUpdatedDetail.anchors=p,this.el.emit("anchorsupdated",this.anchorsUpdatedDetail)),this.anchorsRemoved=d,d.length>0&&(this.anchorsRemovedDetail.anchors=d,this.el.emit("anchorsremoved",this.anchorsRemovedDetail))}}}()})},function(e,t){AFRAME.registerComponent("three-ar",{schema:{takeOverCamera:{default:!0},cameraUserHeight:{default:!1}},init:function(){this.posePosition=new THREE.Vector3,this.poseQuaternion=new THREE.Quaternion,this.poseEuler=new THREE.Euler(0,0,0,"YXZ"),this.poseRotation=new THREE.Vector3,this.projectionMatrix=new THREE.Matrix4,this.onceSceneLoaded=this.onceSceneLoaded.bind(this),this.el.sceneEl.hasLoaded?setTimeout(this.onceSceneLoaded):this.el.sceneEl.addEventListener("loaded",this.onceSceneLoaded)},tick:function(e,t){if(this.arDisplay&&this.arDisplay.getFrameData){this.arView&&this.arView.render(),this.frameData||(this.frameData=new VRFrameData),this.arDisplay.getFrameData(this.frameData),this.posePosition.fromArray(this.frameData.pose.position),this.poseQuaternion.fromArray(this.frameData.pose.orientation),this.poseEuler.setFromQuaternion(this.poseQuaternion),this.poseRotation.set(THREE.Math.RAD2DEG*this.poseEuler.x,THREE.Math.RAD2DEG*this.poseEuler.y,THREE.Math.RAD2DEG*this.poseEuler.z),this.arCamera&&this.data.cameraUserHeight&&(this.posePosition.y+=this.arCamera.el.components.camera.data.userHeight);var a=this.posePosition.x||this.posePosition.y||this.posePosition.z||this.poseQuaternion.x||this.poseQuaternion.y||this.poseQuaternion.z;a?this.poseLost!==!1&&(this.poseLost=!1,this.el.emit("poseFound")):this.poseLost!==!0&&(this.poseLost=!0,this.el.emit("poseLost",!1)),this.projectionMatrix.fromArray(this.frameData.leftProjectionMatrix)}},takeOverCamera:function(e){this.arCamera=e,e.isARPerspectiveCamera=!0,e.vrDisplay=this.arDisplay,e.el.setAttribute("ar-camera","enabled",!0)},onceSceneLoaded:function(){var e=this;window.addEventListener("ardisplayconnect",function(){e.arDisplay||e.checkForARDisplay()}),this.checkForARDisplay()},checkForARDisplay:function(){var e=this;THREE.ARUtils.getARDisplay().then(function(t){if(e.arDisplay=t,t){var a=e.el.sceneEl;e.data.takeOverCamera&&setTimeout(function(){e.takeOverCamera(a.camera)}),a.renderer.alpha=!0,a.renderer.autoClearColor=THREE.ARUtils.isARKit(t),a.renderer.autoClearDepth=!0,e.arView=new THREE.ARView(t,a.renderer)}})},getPosition:function(){return this.arDisplay&&this.arDisplay.getFrameData?this.posePosition:null},getOrientation:function(){return this.arDisplay&&this.arDisplay.getFrameData?this.poseQuaternion:null},getRotation:function(){return this.arDisplay&&this.arDisplay.getFrameData?this.poseRotation:null},getProjectionMatrix:function(){return this.arDisplay&&this.arDisplay.getFrameData?this.projectionMatrix:null},hitAR:function(){var e=new THREE.Matrix4,t=new THREE.Vector3,a=new THREE.Quaternion,i=new THREE.Vector3,r=new THREE.Vector3;return function(n,s,o,l){if(!this.arDisplay||!this.arDisplay.hitTest)return[];var c=this.arDisplay.hitTest(n,s);return!c||c.length<=0?[]:(e.fromArray(c[0].modelMatrix),e.decompose(t,a,i),l.object3D.getWorldPosition(r),[{distance:t.distanceTo(r),point:t,object:o&&o.object3D||this.el.sceneEl.object3D}])}}()})}]);
