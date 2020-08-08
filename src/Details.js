// import this.state.DB from './data.json';
import React from 'react';
import Firebase from 'firebase';
import config from './config';
import { Redirect, Router } from 'react-router';
import DB from './DB';
import moment from "moment";

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
               <p><b>Start Date:</b>{moment(this.state.DB[this.props.location.state.id]["Start_Date"],"M/D/YY").format("Do MMMM, YYYY") }</p>
               <p><b>RR No:</b>{this.state.DB[this.props.location.state.id]["RR_No"]}</p>
               <p><b>Acc ID:</b>{this.state.DB[this.props.location.state.id]["Acc_ID"]}</p>
               <p><b>MR Code:</b>{this.state.DB[this.props.location.state.id]["MR_Code"]}</p>
               <p><b>ID:</b>{this.state.DB[this.props.location.state.id]["ID"]}</p>

             <h3>Paid Rent:</h3>
               <center>
               <table>
               <tr>
                  <th>Month</th>
                  <th>Date</th>
                  <th>Rent</th>
                  <th>EB</th>
                  <th>Water</th>
                  <th>BBMP</th>
               </tr>
               {  this.state.DB[this.props.location.state.id]["Paid_Rent"]?
                  this.state.DB[this.props.location.state.id]["Paid_Rent"].map(p=>
                  <tr>
                     <td>{moment(this.state.DB[this.props.location.state.id]["Start_Date"],"M/D/YY").add(p.Month ,"M").format("MMM")}</td>
                     <td>{ moment(p.Date,"M/D/YY").format("D-MMM-YY")}</td>
                     <td>{p.Amount?p.Amount:0}</td>
                     <td>{p.EB?p.EB:0}</td>
                     <td>{p.Water?p.Water:0}</td>
                     <td>{p.BBMP?p.BBMP:0}</td>
                  </tr>
                  ):null
               }
               </table>
               </center>

            <h3>Renewal Date:</h3>
            {  this.state.DB[this.props.location.state.id]["Renewal"]?
               this.state.DB[this.props.location.state.id]["Renewal"].map(p=>
                 <p>{moment(p.Date ,"M/D/YY").format("Do MMMM, YYYY")}</p>
               ):null
            }
            <div class="buttoncont">
                     <div class="rect" onClick={() => this.AddPaymentRedirect()}style={{ backgroundColor: '#d40d82',color:"white",width:"46%"}}>
          	 	     <i class="fa fa-plus" aria-hidden="true"></i></div>
                     <div class="rect" onClick={() => this.EditRedirect()}style={{ backgroundColor: '#8708c9',color:"white",width:"46%"}}>
                     <i class="fa fa-pencil" aria-hidden="true"></i></div>
                     </div>
            </div>
        )
  }
}

export default Details;
