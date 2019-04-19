import React from 'react';


class App extends React.Component {
    render() {
        return (
            <a-scene ar stats >
                <Earth />
                <Popup />
                <Camera />
            </a-scene>
        )
    }
}


class Boat extends React.Component {
    render() {
        return (
            <a-entity a-location="lat:60.27432; lon:-1.08595; radius:0.15; mode:relative; elevation:0">
                <a-entity rotation="-90 0 0">
                    <a-gltf-model ship-events scale="0.00002 0.00002 0.00002" src="boat.glb">
                    </a-gltf-model>
                    <a-animation begin="click" attribute="rotation" to="0 0 360" easing="linear" dur="2000" fill="backwards"/>
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
	                radius:0.15;
	                observer:camera;
	            ">
                <Boat />
            </a-entity>
        )
    }
}


class Popup extends React.Component{

    render() {
        return (
            <div className="modal fade" id="shipPopup" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                           testicle
                        </div>
                        <div className="modal-footer">
                            <button id="closePopup" type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
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
                    <a-entity position="0 0 -0.2"
                              geometry="primitive: ring; radiusInner: 0.005; radiusOuter: 0.01;"
                              material="color: cyan; shader: flat"
                              cursor="maxDistance: 30; fuse: true">
                        <a-animation begin="click" easing="ease-in" attribute="scale" fill="forwards" from="0.2 0.2 0.2" to="1 1 1" dur="150"/>
                        <a-animation begin="fusing" easing="ease-in" attribute="scale" fill="backwards" from="1 1 1" to="0.2 0.2 0.2" dur="1500"/>
                    </a-entity>
                </a-entity>
            </a-entity>
        )
    }
}


export default App;