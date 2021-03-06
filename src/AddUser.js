import React from 'react';
import Firebase from 'firebase';
import config from './config';
import DB from './DB';

class AddUser extends React.Component {
   constructor(props) {
         super(props)
         console.log("AddUser PAGE");
         this.state = {
         Name: '',
         ID: '',
         Mobile: '',
         StartDate: "2015-01-01",
         Advance: 0,
         Rent: 0,
         Head_Count: 0,
         Building: '',
         Floor: '',
         Door: '',
         Acc_ID:'',
         MR_Code:'',
         Months:'0',
         Paid_Rent:[]
        }
        if (!Firebase.apps.length) {
          Firebase.initializeApp(config);
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
   }

   handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
   }

   handleSubmit(event) {
      event.preventDefault();
      let id="/"+this.state.Building+"_"+this.state.Floor+"_"+this.state.Door
      Firebase.database().ref(id).set(this.state);
      this.getUserData();
   }

   getUserData = () => {
      let ref = Firebase.database().ref('/');
      ref.on('value', snapshot => {
         this.setState({ DB: snapshot.val()});
         DB.data = snapshot.val();
      });
   }

	render() {
      return(
    		<div id="container">
    	      <h1>AddUser</h1>
            <form  onSubmit={this.handleSubmit}>
            <label>
            Name:
            <input type="text" name="Name" value={this.state.Name} onChange={this.handleChange}/>
            </label><br/><br/>
            <label>
            ID:
            <input type="text" name="ID" value={this.state.ID} onChange={this.handleChange}/>
            </label><br/><br/>
            <label>
            Mobile:
            <input type="text" name="Mobile" value={this.state.Mobile} onChange={this.handleChange}/>
            </label><br/><br/>
            <label>
            StartDate:
            <input type="date" name="StartDate" value={this.state.StartDate} onChange={this.handleChange}/>
            </label><br/><br/>
            <label>
            Advance:
            <input type="number" name="Advance" value={this.state.Advance} onChange={this.handleChange}/>
            </label><br/><br/>
            <label>
            Rent:
            <input type="number" name="Rent" value={this.state.Rent} onChange={this.handleChange}/>
            </label><br/><br/>
            <label>
            Headcount:
            <input type="number" name="Headcount" value={this.state.Headcount} onChange={this.handleChange}/>
            </label><br/><br/>
            <label>
            Building:
            <input type="text" name="Building" value={this.state.Building} onChange={this.handleChange}/>
            </label><br/><br/>
            <label>
            Floor:
            <input type="text" name="Floor" value={this.state.Floor} onChange={this.handleChange}/>
            </label><br/><br/>
            <label>
            Door:
            <input type="text" name="Door" value={this.state.Door} onChange={this.handleChange}/>
            </label><br/><br/>
            <input type="submit" value="Submit" />
         </form>
      </div>
    )
  }
}

export default AddUser;
