// import this.state.DB from './data.json';
import React from 'react';
import Firebase from 'firebase';
import config from './config';
import { Redirect, Router } from 'react-router';
import DB from './DB';

class AddPayment extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         DB:null,
         redirect:null
      };

      if(DB.data) this.setState({DB: DB.data})
      else if (!Firebase.apps.length) {
         Firebase.initializeApp(config);
         this.getUserData()
         console.log(this.state.DB);
        }
   }
   EditRedirect= () => {
		this.setState({redirect:"/Edit"})
	}

   getUserData = () => {
       if(DB.data) {
           this.setState({DB: DB.data})
           return
       }
      let ref = Firebase.database().ref('/');
      ref.on('value', snapshot => {
         this.setState({ DB: snapshot.val()});
         DB.data = snapshot.val();
      });
   }
   componentDidMount() {
      this.getUserData();
   }

	render() {
      if(this.state.redirect!==null)
         return <Redirect push to={{
            pathname: this.state.redirect,
            state: { id: this.props.location.state.id }
         }} />
         return(
    			this.state.DB && <div id="container">
                <h1>Add Payment</h1>
    		    <h3>{this.state.DB[this.props.location.state.id].Name}</h3>

             <h3>Paid Rent:</h3>
               <center>
               <table>
               <tr>
                  <th>Month:</th>
                  <th>Date:</th>
                  <th>Amount:</th>
               </tr>
               {  this.state.DB[this.props.location.state.id]["Paid_Rent"]?
                  this.state.DB[this.props.location.state.id]["Paid_Rent"].slice(this.state.DB[this.props.location.state.id]["Paid_Rent"].length - 3).map(p=>
                  <tr>
                     <td>{p.Month}</td>
                     <td>{p.Date}</td>
                     <td>{p.Amount}</td>
                  </tr>
                  ):null
               }
               </table>
               </center>
               <br/><br/>

                 <input type="number" name="Rent" value={this.state.Rent} onChange={this.handleChange} placeholder="Rent"/><br/><br/>
                 <input type="number" name="EB" value={this.state.EB} onChange={this.handleChange} placeholder="EB"/><br/><br/>
                 <input type="number" name="Water" value={this.state.Water} onChange={this.handleChange} placeholder="Water"/><br/><br/>
                 <input type="number" name="BBMP" value={this.state.BBMP} onChange={this.handleChange} placeholder="BBMP"/><br/><br/>
<br/><br/>
               <div class="rect" onClick={() => this.EditRedirect()}style={{ backgroundColor: '#0057e0',color:"white"}}>
               <i class="fa fa-check" aria-hidden="true"></i></div>
          </div>
        )
  }
}

export default AddPayment;
