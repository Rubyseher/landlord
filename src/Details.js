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
   totalDeductable(){
      var sum=0
      var Deduction=this.state.DB[this.props.location.state.id]["Deduction"]
if (Deduction)
      Deduction.forEach((item, i) => {
         sum+=item.Amount
      });
      return sum;
   }
   checkRent = (id) => {
	   if(!this.state.DB[id]["Paid_Rent"])
		   return -1;
	   else if (this.state.DB[id]["Paid_Rent"].length<1) return -1;

	   let paid = this.state.DB[id]["Paid_Rent"].sort((a,b) => {return a.Month-b.Month})
	   let expected = [], due = [], dueTotal = 0;

	   if(moment(paid.slice(-1)[0].Date,"M/D/YY").add(1,"M").isBefore(moment()))
	   	paid.push({Date:moment(paid.slice(-1)[0].Date,"M/D/YY").add(1,"M").format("M/D/YY"),Amount: 0, Month: paid.slice(-1)[0].Month+1})

	   paid.forEach((p,i) => {
		   if(this.state.DB[id].Renewal) {
			   if(this.state.DB[id].Renewal.length>0) {
               var iStatus=[false]
               this.state.DB[id].Renewal.forEach((r, i) => {
                  iStatus.push(true)
               });

				   let period = (p.Month-1)/11
				   expected.push(this.state.DB[id].Rent*(Math.pow(1.05, iStatus[Math.floor(period)] ? Math.floor(period) : 0)));
				   // - iStatus.slice(1,Math.floor(period)).filter(s => s===false).length
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
      var Wave,sum=0
      Wave=this.state.DB[this.props.location.state.id]["Waiver"]
if (Wave)
      Wave.forEach((item, i) => {
         sum+=item.Amount
      });
	   return dueTotal-sum
   }
 getWaiver=(d)=>{
    var Wave,sum=0, monthVal = 0
    Wave=this.state.DB[this.props.location.state.id]["Waiver"]
if (Wave)
    Wave.forEach((item, i) => {
		if(item.Date === d)
			monthVal = item.Amount
      sum+=item.Amount
    });
	if(d) return monthVal
    return sum
}
   getRent = (m) => {
      let person = this.state.DB[this.props.location.state.id]
	   let rent = person.Rent

      if(person.Renewal){
      if(person.Renewal.length>0) {
         var iStatus=[false]
         person.Renewal.forEach((r, i) => {
            iStatus.push(true)
         });

         let period = m ? (m-1)/11 : (person["Paid_Rent"].length-1)/11
         rent = person.Rent*(Math.pow(1.05, iStatus[Math.floor(period)] ? Math.floor(period): 0))
		 //  - iStatus.slice(1,Math.floor(period)).filter(s => s===false).length
      }
    else rent = person.Rent
}
	if(m) rent -= this.getWaiver(person["Paid_Rent"][m-1].Date)
		return rent
   }

   deleteHandler = (i) => {
	   if(window.confirm("Delete this payment?")) {
		   Firebase.database().ref( `${this.props.location.state.id}/Paid_Rent/${i}`).remove()
		   this.setState({redirect: '/'})
	   }
   }

	render() {
      if(this.state.redirect!==null)
         return <Redirect push to={{
            pathname: this.state.redirect,
            state: { id: this.props.location.state.id, db:this.state.DB }
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
			      <p><b>Returnable Advance &nbsp;&nbsp;</b>{this.state.DB[this.props.location.state.id]["Advance"]-this.totalDeductable()-this.getWaiver()}</p>
			      <p><b>Rent Amount &nbsp;&nbsp;</b>{this.getRent()}</p>
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
                  this.state.DB[this.props.location.state.id]["Paid_Rent"].map((p,i)=>
                  <tr>
                     <td  class="Tabledes">{moment(this.state.DB[this.props.location.state.id]["Start_Date"],"M/D/YY").add(p.Month-1 ,"M").format("MMM")}</td>
                     <td  class="Tabledes">{ moment(p.Date,"M/D/YY").format("D-MMM-YY")}</td>
                     <td  class="Tabledes" style={p.Amount === this.getRent(p.Month) ? {color:'#336914', fontWeight:'bold'} : {color:'red', fontWeight:'bold'}} onClick={() => this.deleteHandler(i)}>{p.Amount?p.Amount:0}</td>
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
                     <div class="rect" onClick={() => this.AddPaymentRedirect()}style={{ backgroundColor: '#0057e0',color:"white",width:"98%"}}>
          	 	     <i class="fa fa-plus" aria-hidden="true"></i></div>
                     {// div class="rect" onClick={() => this.setState({redirect:"/Edit"})}style={{ backgroundColor: '#7d7d7d',color:"white",width:"46%"}}>
                     // <i class="fa fa-pencil" aria-hidden="true"></i></div>
                    }
                     </div>
            </div>
        )
  }
}

export default Details;
