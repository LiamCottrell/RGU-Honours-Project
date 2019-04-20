import React from 'react';

import queryString from 'query-string'

const _ = require('underscore');
const randomColor = require('randomcolor'); // import the script


class App extends React.Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            id: null,
            data: {}
        }
    }
    componentDidMount() {
        const values = queryString.parse(this.props.location.search);
        if (values.MMSI) {
            this.getDataMMSI(values.MMSI);
        }


    }
    getDataMMSI = (id) => {
        fetch('/api/getData')
            .then(res => res.json())
            .then( data => _.where(data, { MMSI: parseInt(id, 10) } ))
            .then(data => this.setState({ id , data }))
    };

    render() {
        let { data }  = this.state;
        console.log(data);
        return (
            <a-scene ar stats >
                { data ? (
                    <Earth data = { data } />
                ) : (
                    <Earth />
                    )
                }
                <Popup />
                <Camera />
            </a-scene>
        )
    }
}


class EarthObj extends React.Component {
    render() {
        let myLat = null;
        let myLon = null;
        if (!this.props.Lat){
            myLat = 60.27432;
        } else {
            myLat = this.props.Lat
        }
        if (!this.props.Lon){
            myLon = -1.08595;
        } else {
            myLon = this.props.Lon;
        }
        let isBoat = this.props.boat;
        return (
            <a-entity a-location={
                'lat:' + myLat + ';'
                +'lon:' + myLon + ';'
                +'radius:0.15;'
                +'mode:relative;'
                +'elevation:0'}
            >
                {
                    isBoat ? (
                            <Boat data={this.props.data} />
                        )
                        :
                        (
                            <Trace traceColour={this.props.traceColour} />
                        )
                }

            </a-entity>
        )
    }
}

class Earth extends React.Component{
    render() {
        let boatPos = this.props.data;
        let traceColour = randomColor();

        return (
            <a-entity id="world" position="0 0 -0.4" visible="true" a-terrain="
	                observer:camera;
	                radius:0.15;
	                observer:camera;
	            ">
                { this.props.data ? (
                    Object.keys(boatPos).map(function(name, index){
                        if (index !== (Object.values(boatPos).length - 1)){
                            //Return Boat Traces
                            return (<EarthObj
                                        key={name}
                                        boat={false}
                                        traceColour={traceColour}
                                        Lat={Object.values(boatPos)[index].Latitude}
                                        Lon={Object.values(boatPos)[index].Longitude}
                                    />)
                        } else {
                            //Return Boat Model Object
                            return (<EarthObj
                                        key={name}
                                        boat={true}
                                        data={Object.values(boatPos)[index]}
                                        Lat={Object.values(boatPos)[index].Latitude}
                                        Lon={Object.values(boatPos)[index].Longitude}
                                    />)
                        }
                    })
                ) : (
                    null
                )
                }
            </a-entity>
        )
    }
}

class Boat extends React.Component{
    render() {
        console.log('this is the dom data');
        console.log(this.props.data);
        return (
            <a-entity  rotation="-90 0 0">
                <a-gltf-model
                    data-mmsi={this.props.data.MMSI}
                    data-recvtime={this.props.data.RecvTime.$date}
                    data-posacc={this.props.data.PositionAccuracy}
                    data-lat={this.props.data.Latitude}
                    data-lon={this.props.data.Longitude}
                    ship-events
                    scale="0.00002 0.00002 0.00002"
                    src="boat.glb"
                />
                {/*<a-animation begin="click" attribute="rotation" to="0 0 360" easing="linear" dur="2000" fill="backwards"/>*/}
            </a-entity>
        )
    }
}

class Trace extends React.Component{
    render() {
        let traceColour = this.props.traceColour;
        return (
            <a-box scale="0.0006 0.0006 0.0006" color={traceColour}/>
        );
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
                        <div id="shipContent" className="modal-body">
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
                    <a-entity position="0 0 -0.05"
                              geometry="primitive: ring; radiusInner: 0.0005; radiusOuter: 0.001;"
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