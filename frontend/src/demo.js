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
  const [selectedDemand, setSelectedDemand] = useState('Most in Demand Skills');
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
  
  const handleSubmit = event => {
    fetch(`http://localhost:3010/v0/data/${selectedDemand}/${selectedJob}`)
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
        console.log('Error fetching data:', error);
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
        <div className="select">
          <select onChange={handleDemandChange}>
            <option>Most in Demand Skills</option>
            <option>textholder</option>
            <option>textholder</option>
          </select>
        </div>
        <br/>
        <div className="select">
          <select onChange={handleJobChange}>
            <option>Job Title</option>
            <option>Web Developer</option>
            <option>textholder</option>
          </select>
        </div>
        <br/>
        <button className="button is-primary" onClick={handleSubmit}>
          Submit
        </button>
        <PieChart ></PieChart>
        <br/><br/>
      </SharedContext.Provider>
    </div>
  )
}

/**
 * @return {object} JSX
 */
// export default function CustomizedMenus() {
// export class Demo extends React.Component {

  

//   constructor(props) {
//     super(props);
//     this.tmp = {selectedDemand: 'Most in Demand Skills',
//                   selectedJob: 'Job Title',
//                   data: {}
//                 }
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.selectDemand = this.selectDemand.bind(this);
//     this.selectJob = this.selectJob.bind(this);
//   }

//   // let selectedDemand = 'Most in Demand Skills';

//   // temp name?
//   selectDemand(demand) {
//     // somehow pass selection into table_data.js
//     console.log('selected demand:', demand.target.value);
//     this.tmp.selectedDemand = demand.target.value;
//     // selectedDemand = demand.target.value;
//   }

//   selectJob(job) {
//     // somehow pass selection into table_data.js
//     console.log('selected job:', job.target.value);
//     this.tmp.selectedJob = job.target.value;
//     // selectedJob = job.target.value;
//   }

//   handleSubmit(event) {

//   // }

//   // const handleSubmit = (event) => {
//     // if(demand is null):
//     //   throw red text for now

//     fetch(`http://localhost:3010/v0/data/${this.tmp.selectedDemand}/${this.tmp.selectedJob}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw response;
//           }
//           return response.json();
//         })
//         .then((json) => {
//           this.tmp.data = json; //?
//           // console.log('result:', json);
//           // this.render();
//         })
//         .catch((error) => {
//           // errorMessage = <p style="color: red">Bad Input!</p>
//           console.log('error:', error);
//         });
//   };

//   // move handlesubmit to piechart?
//   render() {
//     return (
//       <div>
//         <div className="select">
//           <select onChange={(selection) => this.selectDemand(selection)}>
//             <option>Most in Demand Skills</option>
//             <option>textholder</option>
//             <option>textholder</option>
//           </select>
//         </div>
//         <br/>
//         <div className="select">
//           <select onChange={(selection) => this.selectJob(selection)}>
//             <option>Job Title</option>
//             <option>Web Developer</option>
//             <option>textholder</option>
//           </select>
//         </div>
//         <br/>
//         <button className="button is-link" onClick={this.handleSubmit}>
//           Submit (doesn't work yet)
//         </button>
//         <PieChart data={this.tmp.data} ></PieChart>
//         <br/><br/>
//       </div>
//     );
//   }
// }
