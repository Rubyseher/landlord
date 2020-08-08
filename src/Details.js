// import this.state.DB from './data.json';
import React from 'react';
import Firebase from 'firebase';
import config from './config';
import { Redirect, Router } from 'react-router';
import DB from './DB';

class Details extends React.Component {
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

    AddPaymentRedirect= () => {
		this.setState({redirect:"/AddPayment"})
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
    		    <h1>{this.state.DB[this.props.location.state.id].Name}</h1>
               <p><b>Start Date:</b>{this.state.DB[this.props.location.state.id]["Start_Date"]}</p>
               <p><b>RR No:</b>{this.state.DB[this.props.location.state.id]["RR_No"]}</p>
               <p><b>Acc ID:</b>{this.state.DB[this.props.location.state.id]["Acc_ID"]}</p>
               <p><b>MR Code:</b>{this.state.DB[this.props.location.state.id]["MR_Code"]}</p>
               <p><b>ID:</b>{this.state.DB[this.props.location.state.id]["ID"]}</p>

             <h3>Paid Rent:</h3>
               <center>
               <table>
               <tr>
                  <th>Month:</th>
                  <th>Date:</th>
                  <th>Amount:</th>
               </tr>
               {  this.state.DB[this.props.location.state.id]["Paid_Rent"]?
                  this.state.DB[this.props.location.state.id]["Paid_Rent"].map(p=>
                  <tr>
                     <td>{p.Month}</td>
                     <td>{p.Date}</td>
                     <td>{p.Amount}</td>
                  </tr>
                  ):null
               }
               </table>
               </center>

            <h3>Renewal Date:</h3>
            {  this.state.DB[this.props.location.state.id]["Renewal"]?
               this.state.DB[this.props.location.state.id]["Renewal"].map(p=>
                 <p>{p.Date}</p>
               ):null
            }
            <div class="rect" onClick={() => this.AddPaymentRedirect()}style={{ backgroundColor: '#d40d82',color:"white"}}>
    		<i class="fa fa-plus" aria-hidden="true"></i></div>
               <div class="rect" onClick={() => this.EditRedirect()}style={{ backgroundColor: '#8708c9',color:"white"}}>
               <i class="fa fa-pencil" aria-hidden="true"></i></div>
          </div>
        )
  }
}

export default Details;
