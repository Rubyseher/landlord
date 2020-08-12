import React,{ useState ,useEffect} from 'react';
import Firebase from 'firebase';
import config from './config';
import {Redirect} from 'react-router';
import DB from './DB';
import { useForm } from "react-hook-form";


function Edit(props){
   var [db,setDB]= useState();
   const[redirect,setredirect]= useState(null);
   const { register, handleSubmit } = useForm({defaultValues:props.location.state.db});



    const DeleteRedirect= () => {
        // Temporarily disabled
        if (window.confirm("Delete person?")) {
           Firebase.database().ref( props.location.state.id).remove()
             setredirect("/")
        }

   }

   const getUserData = () => {
      console.log("get user data");
      let ref = Firebase.database().ref('/');
      ref.on('value', (snapshot) => {
         setDB(snapshot.val());
         DB.data =  snapshot.val();
         db =  snapshot.val();
        setDB(DB.data);
        console.log(db[ props.location.state.id]);
        return(db[ props.location.state.id])
      });

   };

   useEffect(() => {
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
   },[db]);


    const _handleSubmit=(d)=> {
    let success = false;
    let id="/"+  d.Building+"_"+  d.Floor+"_"+  d.Door
     if (window.confirm("Save?")) {
   //     Firebase.database().ref(id).update( state, (error) => {
   //        if (error) console.error(error);
   //        else {
   //            // DB.data[id] =  state;
   //            DB.data=undefined
   //          success = true;
   //        }
   //     }).then(() => {
   //      if (success)   setredirect("/Details")
   //        }).catch((e) => {
   // 	window.alert(e.message)
   // });
  }
  else{  setredirect("/Details")}
}


      if(  redirect!==null)
      return <Redirect pop to={{
         pathname:   redirect,
         state: { id:  props.location.state.id }
      }} />
        return(
    	<div id="container">
    	<h1>Edit</h1>
      {
         db && <form  onSubmit={handleSubmit(d => _handleSubmit(d))}>
          <label>
            Name:
            <input type="text" name="Name"  ref={register} defaultValue={db.Name}/>
          </label><br/><br/>
          <label>
            ID:
            <input type="text" name="ID"  ref={register}/>
          </label><br/><br/>
          <label>
            Mobile:
            <input type="text" name="Mobile" ref={register} />
          </label><br/><br/>
          <label>
            StartDate:
            <input type="date" name="Start_Date"  ref={register}/>
          </label><br/><br/>
          <label>
            Advance:
            <input type="number" name="Advance" ref={register}/>
          </label><br/><br/>
          <label>
            Rent:
            <input type="number" name="Rent" ref={register} />
          </label><br/><br/>
          <label>
            Headcount:
            <input type="number" name="Head_Count" ref={register} />
          </label><br/><br/>
          <label>
            Building:
            <input type="text" name="Building"ref={register}  />
          </label><br/><br/>
          <label>
            Floor:
            <input type="text" name="Floor" ref={register} />
          </label><br/><br/>
          <label>
            Door:
            <input type="text" name="Door" ref={register}  />
          </label><br/><br/>
          <input class="rect" type="submit" value="Submit" />
      </form>
   }
      <div class="rect" onClick={() => DeleteRedirect()}style={{ backgroundColor: '#d10000',color:"white"}}>
      <i class="fa fa-remove" aria-hidden="true"></i></div>
      </div>
    )

}

  export default Edit;
