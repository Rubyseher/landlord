import React from 'react';
import DB from './data.json';

class Add extends React.Component {
    constructor(props) {
        super(props)
        console.log("Add PAGE");
        this.state = {
          name: '',
          ID: '',
          Mobile: '',
          StartDate: new Date,
          Advance: 0,
          Rent: 0,
          Headcount: 0,
          Building: '',
          Floor: '',
          Door: ''
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
    console.log(this.state);
    event.preventDefault();
  }



	render() {
        return(
    		<div id="container">
    	<h1>Add</h1>
      <form  onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
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

export default Add;
