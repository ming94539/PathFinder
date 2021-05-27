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
  const [selectedDemand, setSelectedDemand] = useState('Skills');
  const [selectedJob, setSelectedJob] = useState('Web Developer');
  const [data, setData] = useState({});
  const [chartDrawn, setChartDrawn] = useState(false);
  const [checkDisable, setDisable] = useState(false);
  const [drawnStates, setDrawnStates] = useState([false, false]);
  // const drawnStates2 = [false, false];
  
  const handleSubmit = (event, id) => {
    console.log("curr id is:", id);
    let demand = event.target.innerHTML;
    if (demand == selectedDemand) return;
    setSelectedDemand(demand);

    // let url = constructURL();
    let url = `http://localhost:3010/v0/data/${demand}/${selectedJob}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        // chartDrawn = true;
        
        // setChartDrawn(true);
        setData(json);
        console.log('got data:', json);
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
    if (cards.length+1 == 2) {
      setDisable(true);
    }
  }

  const handleJobChange = event => {
    setSelectedJob(event.target.value);
    console.log(event.target.value)
  }
  
  const [numCards, setNumCards] = useState(0);

  function removeDisabled(key) {
    setDisable(false);
    // Fixes bug where removing left card would sometimes remove both left and right cards
    setCards(prevCards => {
      return (prevCards.filter(card => card.key != key))
    });
    setNumCards(prevNumCards => {
      return (prevNumCards-1);
    });
  }

  const newCard = (selectedJob, id) => {
    return (
      <div className="card mx-6" key={id}>
        <header className="message is-info">
          <div className="card-header-title is-centered">
            <button className="delete" onClick={() => removeDisabled(id)}></button>
            <div className="select">
              <select onChange={handleJobChange}>
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
          <button className="card-footer-item button is-primary mx-3" onClick={event => {handleSubmit(event, id)}}>Languages</button>
          <button className="card-footer-item button is-primary mx-3" onClick={event => {handleSubmit(event, id)}}>Skills</button>
        </footer>
      </div>
    )
  }

  const [cards, setCards] = useState([newCard('Web Developer', 0)]);

  useEffect(() => {
    // console.log('dispatching with data:', data);
    // const updateEvt = new CustomEvent('chartUpdate', {detail: data});
    // document.dispatchEvent(updateEvt);
  })

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
        <section className="section">
          <button id="submitButton" className="button is-primary mb-5 has-text-centered" onClick={addCard} disabled={checkDisable}>
            <span className="icon"><i className="fa fa-plus"></i></span>
            <span>New Card</span>
          </button>

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
        </section>
        {/* <PieChart ></PieChart> */}
        <br/><br/>
      </SharedContext.Provider>
    </div>
  )
}

/**
 * @return {object} JSX
 */
