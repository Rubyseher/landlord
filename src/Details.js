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
               <p><b>Start Date </b>{moment(this.state.DB[this.props.location.state.id]["Start_Date"],"M/D/YY").format("Do MMMM, YYYY") }</p>
               <p><b>RR No </b>{this.state.DB[this.props.location.state.id]["RR_No"]}</p>
               <p><b>Acc ID </b>{this.state.DB[this.props.location.state.id]["Acc_ID"]}</p>
               <p><b>MR Code </b>{this.state.DB[this.props.location.state.id]["MR_Code"]}</p>
			   <p><b>ID Proof </b>{this.state.DB[this.props.location.state.id]["ID"]}</p>
               <p><b>Rent Amount</b>{this.state.DB[this.props.location.state.id]["Rent"]}</p>

             <h3>Paid Rent</h3>
               <center>
               <table>
               {this.state.DB[this.props.location.state.id]["Paid_Rent"]? <tr>
                  <th>Mon</th>
                  <th><i class="fa fa-calendar" aria-hidden="true" style={{color:"black", fontSize:20, marginTop:0}}></i></th>
                  <th><i class="fa fa-home" aria-hidden="true" style={{color:"black", fontSize:22, marginTop:0}}></i></th>
                  <th> <i class="fa fa-lightbulb-o" aria-hidden="true" style={{color:"black", fontSize:22, marginTop:0}}></i></th>
                  <th><i class="fa fa-tint" aria-hidden="true" style={{color:"black", fontSize:22, marginTop:0}}></i></th>
                  <th><i class="fa fa-trash" aria-hidden="true" style={{color:"black", fontSize:22, marginTop:0}}></i></th>
                  <th>Total</th>

               </tr>:<tr><td></td><td></td><td></td><td>Not Payments Yet</td><td></td><td></td><td></td></tr>}
               {  this.state.DB[this.props.location.state.id]["Paid_Rent"]?
                  this.state.DB[this.props.location.state.id]["Paid_Rent"].map(p=>
                  <tr>
                     <td class="Tabledes">{moment(this.state.DB[this.props.location.state.id]["Start_Date"],"M/D/YY").add(p.Month ,"M").format("MMM")}</td>
                     <td class="Tabledes">{ moment(p.Date,"M/D/YY").format("D-MMM-YY")}</td>
                     <td class="Tabledes">{p.Amount?p.Amount:0}</td>
                     <td class="Tabledes">{p.EB?p.EB:0}</td>
                     <td class="Tabledes">{p.Water?p.Water:0}</td>
                     <td class="Tabledes">{p.BBMP?p.BBMP:0}</td>
                     <td class="Tabledes">{(p.Amount?p.Amount:0)+(p.EB?p.EB:0)+(p.Water?p.Water:0)+(p.BBMP?p.BBMP:0)}</td>
                  </tr>
                  ):null
               }
               </table>

            <h3>Renewals</h3>
            {  this.state.DB[this.props.location.state.id]["Renewal"]?
               this.state.DB[this.props.location.state.id]["Renewal"].map(p=>
                 <p>{moment(p.Date ,"M/D/YY").format("Do MMMM, YYYY")}</p>
			 ):<tr><td></td><td>Not Renewed Yet</td><td></td></tr>
            }
			<h3>Deductions</h3>
			<table>
			{this.state.DB[this.props.location.state.id]["Deduction"]? <tr>
			   <th>Date</th>
			   <th>Amount</th>
			   <th>Reason</th>
		   </tr> : null}
            {  this.state.DB[this.props.location.state.id]["Deduction"]?
               this.state.DB[this.props.location.state.id]["Deduction"].map(p=>
				   <tr>
				   <td>{moment(p.Date ,"M/D/YY").format("D-MMM-YY")}</td>
				   <td>{p.Amount}</td>
                 	<td>{p.Reason}</td>
				 </tr>
			 ):<tr><td></td><td>No Deductions Yet</td><td></td></tr>
            }
			</table>
			<h3>Waivers</h3>
			<table>
			{this.state.DB[this.props.location.state.id]["Waiver"]? <tr>
			   <th>Date</th>
			   <th>Amount</th>
			   <th>Reason</th>
		   </tr> : null}
            {  this.state.DB[this.props.location.state.id]["Waiver"]?
               this.state.DB[this.props.location.state.id]["Waiver"].map(p=>
				   <tr>
				   <td>{moment(p.Date ,"M/D/YY").format("D-MMM-YY")}</td>
				   <td>{p.Amount}</td>
                 	<td>{p.Reason}</td>
				 </tr>
			 ):<tr><td></td><td>No Waivers Yet</td><td></td></tr>
            }
			</table>
			</center>

            <div class="buttoncont">
                     <div class="rect" onClick={() => this.AddPaymentRedirect()}style={{ backgroundColor: '#0057e0',color:"white",width:"46%"}}>
          	 	     <i class="fa fa-plus" aria-hidden="true"></i></div>
                     <div class="rect" onClick={() => this.EditRedirect()}style={{ backgroundColor: '#7d7d7d',color:"white",width:"46%"}}>
                     <i class="fa fa-pencil" aria-hidden="true"></i></div>
                     </div>
            </div>
        )
  }
}

export default Details;
