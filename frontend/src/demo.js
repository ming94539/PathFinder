import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import BarChart from './barchart';
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
/**
 * @return {object} JSX
 */
export default function CustomizedMenus() {
  let selectedDemand = 'Most in Demand Skills';
  let selectedJob = 'Web Developer';

  // temp name?
  function selectDemand(demand) {
    // somehow pass selection into table_data.js
    console.log('selected demand:', demand.target.value);
    selectedDemand = demand.target.value;
  }

  function selectJob(job) {
    // somehow pass selection into table_data.js
    console.log('selected job:', job.target.value);
    selectedJob = job.target.value;
  }

  const handleSubmit = (event) => {
    console.log("hi");
    // let url = `http://localhost:3010/v0/data/${selectedJob}`;
    // console.log(url);
    fetch(`http://localhost:3010/v0/data/${selectedDemand}`)
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          console.log(json);
        })
        .catch((error) => {
          console.log(error);
        });
  };
  return (
    <div>
      <div className="select">
        <select onChange={(selection) => selectDemand(selection)}>
          <option>Most in Demand Skills</option>
          <option>textholder</option>
          <option>textholder</option>
        </select>
      </div>
      <br/>
      <div className="select">
        <select onChange={(selection) => selectJob(selection)}>
          <option>Job Title</option>
          <option>Web Developer</option>
          <option>textholder</option>
        </select>
      </div>
      <br/>
      <button className="button is-link" onClick={handleSubmit}>
        Submit (doesn't work yet)
      </button>
      <br/><br/>

      <BarChart/>
    </div>
  );
}
