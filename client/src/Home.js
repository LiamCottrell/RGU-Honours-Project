import React from 'react';
// const request = require('request');

const _ = require('underscore');


class Home extends React.Component {
    render() {
        return (
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                <header className="masthead mb-auto">
                    <div className="inner">
                        <h3 className="masthead-brand">Ship Honours Project</h3>
                        <nav className="nav nav-masthead justify-content-center">
                            <a className="nav-link active" href="/">Home</a>
                            <a className="nav-link" href="/world">World</a>
                            <a className="nav-link" href="/contact">Contact</a>
                        </nav>
                    </div>
                </header>

                <main role="main" className="inner cover">
                    <h1 className="cover-heading">Search for Boats.</h1>
                        <form action="world" method='get'>
                            <div className="form-group">
                                <label htmlFor="exampleFormControlSelect1">Filter Boat by MMSI</label>
                                <select className="form-control" id="boatmmsi" name="MMSI">
                                    <option value=''>All</option>
                                    <BoatOptions/>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Show Map</button>
                        </form>
                </main>

                <Footer/>
            </div>
        )
    }
}

class Footer extends React.Component {
    // Create a list of boat options from the dataset.
    render() {
        return (
            <footer className="mastfoot mt-auto">
                <div className="inner">
                    <p>Cover template for <a href="https://getbootstrap.com/">Bootstrap</a>, by <a
                        href="https://twitter.com/mdo">@mdo</a>, used by Liam Cottrell.</p>
                </div>
            </footer>
        )
    }
}

class BoatOptions extends React.Component {
    // Initialize the state
    constructor(props){
        super(props);
        this.state = {
            data: {}
        }
    }
    componentDidMount() {
        this.getData();
    }
    // Retrieves the list of items from the Express app
    getData = () => {
        fetch('/api/getData')
            .then(res => res.json())
            .then(data => this.setState({ data }))
    };
    // Create a list of boat options from the dataset.
    render() {
        const { data } = this.state;
        // console.log(data);
        const unique = _.countBy(data, function (o) {
            return o.MMSI;
        });
        // Return a list of option elements with the name of the MMSI and the quality of records.
        return Object.keys(unique).map(function (name, index) {
            return <option key={name} value={Object.keys(unique)[index]}>`{Object.keys(unique)[index]}` locations({Object.values(unique)[index]})</option>
        });
    }
}

export default Home;