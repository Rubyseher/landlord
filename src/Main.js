import {Redirect} from 'react-router';
import React from 'react';
import Firebase from 'firebase';
import moment from 'moment';
import config from './config';
import './Main.css'
import DB from './DB';

class Main extends React.Component {
	constructor(props) {
		super(props);
			this.state = {
				id: null,
				redirect:null,
				DB:null
			}
			if (!Firebase.apps.length) {
				Firebase.initializeApp(config);
				this.getUserData()
				console.log(this.state.DB);
			}
	}
	componentDidMount() {
  		this.getUserData();
	}

	detailsRedirect = (id) => {
		this.setState({id: id});
		this.setState({redirect:"/Details"})
	  }

	AddUserRedirect= () => {
		this.setState({redirect:"/AddUser"})
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
		return dueTotal===0 ? 1 : 0
	}

	rentColor=(id,type)=>{
		switch(this.checkRent(id))
		{
			case 0: return (type==="icon")?"fa fa-exclamation":"#eda705";
			case 1: return (type==="icon")?"fa fa-remove":"#d10000";
			default: return (type==="icon")?"fa fa-check":"#07ab0a";
		}
	}

	checkRenewal=(id)=>
	{
		let r=this.state.DB[id].Renewal
		let endDate = moment((r!==undefined && r.length>0) ? r[r.length-1]["Date"] : this.state.DB[id]["Start_Date"],"M/D/YY", true).add(11,"M")
		return endDate.isBetween(moment().subtract(1,"M"),moment().add(7,"M"),"M") ? endDate.format("Do MMMM, YYYY") : null;
	}

	renewalsExist = () => {
		var result = false
		Object.keys(this.state.DB).forEach(d => {
			if(this.checkRenewal(d)!==null)
				result = true
		});
		return result
	}
	render () {

		if(this.state.redirect!==null)
			return <Redirect push to={{
            pathname: this.state.redirect,
            state: { id: this.state.id }
        	}} />
		return(
		this.state.DB && <div class="container">
		<div  class="App-header" as="h2" style={{ textAlign: "center", margin: 20 ,color:'white'}}>Rent Tracker</div>
		<h2  style={{marginTop:'25%'}}>Rent: {moment().subtract(1, 'months').format("MMM")} - {moment().format("MMM")}</h2>
		<div class="nameListWrapper">
		<h4>Building #86</h4>
		<div class="nameList">
		{
		  Object.keys(this.state.DB).map((d,i) => (
			  (d[0] === '8') ? <div key={d} class="person" onClick={() => this.detailsRedirect(d)} style={{marginRight: (i%3 === 2) ? "0%" : "7%"}}>
			   <div class="circle" style={{ backgroundColor: this.rentColor(d)}}><i class={this.rentColor(d,"icon")}></i></div>
			   <div class="name">
				   {d.split('_')[1] === '0' ? 'G' : d.split('_')[1]}F {this.state.DB[d].Nickname ? this.state.DB[d].Nickname : this.state.DB[d].Name.split(' ')[0]}
			   </div>
			  </div> : null
	  		))
		}
		</div>
		<br/>
		<hr/>
		<h4>Building #6</h4>
		<div class="nameList">
		{
		  Object.keys(this.state.DB).map((d,i) => (
			  (d[0] === '6') ? <div key={d} class="person" onClick={() => this.detailsRedirect(d)} style={{marginRight: (i%3 === 2) ? "0%" : "7%"}}>
			  <div class="circle" style={{ backgroundColor:this.rentColor(d) }}><i class={this.rentColor(d,"icon")}></i></div>
			   <div class="name">
				   {d.split('_')[1] === '0' ? 'G' : d.split('_')[1]}F {this.state.DB[d].Nickname ? this.state.DB[d].Nickname : this.state.DB[d].Name.split(' ')[0]}
			   </div>
			  </div> : null
	  		))
		}
		</div>
		</div>
		<br/>
		<h2>Upcoming Renewals</h2>
		<p style={{marginTop:-15}}>6 Months</p>
		<div class="nameListWrapper">
		{
			this.renewalsExist() ? Object.keys(this.state.DB).map(d => (
				this.checkRenewal(d)?
				<p key={d}><b>{this.state.DB[d].Name}:</b> {this.checkRenewal(d)}<br/></p>:null
			)) : <div><br/>No Upcoming Renewals in the next 6 months.<br/><br/></div>
		}
		</div>
		<br/>
		<h2>Tennants</h2>
		<div class="nameListWrapper">
		{
			Object.keys(this.state.DB).map(d => (
				<p key={d}><b>{this.state.DB[d].Name}: </b>#{d.split("_")[0]}, {d.split('_')[1] === '0' ? 'G' : d.split('_')[1]}F<br/>

				</p>
			))
		}
		<div class="rect" onClick={() => this.AddUserRedirect()}style={{ backgroundColor: '#0057e0',color:"white"}}>
		<i class="fa fa-plus" aria-hidden="true"></i></div>
		</div>
	</div>
	)
	}
}

export default Main;
