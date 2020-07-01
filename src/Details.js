import React from 'react';
import DB from './data.json';

class Details extends React.Component {
    constructor(props) {
        super(props)
        console.log(props);
    }
	render() {
        return(
    		<div id="container">
    		<h1>{DB[this.props.location.state.id].Name}</h1>

             <p><b>Start Date:</b>{DB[this.props.location.state.id]["Start Date"]}</p>
             <p><b>RR No:</b>{DB[this.props.location.state.id]["RR No"]}</p>
             <p><b>Acc ID:</b>{DB[this.props.location.state.id]["Acc ID"]}</p>
             <p><b>MR Code:</b>{DB[this.props.location.state.id]["MR Code"]}</p>
             <p><b>ID:</b>{DB[this.props.location.state.id]["ID"]}</p>

    <h3>Paid Rent:</h3>
    <center>
        <table>
          <tr>

             <th>Month:</th>
             <th>Date:</th>
             <th>Amount:</th>
          </tr>
             {   DB[this.props.location.state.id]["Paid Rent"].map(p=>
            <tr>
              <td>{p.Month}</td>
              <td>{p.Date}</td>
              <td>{p.Amount}</td>
            </tr>
            )
            }
          </table>
          </center>

          <h3>Renewal Date:</h3>
             {DB[this.props.location.state.id]["Renewal"]?
                 DB[this.props.location.state.id]["Renewal"].map(p=>
              <p>{p.Date}</p>
            ):null
              }
          </div>
        )
  }
}

export default Details;
