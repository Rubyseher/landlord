// import this.state.DB from './data.json';
import React from 'react';
import Firebase from 'firebase';
import config from './config';
import { Redirect, Router } from 'react-router';
import DB from './DB';
import moment from 'moment';

class AddPayment extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
          DB: null,
         RentDate: new Date(),
         Rent: 0,
         EB: 0,
         Water: 0,
         BBMP: 0,
         DeductionDate: new Date(),
         Deduction: 0,
         DeductionReason: '',
         WaiverDate: new Date(),
         Waiver: 0,
         WaiverReason: '',
         redirect:null
      };

      if(DB.data) this.setState({DB: DB.data})
      else if (!Firebase.apps.length) {
         Firebase.initializeApp(config);
         this.getUserData()
         console.log(this.state.DB);
        }
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
   getMonths= () => {
      let m1,m2
         let startDate=moment(this.state.DB[this.props.location.state.id]["Start_Date"],"M/D/YY", true)
         let history=  this.state.DB[this.props.location.state.id]["Paid_Rent"]
         console.log(history);
            console.log(startDate);
         if(history===undefined)
            return startDate.add(1,"M").format("MMM")
        else m1=startDate.add(history[history.length -1].Month,"M")
         return m1.add(1,"M").format("MMM")
   }
   componentDidMount() {
      this.getUserData();
      this.setState({
          RentDate: moment().format('DD/MM/YYYY'),
          DeductionDate: moment().format('DD/MM/YYYY'),
          WaiverDate: moment().format('DD/MM/YYYY')
      })
   }

   handleChange(e) {
     this.setState({
       [e.target.name]: e.target.value
     });
   }

 handleSubmit(event) {
   event.preventDefault();
   let success = false;
   Firebase.database().ref(this.props.location.state.id).update(this.state, (error) => {
      if (error) console.error(error);
      else {
          DB.data[this.props.location.state.id] = this.state;
        success = true;
    }
  }).then(() => {
     if (success) this.setState({redirect:"/Details"})
  });
 }

	render() {
      if(this.state.redirect!==null)
         return <Redirect push to={{
            pathname: this.state.redirect,
            state: { id: this.props.location.state.id }
         }} />
         return(
    			this.state.DB && <div id="container">
                <br/><br/>
                <h1>Add Payment</h1>
    		    <h3>{this.state.DB[this.props.location.state.id].Name}</h3>
                <p>{this.props.location.state.id}</p>
             <h3>History</h3>
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
                     <td>{moment(this.state.DB[this.props.location.state.id]["Start_Date"],"M/D/YY", true).add(p.Month,"M").format("MMM")}</td>
                     <td>{p.Date}</td>
                     <td>{p.Amount}</td>
                  </tr>
                  ):null
               }
               </table>
               </center>
               <br/><br/>
               <h3>New Payment</h3>
               <p>{this.getMonths()}</p>
               <form onSubmit={this.handleSubmit}>
               <input type="date" name="RentDate" value={this.state.RentDate} onChange={this.handleChange} placeholder="Date"/><br/><br/>
                 <input type="number" name="Rent" value={this.state.Rent} onChange={this.handleChange} placeholder="Rent"/><br/><br/>
                 <input type="number" name="EB" value={this.state.EB} onChange={this.handleChange} placeholder="EB"/><br/><br/>
                 <input type="number" name="Water" value={this.state.Water} onChange={this.handleChange} placeholder="Water"/><br/><br/>
                 <input type="number" name="BBMP" value={this.state.BBMP} onChange={this.handleChange} placeholder="BBMP"/><br/><br/>
                 <br/><br/>
                 <h3>Additional Deduction</h3>
                 <input type="date" name="DeductionDate" value={this.state.DeductionDate} onChange={this.handleChange} placeholder="Date"/><br/><br/>
                   <input type="number" name="Deduction" value={this.state.Deduction} onChange={this.handleChange} placeholder="Deduction"/><br/><br/>
                   <input type="text" name="DeductionReason" value={this.state.DeductionReason} onChange={this.handleChange} placeholder="Reason"/><br/><br/>
                   <br/><br/>
                   <h3>Waive Off</h3>
                   <input type="date" name="WaiverDate" value={this.state.WaiverDate} onChange={this.handleChange} placeholder="Date"/><br/><br/>
                     <input type="number" name="Waiver" value={this.state.Waiver} onChange={this.handleChange} placeholder="Waiver"/><br/><br/>
                     <input type="text" name="WaiverReason" value={this.state.WaiverReason} onChange={this.handleChange} placeholder="Reason"/><br/><br/>
                     <br/><br/>
                     <input class="rect" type="submit" value="Submit" />
                     </form>
          </div>
        )
  }
}

export default AddPayment;
