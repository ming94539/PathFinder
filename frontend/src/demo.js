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
  const [chartDrawn, setChartDrawn] = useState(false);
  const [checkDisable, setDisable] = useState(false);
  // let chartDrawn = false;
  
  const handleSubmit = event => {
    console.log("curr id is:", numCards);
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
        // setData(json);
        setData([
          {value: 'less', count: 8},
          {value: 'adobe photoshop', count: 5},
          {value: 'js', count: 3},
        ])
        // chartDrawn = true;
        setChartDrawn(true);
      })
      .catch((error) => {
        // should throw some user interface
          // alert('invalid input');
      });

      
  }

  const addCard = () => {

    console.log('adding card with id:', numCards);
    setChartDrawn(false);
    setNumCards(prevNumCards => {
      return prevNumCards+1;
    });
    setCards(prevCards => {
      return ([
        ...prevCards,
        newCard(selectedJob, numCards+1)
      ])
    });
      setDisable(true);
  }
  
  const [numCards, setNumCards] = useState(0);

  function removeDisabled() {
    setDisable(false);
  }

  const newCard = (selectedJob, id) => {

    return (
      <div className="card">
        <header class="message is-info">
          <div className="card-header-title">{selectedJob}
          <button class="delete" onClick={removeDisabled}></button>
          </div> 
        </header>
        <div className="box">
          <div id={`pie${id}`}></div>
        </div>
          <div className="card-content">
          <PieChart id={id} chartDrawn={chartDrawn}/>
          <p>content here</p>
        </div>
        <footer className="card-footer">
          <button className="button is-primary" onClick={handleSubmit}>Language</button>
          <button className="button is-primary" onClick={handleSubmit}>Skills</button>
        </footer>
      </div>
    )
  }

  // setNumCards(prevNumCards => {
  //   return prevNumCards+1;
  // });
  const [cards, setCards] = useState([newCard('Web Developer', 0)]);
  


  // setCards([newCard('Web Developer')]);


  useEffect(() => {
    // console.log('dispatching with data:', data);
    // console.log('effect');
    const updateEvt = new CustomEvent('chartUpdate', {detail: data});
    document.dispatchEvent(updateEvt);
  })


  const handleJobChange = event => {
    setSelectedJob(event.target.value);
    console.log(event.target.value)
  }




  return (
    <div>
      <SharedContext.Provider value={{
        selectedDemand, setSelectedDemand,
        selectedJob, setSelectedJob,
        data, setData,
        checkDisable, setDisable,
        // chartDrawn, setChartDrawn,
        numCards, setNumCards
      }}
      >

        <div id="selections">
          <div className="scrolling-wrapper">
            {cards}
          </div>
          <br/><br/>
          <div className="select">
            <select onChange={handleJobChange}>
              <option>Job Title</option>
              <option>Web Developer</option>
              <option>null</option>
            </select>
          </div>
          <br/><br/>
          <button className="button is-primary" onClick={addCard} disabled={checkDisable}>
            Submit
          </button>
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
