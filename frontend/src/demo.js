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
import {PieChart} from './piechart';
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
// note: maybe convert this into a class so we can call function to update chart
// export default function CustomizedMenus() {
export class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.props = {selectedDemand: 'Most in Demand Skills',
                  selectedJob: 'Job Title',
                  data: {}
                }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // let selectedDemand = 'Most in Demand Skills';

  // temp name?
  selectDemand(demand) {
    // somehow pass selection into table_data.js
    console.log('selected demand:', demand.target.value);
    this.props.selectedDemand = demand.target.value;
    // selectedDemand = demand.target.value;
  }

  selectJob(job) {
    // somehow pass selection into table_data.js
    console.log('selected job:', job.target.value);
    this.props.selectedJob = job.target.value;
    // selectedJob = job.target.value;
  }

  handleSubmit(event) {

  // }

  // const handleSubmit = (event) => {
    // if(demand is null):
    //   throw red text for now

    fetch(`http://localhost:3010/v0/data/${this.props.selectedDemand}/${this.props.selectedJob}`)
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          data = json;
          console.log('result:', json);
        })
        .catch((error) => {
          // errorMessage = <p style="color: red">Bad Input!</p>
          console.log('error:', error);
        });
  };

  // move handlesubmit to piechart?
  render() {
    return (
      <div>
        <div className="select">
          <select onChange={(selection) => this.selectDemand(selection)}>
            <option>Most in Demand Skills</option>
            <option>textholder</option>
            <option>textholder</option>
          </select>
        </div>
        <br/>
        <div className="select">
          <select onChange={(selection) => this.selectJob(selection)}>
            <option>Job Title</option>
            <option>Web Developer</option>
            <option>textholder</option>
          </select>
        </div>
        <br/>
        <button className="button is-link" onClick={this.handleSubmit}>
          Submit (doesn't work yet)
        </button>
        <br/><br/>
  
        <PieChart />
      </div>
    );
  }
}
