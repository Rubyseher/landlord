import React from 'react';
import DB from './data.json';

class Details extends React.Component {
    constructor(props) {
        super(props)
    }
	render() {
        return(
    		<div id="container">
    		<h1>{DB[this.props.id].Name}</h1>
            <p><b>Start Date: </b>{DB[this.props.id]["Start Date"]}</p>

    		</div>
    	)
    }
}

export default Details;
