import React from 'react';
// import this.state.DB from './data.json';
import Firebase from 'firebase';
import config from './config';

class Details extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          DB:null
        };

        if (!Firebase.apps.length) {
          Firebase.initializeApp(config);
          this.getUserData()
          console.log(this.state.DB);
        }
    }

    getUserData = () => {
    let ref = Firebase.database().ref('/');
    ref.on('value', snapshot => {
      this.setState({ DB: snapshot.val()});
  		console.log(snapshot.val());
    });
  }
  componentDidMount() {
  this.getUserData();
}
	render() {
        return(
    			this.state.DB && <div id="container">
    		<h1>{this.state.DB[this.props.location.state.id].Name}</h1>

             <p><b>Start Date:</b>{this.state.DB[this.props.location.state.id]["Start Date"]}</p>
             <p><b>RR No:</b>{this.state.DB[this.props.location.state.id]["RR No"]}</p>
             <p><b>Acc ID:</b>{this.state.DB[this.props.location.state.id]["Acc ID"]}</p>
             <p><b>MR Code:</b>{this.state.DB[this.props.location.state.id]["MR Code"]}</p>
             <p><b>ID:</b>{this.state.DB[this.props.location.state.id]["ID"]}</p>

    <h3>Paid Rent:</h3>
    <center>
        <table>
          <tr>

             <th>Month:</th>
             <th>Date:</th>
             <th>Amount:</th>
          </tr>
             {   this.state.DB[this.props.location.state.id]["Paid Rent"].map(p=>
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
             {this.state.DB[this.props.location.state.id]["Renewal"]?
                 this.state.DB[this.props.location.state.id]["Renewal"].map(p=>
              <p>{p.Date}</p>
            ):null
              }
          </div>
        )
  }
}

export default Details;
