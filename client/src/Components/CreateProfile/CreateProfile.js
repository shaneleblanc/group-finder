import React, { Component } from 'react';
import axios from 'axios';
import { RadioButton, Select, CheckBox, TextInput, Button, Table, TableBody, TableCell, TableFooter, TableHeader, TableRow,
  Text } from 'grommet';
import { Search, Select as SelectIcon } from 'grommet-icons';

const swal = require('sweetalert2');
const config = require('../../config.json');
class CreateProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      accountName: "",
      characters: [],
      selectedCharacterId: -1,
      leagues: [],
      selectedLeague: '',
      characterSelected: false,
      charsInLeague: [],
      selectedTimesAvailableFrom: '',
      selectedTimesAvailableTo: '',
      selectedRealm: '',
      selectedTimeZone: '',
      selectedContent: [],
      possibleTimes: ['12:00 am', '12:30 am', '1:00 am', '1:30 am', '2:00 am', '2:30 am', '3:00 am', '3:30 am', '4:00 am', '4:30 am',
        '5:00 am', '5:30 am', '6:00 am', '6:30 am', '7:00 am', '8:00 am', '8:30 am', '9:00 am', '9:30 am', '10:00 am', '10:30 am',
        '11:00 am', '11:30 am', '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm', '3:00 pm', '3:30 pm', '4:00 pm',
        '4:30 pm', '5:00 pm', '5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm', '10:00 pm',
        '10:30 pm', '11:00 pm', '11:30 pm'],
      content: config['content'],
      contentChecked: (function() {
        let boolArr = [];
        for (let i = 0; i <= config['content'].length;i++){
          boolArr.push(false)
        }
        return boolArr;
      }()),
      realms: config['realms'],
      timeZones: ['UTC-8']
    }
    console.log(this.state.contentChecked);
  }

  getAccountCharacters(){
    axios.get(`http://localhost:8080/api/profiles/download?name=${this.state.accountName}`)
      .then(res => {
        let id = 0;
        for (let c of res.data){
          let firstLeague = 0;
          let firstLeagueValue = '';
          if (this.state.leagues.indexOf(c['league']) == -1){
            if (firstLeague < 1) {
              firstLeagueValue = c['league'];
              firstLeague += 1;
            }
            let updatedLeagues = this.state.leagues;
            updatedLeagues.push(c['league']);
            this.setState({
              leagues: updatedLeagues,
              selectedLeague: this.state.leagues[0]
            }, () => {
              this.setState({
                charsInLeague: this.state.characters.filter(item => item['league'] === firstLeagueValue)
              })
            });
          }
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

  saveUserProfile(userName, accountName, characterName, characterLevel, characterClass, realm, timeZone, hoursAvailable){
    axios.post('http://localhost:8080/api/profiles/', {
      "username": userName,
      "accountName": accountName,
      "characterName": characterName,
      "characterLevel": characterLevel,
      "characterClass": characterClass,
      "realm": realm,
      "timeZone": timeZone,
      "hoursAvailable": hoursAvailable,
    })
      .then(response => {
        if (response.status == 200){
          this.onSaveUserProfileSuccess();
        }
      })
      .catch(error => {
        swal.fire({
          title: 'Hang on...',
          text: 'Encountered error: ' + error.statusCode + '( ' + error.message + ') ',
          type: 'error',
          confirmButtonText: 'Oh.'
        })
      });
  }
  onSaveUserProfileSuccess() {

  }

  onSearchAccountClick() {
    console.log("searching chars from account " + this.state.accountName);
    this.getAccountCharacters();
  }

  setChecked(id) {
    console.log('set checked: ' + id)
    this.setState({
      selectedCharacterId: id
    }, () => {
      this.setState({
        characterSelected: true
      })
    })
    console.log(this.state.characters[this.state.selectedCharacterId]);

  }

  setLeagueScope(league) {
    this.setState({
      selectedLeague: league,
      charsInLeague: this.state.characters.filter(item => item['league'] === league)
    })

  }

  selectRealm(realm) {
    this.setState({
      selectedRealm: realm
    })
  }

  selectTimeZone(tz) {
    this.setState({
      selectedTimeZone: tz
    })
  }

  selectTimesAvailableFrom(timeFrom) {
    this.setState({
      selectedTimesAvailableFrom: timeFrom
    })
  }

  selectTimesAvailableTo(timeTo) {
    this.setState({
      selectedTimesAvailableTo: timeTo
    })
  }

  selectContent(contentIndex) {
    const updatedContent = this.state.contentChecked;
    if (updatedContent[contentIndex] == true) updatedContent[contentIndex] = false
    else updatedContent[contentIndex] = true;

    this.setState({
      contentChecked: updatedContent
    })
  }

  render() {
    return (
      <div className="createProfile">
        <p>Create your profile</p>

        {
          this.state.characterSelected ?
          /* Character is Chosen */
          <div>
            Character selected: <br /><span>
            {this.state.characters[this.state.selectedCharacterId]['level']}&nbsp;
            {this.state.characters[this.state.selectedCharacterId]['class']}&nbsp;-&nbsp;
            <em>{this.state.characters[this.state.selectedCharacterId]['name']}</em>&nbsp;(
            {this.state.characters[this.state.selectedCharacterId]['league']})</span>

            <Select
              options={this.state.realms}
              value={this.state.selectedRealm}
              onChange={event => this.selectRealm(event.value)}
            />
            <Select
              options={this.state.possibleTimes}
              value={this.state.selectedTimesAvailableFrom}
              onChange={event => this.selectTimesAvailableFrom(event.value)}
            />
            <Select
              options={this.state.possibleTimes}
              value={this.state.selectedTimesAvailableTo}
              onChange={event => this.selectTimesAvailableTo(event.value)}
            />
            <Select
              options={this.state.timeZones}
              value={this.state.selectedTimeZone}
              onChange={event => this.selectTimeZone(event.value)}
            />
            {this.state.content.map((contentType, index) => (
              <CheckBox
                key={index}
                options={this.state.content}
                checked={this.state.contentChecked[index]}
                onChange={event => this.selectContent(index)}
                label={contentType}
              />
            ))
            }


          </div>
            
          :
            
          /* Select and Choose a Character */

          <div>
            <TextInput
              placeholder={"Account name"}
              value={this.state.accountName}
              onChange={event => this.setState({accountName: event.target.value})}
            />
            <Button
              icon={<Search/>}
              label="Find"
              onClick={() => this.onSearchAccountClick()}
            />
            <br/>
            <Select
              options={this.state.leagues}
              value={this.state.selectedLeague}
              onChange={event => this.setLeagueScope(event.value)}
            />
            <Table
              caption={'Characters'}
              className="createProfile-CharactersTable"
              alignSelf="center"
            >
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {this.state.charsInLeague.map((char) => (
                  <TableRow key={char.id}>
                    <TableCell>
                      <RadioButton
                        name={char.name}
                        checked={this.state.selectedCharacterId == char.id}
                        onChange={(event) => this.setChecked(char.id)}
                      />
                    </TableCell>
                    <TableCell>{char['class']}</TableCell>
                    <TableCell>{char['level']}</TableCell>
                    <TableCell>{char['name']}</TableCell>
                  </TableRow>

                ))}
              </TableBody>
            </Table>
          </div>
        }

      </div>
    )
  }
};

export default CreateProfile;
