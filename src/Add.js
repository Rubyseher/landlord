import React from 'react';
import DB from './data.json';

class Add extends React.Component {
    constructor(props) {
        super(props)
        console.log("Add PAGE");
    }
	render() {
        return(
    		<div id="container">
    	<h1>Add</h1>
      <form>
  <label>
    Name:
    <input type="text" name="name" />
  </label><br/><br/>
  <label>
    ID:
    <input type="text" name="ID" />
  </label><br/><br/>
  <label>
    Mobile:
    <input type="text" name="Mobile" />
  </label><br/><br/>
  <label>
    StartDate:
    <input type="date" name="StartDate" />
  </label><br/><br/>
  <label>
    Advance:
    <input type="number" name="Advance" />
  </label><br/><br/>
  <label>
    Rent:
    <input type="number" name="Rent" />
  </label><br/><br/>
  <label>
    Headcount:
    <input type="number" name="Headcount" />
  </label><br/><br/>
  <label>
    Building:
    <input type="text" name="Building" />
  </label><br/><br/>
  <label>
    Floor:
    <input type="text" name="Floor" />
  </label><br/><br/>
  <label>
    Door:
    <input type="text" name="Door" />
  </label><br/><br/>
  <input type="submit" value="Submit" />
</form>

          </div>
        )
  }
}

export default Add;
