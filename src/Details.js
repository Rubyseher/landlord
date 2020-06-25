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
        // <style>
        // table, th, td {
        //   border:2px solid black;
        //   border-collapse: collapse;
        // }
        // th, td {
        //   padding: 15px;
        // }
        // </style>
        <table >
          <tbody style="border: 1px solid black;">
          <tr>
          <th>Start Date:</th>
             <th>RR No:</th>
             <th>Acc ID:</th>
             <th>MR Code:</th>
             <th>ID: </th>
           </tr>
           <tr>
             <td>{DB[this.props.id]["Start Date"]}</td>
             <td>{DB[this.props.id]["RR No"]}</td>
             <td>{DB[this.props.id]["Acc ID"]}</td>
             <td>{DB[this.props.id]["MR Code"]}</td>
             <td>{DB[this.props.id]["ID"]}</td>
           </tr>
           </tbody>
          </table>

        <table >
          <tbody style="border: 1px solid black;">
          <tr>
            <th>Paid Rent:</th>
             <th>Month:</th>
             <th>Date:</th>
             <th>Amount:</th>
          </tr>
             {   DB[this.props.id]["Paid Rent"].map(p=>
            <tr>
              <td>{p.Month}</td>
              <td>{p.Date}</td>
              <td>{p.Amount}</td>
            </tr>
            )
            }
             </tbody>
          </table>

          <table >
          <tbody style="border: 1px solid black;">
          <tr>
             <th>Renewal</th>
             <th>Month:</th>
             <th>Date:</th>
          </tr>
             {DB[this.props.id]["Renewal"]?
                 DB[this.props.id]["Renewal"].map(p=>
              <tr>
              <td>{p.Month}</td>
              <td>{p.Date}</td>
              </tr>
            ):null
              }
              </tbody>
          </table>
          </div>
        )
  }
}

export default Details;
