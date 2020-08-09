// import this.state.DB from './data.json';
import React from 'react';
import Firebase from 'firebase';
import config from './config';
import {Redirect} from 'react-router';
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

   checkRent = (id) => {
	   if(!this.state.DB[id]["Paid_Rent"])
		   return -1;
	   else if (this.state.DB[id]["Paid_Rent"].length<1) return -1;

	   let paid = this.state.DB[id]["Paid_Rent"].sort((a,b) => {return a.Month-b.Month})
	   let expected = [], due = [], dueTotal = 0;

	   paid.forEach((p,i) => {
		   if(this.state.DB[id].Renewal) {
			   if(this.state.DB[id].Renewal.length>0) {
				   let period = p.Month/11
				   if(period<=1) expected.push(this.state.DB[id].Rent);
				   else expected.push(this.state.DB[id].Rent*(1.05*Math.floor(period)));
			   }
		   } else expected.push(this.state.DB[id].Rent);
		   if(p.Month !== paid[0].Month+i) {
			   let diff = p.Month - paid[i-1].Month - 1;

			   for(let i=diff; i>0; i--) {
				   due.push({
					   month: p.Month-i,
					   amount: expected[i]
				   })
				   dueTotal += expected[i]
			   }
		   }
		   let due_i = expected[i]-p['Amount']
		   if(due_i!==0){
			   due.push({
				   month: p.Month,
				   date: p.Date,
				   amount: due_i
			   })
			   dueTotal += due_i
		   }
	   });
	   return dueTotal
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
               <p><b>Start Date &nbsp;&nbsp;</b>{moment(this.state.DB[this.props.location.state.id]["Start_Date"],"M/D/YY").format("Do MMMM, YYYY") }</p>
               <p><b>RR No &nbsp;&nbsp;</b>{this.state.DB[this.props.location.state.id]["RR_No"]}</p>
               <p><b>Acc ID &nbsp;&nbsp;</b>{this.state.DB[this.props.location.state.id]["Acc_ID"]}</p>
               <p><b>MR Code &nbsp;&nbsp;</b>{this.state.DB[this.props.location.state.id]["MR_Code"]}</p>
               <p><b>ID Proof &nbsp;&nbsp;</b>{this.state.DB[this.props.location.state.id]["ID"]}</p>
			      <p><b>Advance &nbsp;&nbsp;</b>{this.state.DB[this.props.location.state.id]["Advance"]}</p>
			      <p><b>Rent Amount &nbsp;&nbsp;</b>{this.state.DB[this.props.location.state.id]["Rent"]}</p>
               <p><b>Rent Due &nbsp;&nbsp;</b><span style={this.checkRent(this.props.location.state.id)!==0?{color:"red",fontWeight:'bold'}:{color:'#336914', fontWeight:'bold'}}>{this.checkRent(this.props.location.state.id)===-1?"No Data":this.checkRent(this.props.location.state.id)}</span></p>
			   <br/><hr style={{width:'60%'}}/><br/>
             <h3>Paid Rent</h3>
               <center>
               <table>
               {this.state.DB[this.props.location.state.id]["Paid_Rent"]? <tr>
                  <th class="Tabledes">Mon</th>
                  <th class="Tabledes"><i class="fa fa-calendar" aria-hidden="true" style={{color:"black", fontSize:20, marginTop:0}}></i></th>
                  <th class="Tabledes"><i class="fa fa-home" aria-hidden="true" style={{color:"black", fontSize:22, marginTop:0}}></i></th>
                  <th class="Tabledes"> <i class="fa fa-lightbulb-o" aria-hidden="true" style={{color:"black", fontSize:22, marginTop:0}}></i>&nbsp;|&nbsp;
                  <i class="fa fa-tint" aria-hidden="true" style={{color:"black", fontSize:22, marginTop:0}}></i>&nbsp;|&nbsp;
                  <i class="fa fa-trash" aria-hidden="true" style={{color:"black", fontSize:22, marginTop:0}}></i></th>

                  <th class="Tabledes">Total</th>

               </tr>:<tr><td></td><td></td><td></td><td>No Payments Yet</td><td></td><td></td><td></td></tr>}
               {  this.state.DB[this.props.location.state.id]["Paid_Rent"]?
                  this.state.DB[this.props.location.state.id]["Paid_Rent"].map(p=>
                  <tr>
                     <td  class="Tabledes">{moment(this.state.DB[this.props.location.state.id]["Start_Date"],"M/D/YY").add(p.Month ,"M").format("MMM")}</td>
                     <td  class="Tabledes">{ moment(p.Date,"M/D/YY").format("D-MMM-YY")}</td>
                     <td  class="Tabledes" style={p.Amount === this.state.DB[this.props.location.state.id]["Rent"] ? {color:'#336914', fontWeight:'bold'} : {}}>{p.Amount?p.Amount:0}</td>
                     <td class="Tabledes">{p.Others?p.Others:0}</td>
                     <td class="Tabledes">{parseInt(p.Amount?p.Amount:0)+parseInt(p.Others?p.Others:0)}</td>
                  </tr>
                  ):null
               }
               </table>
			   <br/><hr style={{width:'60%'}}/><br/>


            <h3>Renewals</h3>
            {  this.state.DB[this.props.location.state.id]["Renewal"]?
               this.state.DB[this.props.location.state.id]["Renewal"].map(p=>
                 <p>{moment(p.Date ,"M/D/YY").format("Do MMMM, YYYY")}</p>
			 ):<tr><td></td><td>Not Renewed Yet</td><td></td></tr>
            }
			<br/><hr style={{width:'60%'}}/><br/>


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
			<br/><hr style={{width:'60%'}}/><br/>


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
			<br/><br/><br/>
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
