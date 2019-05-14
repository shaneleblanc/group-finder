import React, { Component } from 'react';
import axios from 'axios';
import { CheckBox, TextInput, Button, Table, TableBody, TableCell, TableFooter, TableHeader, TableRow,
  Text } from 'grommet';
import { Search } from 'grommet-icons';

class CreateProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      accountName: "",
      characters: [],
      checkedChar: -1,

    }
  }
  getAccountCharacters(){
    axios.get(`http://localhost:8080/api/profiles/download?name=${this.state.accountName}`)
      .then(res => {
        console.log('result: ' + res.data);
        let id = 0;
        for (let c of res.data){
          c['id'] = id;
          id += 1;
        }
        this.setState({
          characters: res.data
        })
      })
      .catch(err => {
        console.error(err);
      })
  }
  onSearchAccountClick() {
    console.log("searching chars from account " + this.state.accountName);
    this.getAccountCharacters()
  }
  setChecked(id) {
    console.log('set checked: ' + id)
  this.setState({
    checkedChar: id
  })
  }

  render() {
    return (
      <div className="createProfile">
        <p>Create your profile</p>
        <TextInput
          placeholder={"Account name"}
          value={this.state.accountName}
          onChange={event => this.setState({accountName: event.target.value})}
                 />
        <Button
          icon={<Search />}
          label="Find"
          onClick={() => this.onSearchAccountClick()}
          />
        <Table caption={'Characters'}>
          <TableHeader>
            <TableRow>
              <TableCell>
                &nbsp;
              </TableCell>
              <TableCell>
                C
              </TableCell>
              <TableCell>
                L
              </TableCell>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                League
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
        {this.state.characters.map((char) => (
<TableRow key={char.id}>
  <TableCell>
    <CheckBox
      checked={this.state.checkedChar == char.id}
      onChange={(event) => this.setChecked(char.id)}
    />
  </TableCell>
  <TableCell>{char['class']}</TableCell>
  <TableCell>{char['level']}</TableCell>
  <TableCell>{char['name']}</TableCell>
  <TableCell>{char['league']}</TableCell>
</TableRow>

        ))}
          </TableBody>
        </Table>
      </div>
    )
  }
};

export default CreateProfile;
