import React from 'react';

import queryString from 'query-string'

const _ = require('underscore');
const randomColor = require('randomcolor'); // import the script

let useSimple = false;


class App extends React.Component {
    // Initialize the state
    constructor(props) {
        super(props);
        this.state = {
            ships: [],
            data: {},
            tempData: {}
        }
    }

    componentDidMount() {
        const values = queryString.parse(this.props.location.search);
        if (values.simple === 'true'){
            useSimple = true
        }
        if (values.MMSI) {
            this.getDataMMSI(values.MMSI);
        } else {
            this.getRandomShips();
        }


    }

    getDataMMSI = (mmsi) => {
        fetch('/api/getData')
            .then(res => res.json())
            .then(data => _.where(data, {MMSI: parseInt(mmsi, 10)}))
            .then(data => this.setState({data}))
            .then(data => this.getShips(this.state.data))
            .then(ships => this.setState({ships}))

    };

    getRandomShips = () => {
        fetch('/api/getData')
            .then(res => res.json())
            .then(tempData => this.setState({tempData}))
            .then(data => this.chooseRandom(this.state.tempData, 10))
            .then(ships => this.setState({ships}))
            .then(data => this.getDataFromShip(this.state.tempData, this.state.ships))
            .then(data => this.setState({data}))
    };

    getDataFromShip = (data, ships) => {
        let tempObjs = [];
        ships.forEach(function (ship) {
            let result = _.where(data, {MMSI: parseInt(ship, 10)});
            result.forEach(function (allShip) {
                tempObjs.push(allShip);
            });
        });
        return tempObjs;
    };


    getShips = (data) => {
        // console.log(data);
        let items = _.countBy(data, function (o) {
            return o.MMSI
        });
        // console.log(items);
        return Object.keys(items).map(function (index) {
            return index;
        });
    };


    chooseRandom = (data, quantity) => {
        // console.log(data);
        let items = _.countBy(data, function (o) {
            return o.MMSI
        });

        return _.sample(Object.keys(items).map(function (index) {
            return index;
        }), quantity);
    };

    render() {
        let {data} = this.state;
        let {ships} = this.state;
        return (
            <a-scene ar stats>
                {
                    data ? (
                        <Earth ships={ships} data={data}/>
                    ) : (
                        <Earth/>
                    )
                }
                <Popup/>
                <Camera/>
            </a-scene>
        )
    }
}


class EarthObj extends React.Component {
    render() {
        let myLat = null;
        let myLon = null;
        if (!this.props.Lat) {
            myLat = 60.27432;
        } else {
            myLat = this.props.Lat
        }
        if (!this.props.Lon) {
            myLon = -1.08595;
        } else {
            myLon = this.props.Lon;
        }
        let isBoat = this.props.boat;
        // let colour = this.props.traceColour;
        return (
            <a-entity a-location={
                'lat:' + myLat + ';'
                + 'lon:' + myLon + ';'
                + 'radius:0.6;'
                + 'mode:relative;'
                + 'elevation:0'}
            >
                {
                    isBoat ? (
                        useSimple ?(
                            <SimpleBoat data={this.props.data} traceColour={this.props.traceColour}/>
                            ) : (
                            <Boat data={this.props.data}/>
                        )
                            ) : (
                            <Trace traceColour={this.props.traceColour}/>
                        )
                }

            </a-entity>
        )
    }
}

class Earth extends React.Component {
    render() {
        let boatPos = this.props.data;
        let ships = this.props.ships;


        return (
            <a-entity id="world" position="0 -0.20 -0.5" visible="true" a-terrain="
	                observer:camera;
	                radius:0.6;
	                observer:camera;
	            ">

                {
                    // IF i have data
                    this.props.data ? (
                        //Take for every value i have in the ship MMSI array
                        ships.map(function (mmsi) {
                            let traceColour = randomColor();
                            // Create local object where Boats in data have the provided MMSI
                            let rawSingleShip = _.where(boatPos, {MMSI: parseInt(mmsi, 10)});
                            console.log(rawSingleShip);
                            let singleShip = [];
                            if (rawSingleShip.length >= 25) {
                                let maxVal = 25;
                                let delta = Math.floor( rawSingleShip.length / maxVal );
                                for (let i = 0; i < rawSingleShip.length; i=i+delta) {
                                    singleShip.push(rawSingleShip[i]);
                                }
                                singleShip.push(rawSingleShip[rawSingleShip.length-1]);
                            } else {
                                singleShip = rawSingleShip;
                            }
                            return (
                                Object.keys(singleShip).map(function (index) {
                                    if ((Object.keys(singleShip).length - 1) !== parseInt(index)) {
                                        //Return Boat Traces
                                        return (<EarthObj
                                            key={index + mmsi}
                                            boat={false}
                                            traceColour={traceColour}
                                            Lat={Object.values(singleShip)[index].Latitude}
                                            Lon={Object.values(singleShip)[index].Longitude}
                                        />)
                                    } else {
                                        //Return Boat Model Object
                                        return (<EarthObj
                                            key={index + mmsi}
                                            boat={true}
                                            traceColour={traceColour}
                                            data={Object.values(singleShip)[index]}
                                            Lat={Object.values(singleShip)[index].Latitude}
                                            Lon={Object.values(singleShip)[index].Longitude}
                                        />)
                                    }
                                })
                            )
                        })
                    ) : (
                        null
                    )

                }

            </a-entity>
        )
    }
}

class Boat extends React.Component {
    render() {
        return (
            <a-entity rotation="-90 0 0"
                      data-mmsi={this.props.data.MMSI}
                      data-recvtime={this.props.data.RecvTime.$date}
                      data-posacc={this.props.data.PositionAccuracy}
                      data-lat={this.props.data.Latitude}
                      data-lon={this.props.data.Longitude}
                      ship-events
            >
                <a-gltf-model
                    scale="0.00002 0.00002 0.00002"
                    src="boat.glb"
                />
            </a-entity>
        )
    }
}

class SimpleBoat extends React.Component {
    render() {
        let traceColour = this.props.traceColour;
        return (
            <a-entity
                data-mmsi={this.props.data.MMSI}
                data-recvtime={this.props.data.RecvTime.$date}
                data-posacc={this.props.data.PositionAccuracy}
                data-lat={this.props.data.Latitude}
                data-lon={this.props.data.Longitude}
                ship-events
            >
                <a-box
                    scale="0.004 0.004 0.004"
                    color={traceColour}
                />
            </a-entity>
        );
    }
}

class Trace extends React.Component {
    render() {
        let traceColour = this.props.traceColour;
        return (
            <a-box scale="0.0006 0.0006 0.0006" color={traceColour}/>
        );
    }
}


class Popup extends React.Component {

    render() {
        return (
            <div className="modal fade" id="shipPopup" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Details about this Ship.</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div id="shipContent" className="modal-body">
                            You shouldn't see this...
                        </div>
                        <div className="modal-footer">
                            <button id="closePopup" type="button" className="btn btn-secondary"
                                    data-dismiss="modal">Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


class Camera extends React.Component {
    render() {
        return (
            <a-entity id="cameraRig">
                <a-entity
                    id="camera"
                    camera="fov: 45; near:1; far:10"
                    position="0 0 0">

                        <a-entity position="0 0 -0.05"
                                  geometry="primitive: ring; radiusInner: 0.0005; radiusOuter: 0.001;"
                                  material="color: cyan; shader: flat"
                                  cursor="maxDistance: 30; fuse: true">
                            <a-animation begin="click" easing="ease-in" attribute="scale" fill="forwards" from="0.2 0.2 0.2"
                                         to="1 1 1" dur="150"/>
                            <a-animation begin="fusing" easing="ease-in" attribute="scale" fill="backwards" from="1 1 1"
                                         to="0.2 0.2 0.2" dur="1500"/>
                    </a-entity>
                </a-entity>
            </a-entity>
        )
    }
}


export default App;