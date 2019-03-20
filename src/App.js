import React from 'react';

	

class App extends React.Component {
  render() {
    return (
    	<a-scene ar stats >
    		<Earth />
    		<Camera />
		</a-scene>
	)
  }
}


class Boat extends React.Component {
	render() {
		return (
			<a-entity a-location="lat:57.1186191; lon:-2.1397003393363447; radius:0.1; mode:relative; elevation:0">
				<a-entity rotation="-90 0 0">
					<a-gltf-model scale="0.00001 0.00001 0.00001" src="boat.glb">
					</a-gltf-model>
				</a-entity>
			</a-entity>
		)
	}
}




class Earth extends React.Component{
	render() {
		return ( 
			<a-entity id="world" position="0 0 -0.4" visible="true" a-terrain="
	                observer:camera;
	                radius:0.1;
	                observer:camera;
	            ">
	            <Boat />
			</a-entity>
		)
	}
}


class Camera extends React.Component{
	render() {
		return ( 
    		<a-entity id="cameraRig">
				<a-entity
				    id="camera"
				    camera="fov: 45; near:5; far:10"
				    position="0 0 0"
				    orbit-controls="
				        target: #world;
				        minDistance:1000;
				        maxDistance:5000;
				        minPolarAngle:0.1;
				        maxPolarAngle:3.04159265359;
				        enableProportionalVelocity:true;
				    ">
				</a-entity>
			</a-entity>
		)
	}
}


export default App;