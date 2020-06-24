import React from 'react';
import DB from './data.json';
import { Redirect, Router } from 'react-router';
import Details from './Details';
import './Main.css'
import moment from 'moment';

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: null
		}
		this.checkRent("86_3_1")
	}

	detailsRedirect = (id) => {
		this.setState({id: id});
	}

	checkRent = (id) => {
		if(!DB[id]["Paid Rent"])
			return -1;
		else if (DB[id]["Paid Rent"].length<1) return -1;

		let paid = DB[id]["Paid Rent"].sort((a,b) => {return a.Month-b.Month})
		let expected = [], due = [], dueTotal = 0;

		paid.forEach((p,i) => {
			if(DB[id].Renewal) {
				if(DB[id].Renewal.length>0) {
					let period = p.Month/11
					if(period<=1) expected.push(DB[id].Rent);
					else expected.push(DB[id].Rent*(1.05*Math.floor(period)));
				}
			} else expected.push(DB[id].Rent);
			if(p.Month != paid[0].Month+i) {
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
			if(due_i!=0){
				due.push({
					month: p.Month,
					date: p.Date,
					amount: due_i
				})
				dueTotal += due_i
			}
		});
		return dueTotal==0 ? 1 : 0
	}

	rentColor=(id,type)=>{
		switch(this.checkRent(id))
		{
			case -1:return (type=="icon")?"fa fa-check":"#49a652";
			break;
			case 0:return (type=="icon")?"fa fa-exclamation":"#f5cd07";
			break;
			case 1: return (type=="icon")?"fa fa-remove":"#e81717";
			break;
		}
	}

	checkRenewal=(id)=>
	{
		let r=DB[id].Renewal
		let endDate = moment((r!=undefined && r.length>0) ? r[r.length-1]["Date"] : DB[id]["Start Date"],"M/D/YY", true).add(11,"M")
		return endDate.isBetween(moment(),moment().add(3,"M"),"M") ? endDate.format("Do MMMM, YYYY") : null;
	}
	render () {
		if(this.state.id!=null)
			return <Details id={this.state.id}/>
		return(
		<div class="container">
		<h2>Rent #86: {moment().subtract(1, 'months').format("MMM")} - {moment().format("MMM")}</h2>
		<div class="nameList">
		{
		  Object.keys(DB).map((d,i) => (
			  (d[0] == '8') ? <div key={d} class="person" onClick={() => this.detailsRedirect(d)} style={{marginRight: (i%3 == 2) ? "0%" : "10%"}}>
			   <div class="circle" style={{ backgroundColor: this.rentColor(d)}}><i class={this.rentColor(d,"icon")}></i></div>
			   <div class="name">
				   {d.split('_')[1] == '0' ? 'G' : d.split('_')[1]}F {DB[d].Nickname ? DB[d].Nickname : DB[d].Name.split(' ')[0]}
			   </div>
			  </div> : null
	  		))
		}
		</div>
		<h2>Rent #6: {moment().subtract(1, 'months').format("MMM")} - {moment().format("MMM")}</h2>
		<div class="nameList">
		{
		  Object.keys(DB).map((d,i) => (
			  (d[0] == '6') ? <div key={d} class="person" onClick={() => this.detailsRedirect(d)} style={{marginRight: (i%3 == 2) ? "0%" : "10%"}}>
			  <div class="circle" style={{ backgroundColor:this.rentColor(d) }}><i class={this.rentColor(d,"icon")}></i></div>
			   <div class="name">
				   {DB[d].Nickname ? DB[d].Nickname : DB[d].Name.split(' ')[0]}
			   </div>
			  </div> : null
	  		))
		}
		</div>
		<h2>Upcoming Renewals</h2>
		<div class="nameList" style={{display: "block", alignItems: "left"}}>
		{
			Object.keys(DB).map(d => (
				this.checkRenewal(d)?
				<p key={d}><b>{DB[d].Name}:</b> {this.checkRenewal(d)}<br/></p>:null
			))
		}
		</div>
	</div>
	)
	}
}

export default Main;
