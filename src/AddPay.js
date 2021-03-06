import React,{ useState } from 'react';
import { useForm } from "react-hook-form";
import Firebase from 'firebase';
import config from './config';
import { Redirect } from 'react-router';
import DB from './DB';
import moment from 'moment';

function AddPay(props){
   var [db,setDB]= useState();
   const[redirect,setredirect]= useState(null);
   const { register, handleSubmit } = useForm()
   var [expWaiver,setExpWaiver] = useState(0);

      const getUserData = () => {
         console.log("get user data");
         let ref = Firebase.database().ref('/');
         ref.on('value', (snapshot) => {
            console.log(db);
            setDB(snapshot.val());
            DB.data =  snapshot.val();
            db =  snapshot.val();
           setDB(DB.data);
           console.log(DB.data);
           console.log(db);
         });

      };

      // useEffect(() => {
         // console.log(db);
         if(!db) {
            if(DB.data) {
                setDB(DB.data)
            }
            else if (!Firebase.apps.length) {
               Firebase.initializeApp(config);
               getUserData()
                setDB(DB.data)
            }
         }
         // console.log(db);
      // },[db]);

   const getMonths= () => {
      let m1
         let startDate=moment(db[props.location.state.id]["Start_Date"],"M/D/YY", true)
         let history=  db[props.location.state.id]["Paid_Rent"]
         if(history===undefined)
            return startDate.format("MMM")
        else m1=startDate.add(history[history.length -1].Month,"M")
         return m1.format("MMM")
   };

   const testSubmitHandler = (d) => {
      console.log(d);
         let success = false;
		 let person = db[props.location.state.id]
		 if(person.Paid_Rent.slice(-1)[0].Amount === 0) person.Paid_Rent.pop()

		 if(d.Rent){
			if(person.Paid_Rent)
				person.Paid_Rent.push({Date: moment(d.RentDate).format("M/D/YY"),Amount: parseInt(d.Rent), Month: person.Paid_Rent.slice(-1)[0].Month+1, Others: d.Others  || 0})
			else
				person.Paid_Rent = [{Date: moment(d.RentDate).format("M/D/YY"),Amount: parseInt(d.Rent), Month: 1, Others: d.Others || 0}]
			}

		if(d.Deduction){
   			if(person.Deduction)
   				person.Deduction.push({Date: moment(d.DeductionDate).format("M/D/YY"), Amount: parseInt(d.Deduction), Reason: d.DeductionReason})
   			else
   				person.Deduction = [{Date: moment(d.DeductionDate).format("M/D/YY"), Amount: parseInt(d.Deduction), Reason: d.DeductionReason}]
   			}

		if(d.Waiver){
   			if(person.Waiver)
   				person.Waiver.push({Date:moment(d.WaiverDate).format("M/D/YY") , Amount: parseInt(d.Waiver), Reason: d.WaiverReason})
   			else
   				person.Waiver = [{Date:moment(d.WaiverDate).format("M/D/YY") , Amount: parseInt(d.Waiver), Reason: d.WaiverReason}]
   			}

         Firebase.database().ref(props.location.state.id).update(person, (error) => {
            if (error) console.error(error);
            else {
                  db[props.location.state.id] = d;
                  success = true;
            }
         }).then(() => {
            if (success) setredirect("/Details")
            });
   }

   const getRent = (m) => {
      let person = db[props.location.state.id]
	   let rent = person.Rent

      if(person.Renewal){
      if(person.Renewal.length>0) {
         var iStatus=[false]
         person.Renewal.forEach((r, i) => {
            iStatus.push(true)
         });

         let period = m ? (m-1)/11 : (person["Paid_Rent"].length-1)/11
         rent = person.Rent*(Math.pow(1.05, iStatus[Math.floor(period)] ? Math.floor(period) : 0))
		 // - iStatus.slice(1,Math.floor(period)).filter(s => s===false).length
      }
    else rent = person.Rent

}
		return rent
   }

   const autoWaiver = (e) => {
	   setExpWaiver(getRent() - e.target.value);
   }



      if(redirect!==null)
         return <Redirect push to={{
            pathname: redirect,
            state: { id: props.location.state.id }
         }} />
         return(
               db && <div id="container">
               <br/><br/>
               <h1>Add Payment</h1>
               <h3>{db[props.location.state.id].Name}</h3>
               <p>#{props.location.state.id.split("_")[0]}, {props.location.state.id.split('_')[1] === '0' ? 'G' : props.location.state.id.split('_')[1]}F</p>
               <h3>Recent History</h3>
               <center>
               <table>
               <tr>
                  <th>Month</th>
                  <th>Date</th>
                  <th>Amount</th>
               </tr>
               {  db[props.location.state.id]["Paid_Rent"]?
                  db[props.location.state.id]["Paid_Rent"].slice(db[props.location.state.id]["Paid_Rent"].length - 3).map(p=>
                  <tr>
                     <td>{moment(db[props.location.state.id]["Start_Date"],"M/D/YY", true).add(p.Month-1,"M").format("MMM")}</td>
                     <td>{p.Date}</td>
                     <td>{p.Amount}</td>
                  </tr>
                  ):null
               }
               </table>
               </center>
               <br/><br/>
               <h3>New Payment</h3>
			   <p>{getMonths()}</p>
               <p>Expected: {getRent()}</p>
         <form onSubmit={handleSubmit(d => testSubmitHandler(d))}>
               <input type="date" name="RentDate" ref={register}placeholder="Date"/><br/><br/>
               <input type="number" name="Rent" ref={register}placeholder="Rent" onBlur={(e) => autoWaiver(e)}/><br/><br/>
               <input type="number" name="Others" ref={register}placeholder="Others"/><br/><br/>
               <br/><br/>
               <h3>Additional Deduction</h3>
               <input type="date" name="DeductionDate" ref={register}placeholder="Date"/><br/><br/>
               <input type="number" name="Deduction" ref={register}placeholder="Deduction"/><br/><br/>
               <input type="text" name="DeductionReason" ref={register}placeholder="Reason"/><br/><br/>
               <br/><br/>
               <h3>Waive Off</h3>
			   <p>Expected: {expWaiver}</p>
               <input type="date" name="WaiverDate" ref={register}placeholder="Date"/><br/><br/>
               <input type="number" name="Waiver" ref={register}placeholder="Waiver"/><br/><br/>
               <input type="text" name="WaiverReason" ref={register}placeholder="Reason"/><br/><br/>
               <br/><br/>
               <input class="rect" type="submit" value="Submit" />
               </form>
          </div>
        )

}
export default AddPay;
