import React, {useState, useEffect} from 'react';
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
import './style.css';
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
  // const [chartDrawn, setChartDrawn] = useState(false);
  let chartDrawn = false;
  
  const handleSubmit = event => {
    let demand = event.target.innerHTML;
    console.log('selected demand:', demand);
    setSelectedDemand(demand);

    // let url = constructURL();
    let url = `http://localhost:3010/v0/data/${selectedDemand}/${selectedJob}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        setData(json);
        chartDrawn = true;
        // setChartDrawn(true);
      })
      .catch((error) => {
        // should throw some user interface
          // alert('invalid input');
      });
  }

  const addCard = () => {
    console.log('adding card with id:', numCards);
    setNumCards(prevNumCards => {
      return prevNumCards+1;
    });
    setCards(prevCards => {
      return ([
        ...prevCards,
        newCard(selectedJob, numCards+1)
      ])
    });
  }

  const handleJobChange = event => {
    setSelectedJob(event.target.value);
    console.log(event.target.value)
  }
  
  const [numCards, setNumCards] = useState(0);

  const newCard = (selectedJob, id) => {
    return (
      <div className="card mx-6" key={id}>
        <header className="card-header">
          {/* <p className="card-header-title is-centered">{selectedJob}</p>  */}
          <div className="card-header-title is-centered">
            <div className="select">
              <select onChange={handleJobChange}>
                <option>Job Title</option>
                <option>Web Developer</option>
                <option>null</option>
              </select>
            </div>
          </div>
        </header>
        <div className="box">
          <div id={`pie${id}`}></div>
          <PieChart id={id} chartDrawn={chartDrawn}/>
        </div>
          <div className="card-content">
          <p>content here</p>
        </div>
        <footer className="card-footer">
          <button className="card-footer-item button is-primary mx-3" onClick={handleSubmit}>Language</button>
          <button className="card-footer-item button is-primary mx-3" onClick={handleSubmit}>Skills</button>
        </footer>
      </div>
    )
  }

  // setNumCards(prevNumCards => {
  //   return prevNumCards+1;
  // });
  const [cards, setCards] = useState([
    newCard('Web Developer', 0), newCard('Web Developer', 1)]);
  // setCards([newCard('Web Developer')]);


  useEffect(() => {
    // console.log('dispatching with data:', data);
    // console.log('effect');
    const updateEvt = new CustomEvent('chartUpdate', {detail: data});
    document.dispatchEvent(updateEvt);
  })

  

  /*
    Issue: This guarantees that the fetched in url is always valid.
    When invalid url gets passed, connection to db breaks and 
    prevents any  submit buttons from having dv, even is dropdown 
    values change. Forcing us to reconnect via rs. 
    Fix: Resets values to default, and alerts.
   */
  // const constructURL = event => {
    // if (selectedDemand === 'Skills')

    // if(selectedDemand == 'Pick a Statement'){
    //   setSelectedDemand('Pick a Statement');
    // } else if(selectedDemand == 'Most Popular Fields') {
    //   if(selectedJob!= 'Job Title'){
    //   }
    //   return `http://localhost:3010/v0/data/${selectedDemand}`;  
    // }
    // else if (selectedJob == 'Job Title') {
    //   setSelectedJob('Job Title');
    // } else{
    
    // }
  // }

  

  return (
    <div>
      <SharedContext.Provider value={{
        selectedDemand, setSelectedDemand,
        selectedJob, setSelectedJob,
        data, setData,
        // chartDrawn, setChartDrawn,
        numCards, setNumCards
      }}
      >
        <div className="section">
          {/* <div className="columns is-mobile is-centered">
            <div className="card">
              <header className="card-header">
                <p className="card-header-title is-centered"></p>
              </header>
            </div>

          </div> */}

          <div className="cards-wrapper">
            {cards}
          </div>
          {/* <div className="select">
            <select onChange={handleDemandChange}>
              <option>Pick a Statement</option>
              <option>Most in Demand Skills</option>
              <option>Most in Demand Languages</option>
              <option>Most Popular Fields</option>
              <option>What Degrees are Needed</option>
            </select>
          </div> */}
          <br/><br/>
          {/* <div className="select">
            <select onChange={handleJobChange}>
              <option>Job Title</option>
              <option>Web Developer</option>
              <option>null</option>
            </select>
          </div>
          <br/><br/> */}
          {/* <button className="button is-primary" onClick={addCard}>
            Submit
          </button> */}
        </div>
        {/* <PieChart ></PieChart> */}
        <br/><br/>
      </SharedContext.Provider>
    </div>
  )
}

/**
 * @return {object} JSX
 */
