// client/src/App.js
import React, { Component } from "react";
import axios from "axios";
var Promise = require('promise');
class App extends Component {
  //initialize our state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    objectToUpdate: null
  };
  componentDidMount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null});
    }
  }

  getDataFromDb = () => {
    console.log("hello in getDataFromDb");
    fetch("http://localhost:3001/api/getData")
    .then(data => data.json())
    .then(res => this.setState({ data: res.data}));
  };

  insertDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/insertData", {
      id: idToBeAdded,
      message: message
    });
  };

  deleteFromDB = idToDelete => {
    let obIdToDelete = null;
    console.log("idToDelete : " + idToDelete);
    this.state.data.forEach(data => {
      console.log("ID : " + data.id);
      if(data.id == idToDelete) {
        obIdToDelete = data.id;
        console.log("IDNew : " + obIdToDelete);
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: obIdToDelete
      }
    }).then(response => {
      this.getDataFromDb(this.state.message);
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let obIdToUpdate = null;
    this.state.data.forEach(data => {
      console.log("data : " + data.id);
      if(data.id == idToUpdate) {
        obIdToUpdate = data.id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: obIdToUpdate,
      update: { message: updateToApply }
    }).then(response => {
      this.getDataFromDb(this.state.message);
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  keyPress = (e) => {
     if(e.keyCode == 13){
        this.insertDataToDB(this.state.message);
     }
  }

  render() {
    const { data }  = this.state;
    return (
      <div>
        <ul>
          { data.length <= 0
            ? "NO DB ENTRIES YET"
            : data.map(d => (
                <li style = {{ padding: "10px" }} key = {data.message}>
                  <span style = {{ color: "gray" }}> id: </span> {d.id} <br />
                  <span style = {{ color: "gray"}}> data: </span>
                  {d.message}
                </li>
            ))}
          </ul>
          <div style={{ padding: "10px" }}>
          <input
            type = "text"
            value = {this.state.value}
            onKeyDown = {this.keyPress}
            onChange = {e => this.setState({ message: e.target.value })}
            placeholder = "add a note"
            fullwidth = {true}
          />
        </div>
        <div style={{ padding: "10px" }}>
          <button onClick={() => this.getDataFromDb(this.state.message)}>
            GET ALL
          </button>
        </div>
          <div style = {{ padding: "10px" }}>
            <input
              type = "text"
              onChange = { e => this.setState({ idToDelete: e.target.value})}
              placeholder = "delete something from the database"
              style = {{ width: "200px" }}
            />
              <button onClick = {() => this.deleteFromDB(this.state.idToDelete)}>
                DELETE
              </button>
          </div>
          <div style = {{ padding: "10px"}}>
            <input
              type = "text"
              style = {{ width: "200px" }}
              onChange = { e => this.setState({ idToUpdate: e.target.value})}
              placeholder = "id of item to update here"
            />
            <input
              type = "text"
              style = {{ width: "200px" }}
              onChange = { e => this.setState({ updateToApply: e.target.value})}
              placeholder = "value of the update here"
            />
            <button
              onClick = {() => this.updateDB(this.state.idToUpdate, this.state.updateToApply)}>
              UPDATE
            </button>
          </div>
        </div>
          );
        }
    }

export default App;
