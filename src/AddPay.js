import React,{ useState,useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from "react-hook-form";
import Firebase from 'firebase';
import config from './config';
import { Redirect, Router } from 'react-router';
import DB from './DB';
import moment from 'moment';
// var db=DB.data

function AddPay(props){
   const[db,setDB]= useState();
   const[redirect,setredirect]= useState(null);
   const { register, handleSubmit } = useForm()

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
      let m1,m2
         let startDate=moment(db[props.location.state.id]["Start_Date"],"M/D/YY", true)
         let history=  db[props.location.state.id]["Paid_Rent"]
         if(history===undefined)
            return startDate.add(1,"M").format("MMM")
        else m1=startDate.add(history[history.length -1].Month,"M")
         return m1.add(1,"M").format("MMM")
   };

   const testSubmitHandler = (d) => {
      console.log(d);
         let success = false;
		 let person = db[props.location.state.id]

		 if(d.Rent){
			if(person.Paid_Rent)
				person.Paid_Rent.push({Date: moment(d.RentDate).format("M/D/YY"),Amount: parseInt(d.Rent), Month: person.Paid_Rent[person.Paid_Rent.length-1].Month+1, EB: d.EB, Water: d.Water, BBMP:d.BBMP})
			else
				person.Paid_Rent = [{Date: moment(d.RentDate).format("M/D/YY"),Amount: parseInt(d.Rent), Month: 1, EB: d.EB, Water: d.Water, BBMP:d.BBMP}]
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
               <p>{props.location.state.id}</p>
               <h3>History</h3>
               <center>
               <table>
               <tr>
                  <th>Month:</th>
                  <th>Date:</th>
                  <th>Amount:</th>
               </tr>
               {  db[props.location.state.id]["Paid_Rent"]?
                  db[props.location.state.id]["Paid_Rent"].slice(db[props.location.state.id]["Paid_Rent"].length - 3).map(p=>
                  <tr>
                     <td>{moment(db[props.location.state.id]["Start_Date"],"M/D/YY", true).add(p.Month,"M").format("MMM")}</td>
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
         <form onSubmit={handleSubmit(d => testSubmitHandler(d))}>
               <input type="date" name="RentDate" ref={register}placeholder="Date" value={moment().format("YYYY-MM-DD")}/><br/><br/>
               <input type="number" name="Rent" ref={register}placeholder="Rent"/><br/><br/>
               <input type="number" name="EB" ref={register}placeholder="EB"/><br/><br/>
               <input type="number" name="Water" ref={register}placeholder="Water"/><br/><br/>
               <input type="number" name="BBMP" ref={register}placeholder="BBMP"/><br/><br/>
               <br/><br/>
               <h3>Additional Deduction</h3>
               <input type="date" name="DeductionDate" ref={register}placeholder="Date" value={moment().format("YYYY-MM-DD")}/><br/><br/>
               <input type="number" name="Deduction" ref={register}placeholder="Deduction"/><br/><br/>
               <input type="text" name="DeductionReason" ref={register}placeholder="Reason"/><br/><br/>
               <br/><br/>
               <h3>Waive Off</h3>
               <input type="date" name="WaiverDate" ref={register}placeholder="Date" value={moment().format("YYYY-MM-DD")}/><br/><br/>
               <input type="number" name="Waiver" ref={register}placeholder="Waiver"/><br/><br/>
               <input type="text" name="WaiverReason" ref={register}placeholder="Reason"/><br/><br/>
               <br/><br/>
               <input class="rect" type="submit" value="Submit" />
               </form>
          </div>
        )

}
export default AddPay;
