import React from 'react';
import Firebase from 'firebase';
import config from './config';
import moment from 'moment';
import { Redirect, Router } from 'react-router';
import DB from './DB';

class Edit extends React.Component {
   constructor(props) {
      super(props)
      console.log('edit');
        this.state = {
            Name: '',
            ID: '',
            Mobile: '',
            StartDate: new Date,
            Advance: 0,
            Rent: 0,
            Head_Count: 0,
            Building: '',
            Floor: '',
            Door: '',
            BBMP:'',
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
      // Firebase.database().ref(this.props.location.state.id).remove()
      this.setState({redirect:"/"})
   }

    getUserData = () => {
        if(DB.data) {
            this.setState({
              Name: DB.data[this.props.location.state.id].Name,
              ID: this.props.location.state.id,
              Mobile: DB.data[this.props.location.state.id].Mobile,
              StartDate: new Date(moment(DB.data[this.props.location.state.id].Start_Date,"M/D/YY", true).format("YYYY-MM-DD")),
              Advance: DB.data[this.props.location.state.id].Advance,
              Rent: DB.data[this.props.location.state.id].Rent,
              Head_Count: DB.data[this.props.location.state.id].Head_Count,
              Building: this.props.location.state.id.split('_')[0],
              Floor: this.props.location.state.id.split('_')[1],
              Door:this.props.location.state.id.split('_')[2],
              BBMP:DB.data[this.props.location.state.id].BBMP,
              Acc_ID:DB.data[this.props.location.state.id].Acc_ID,
              MR_Code:DB.data[this.props.location.state.id].MR_Code,
              Months:DB.data[this.props.location.state.id].Months,
              Paid_Rent:[]
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
        StartDate: new Date(moment(data.Start_Date,"M/D/YY", true).format("YYYY-MM-DD")),
        Advance: data.Advance,
        Rent: data.Rent,
        Head_Count: data.Head_Count,
        Building: this.props.location.state.id.split('_')[0],
        Floor: this.props.location.state.id.split('_')[1],
        Door:this.props.location.state.id.split('_')[2],
        BBMP:data.BBMP,
        Acc_ID:data.Acc_ID,
        MR_Code:data.MR_Code,
        Months:data.Months,
        Paid_Rent:[]
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
    Firebase.database().ref(id).update(this.state, (error) => {
       if (error) console.error(error);
       else {
           DB.data[this.props.location.state.id] = this.state;
         success = true;
     }
   }).then(() => {
      if (success) this.setState({redirect:"/Details"})
   });
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

  export default Edit;
