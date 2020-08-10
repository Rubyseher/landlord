import React from 'react';
import Firebase from 'firebase';
import config from './config';
import moment from 'moment';
import {Redirect} from 'react-router';
import DB from './DB';
import Popup from "reactjs-popup";

class Edit2 extends React.Component {
   constructor(props) {
      super(props)
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
          this.getUserData()
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
   }

    DeleteRedirect= () => {
        // Temporarily disabled
        if (window.confirm("Delete person?")) {
           Firebase.database().ref(this.props.location.state.id).remove()
           this.setState({redirect:"/"})
        }

   }

    getUserData = () => {
        if(DB.data) {
            this.setState({
              Name: DB.data[this.props.location.state.id].Name,
              ID: this.props.location.state.id,
              Mobile: DB.data[this.props.location.state.id].Mobile,
              StartDate: moment(DB.data[this.props.location.state.id].Start_Date,"M/D/YY", true).format("YYYY-MM-DD"),
              Advance: DB.data[this.props.location.state.id].Advance,
              Rent: DB.data[this.props.location.state.id].Rent,
              Head_Count: DB.data[this.props.location.state.id].Head_Count,
              Building: this.props.location.state.id.split('_')[0],
              Floor: this.props.location.state.id.split('_')[1],
              Door:this.props.location.state.id.split('_')[2],
              Acc_ID:DB.data[this.props.location.state.id].Acc_ID,
              MR_Code:DB.data[this.props.location.state.id].MR_Code,
              Months:DB.data[this.props.location.state.id].Months,
              Paid_Rent:DB.data[this.props.location.state.id].Paid_Rent,
            });
            return
        }
    let ref = Firebase.database().ref('/'+this.props.location.state.id);
    ref.on('value', snapshot => {
      let data=snapshot.val()
      this.setState({
        Name: data.Name,
        ID: this.props.location.state.id,
        Mobile: data.Mobile,
        StartDate: moment(data.Start_Date,"M/D/YY", true).format("YYYY-MM-DD"),
        Advance: data.Advance,
        Rent: data.Rent,
        Head_Count: data.Head_Count,

        Building: this.props.location.state.id.split('_')[0],
        Floor: this.props.location.state.id.split('_')[1],
        Door:this.props.location.state.id.split('_')[2],
        Acc_ID:data.Acc_ID,
        MR_Code:data.MR_Code,
        Months:data.Months,
        Paid_Rent:data.Paid_Rent,
      });
    });
  }
    handleChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
    }

  handleSubmit(event) {
    event.preventDefault();
    let success = false;
    let id="/"+this.state.Building+"_"+this.state.Floor+"_"+this.state.Door
     if (window.confirm("Save?")) {
       Firebase.database().ref(id).update(this.state, (error) => {
          if (error) console.error(error);
          else {
              // DB.data[id] = this.state;
              DB.data=undefined
            success = true;
          }
       }).then(() => {
        if (success) this.setState({redirect:"/Details"})
          }).catch((e) => {
   	window.alert(e.message)
   });
  }
  else{this.setState({redirect:"/Details"})}
}
  componentDidMount() {
     this.getUserData();
  }

	render() {
      if(this.state.redirect!==undefined)
      return <Redirect pop to={{
         pathname: this.state.redirect,
         state: { id: this.props.location.state.id }
      }} />
        return(
    		<div id="container">
    	<h1>Edit</h1>
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
            <input type="number" name="Head_Count" value={this.state.Head_Count} onChange={this.handleChange}/>
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
          <input class="rect" type="submit" value="Submit" />
      </form>
      <div class="rect" onClick={() => this.DeleteRedirect()}style={{ backgroundColor: '#d10000',color:"white"}}>
      <i class="fa fa-remove" aria-hidden="true"></i></div>
      </div>
    )
  }
}

  export default Edit2;
