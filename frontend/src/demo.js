import React, {useState} from 'react';
import SharedContext from './SharedContext';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import PieChart from './piechart';
const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      'backgroundColor': theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function Demo() {
  const [selectedDemand, setSelectedDemand] = useState('Pick a Statement');
  const [selectedJob, setSelectedJob] = useState('Job Title');
  const [data, setData] = useState({});

  const handleDemandChange = event => {
    setSelectedDemand(event.target.value);
    console.log('changed to:', event.target.value)
  }

  const handleJobChange = event => {
    setSelectedJob(event.target.value);
    console.log('changed to:', event.target.value)
  }
  /*
    Issue: This guarantees that the fetched in url is always valid.
    When invalid url gets passed, connection to db breaks and 
    prevents any  submit buttons from having dv, even is dropdown 
    values change. Forcing us to reconnect via rs. 
    Fix: Resets values to default, and alerts.
   */
  const constructURL = event => {
    if(selectedDemand == 'Pick a Statement'){
      setSelectedDemand('Pick a Statement');
      alert("Please pick a statement");
    } else if(selectedDemand == 'Most Popular Fields') {
      if(selectedJob!= 'Job Title'){
        alert("Please do not select a job title");
      }
      return `http://localhost:3010/v0/data/${selectedDemand}`;  
    }
    else if (selectedJob == 'Job Title') {
      setSelectedJob('Job Title');
      alert("Please select a job title");
    } else{
      return `http://localhost:3010/v0/data/${selectedDemand}/${selectedJob}`;
    }
  }
        
  const handleSubmit = event => {
    let url = constructURL();
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setData(json)
      })
      .catch((error) => {
        // should throw some user interface
          alert('invalid input');
      });
  }

  return (
    <div>
      <SharedContext.Provider value={{
        selectedDemand, setSelectedDemand,
        selectedJob, setSelectedJob,
        data, setData
      }}
      >
        <div id="selections">
          <div className="select">
            <select onChange={handleDemandChange}>
              <option>Pick a Statement</option>
              <option>Most in Demand Skills</option>
              <option>Most in Demand Languages</option>
              <option>Most Popular Fields</option>
              <option>What Degrees are Needed</option>
            </select>
          </div>
          <br/><br/>
          <div className="select">
            <select onChange={handleJobChange}>
              {/* Maybe these options can disappear when Most Popular Fields is selected? */}
              <option>Job Title</option>
              <option>Web Developer</option>
              <option>null</option>
            </select>
          </div>
          <br/><br/>
          <button className="button is-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <PieChart ></PieChart>
        <br/><br/>
      </SharedContext.Provider>
    </div>
  )
}

/**
 * @return {object} JSX
 */
