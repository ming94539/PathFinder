import React, {useState, useEffect, useRef} from 'react';
import piechart from './piechart';
import './style.css';

// https://stackoverflow.com/questions/55724642/react-useeffect-hook-when-only-one-of-the-effects-deps-changes-but-not-the-oth
/**
 * 
 */
const useEffectWhen = (effect, deps, whenDeps) => {
  const whenRef = useRef(whenDeps || []);
  const initial = whenRef.current === whenDeps;
  const whenDepsChanged = 
    initial || !whenRef.current.every((w, i) => w === whenDeps[i]);
    whenRef.current = whenDeps;
    const nullDeps = deps.map(() => null);

  return useEffect(
    whenDepsChanged ? effect : () => {},
    whenDepsChanged ? deps : nullDeps
  );
};


export default function Demo() {
  const initialDemand = 'Languages';
  const initialJob = 'Web Developer';
  const [selectedDemands, setSelectedDemands] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [ data, setData] = useState([]);
  const [checkDisable, setDisable] = useState(false);
  const [currID, setCurrID] = useState(-1);
  const [cards, setCards] = useState([]);
  let buttonsArr = [
    <button className="card-footer-item button is-link mx-3"
      onClick={event => {handleSubmit(event, currID+1)}}
      key={'Languages'}
    >
      Languages
    </button>
  ];
  for (let demand of ['Skills', 'Degrees', 'Education', 'Industries']) {
    buttonsArr.push(
      <button className="card-footer-item button is-primary mx-3"
        onClick={event => {handleSubmit(event, currID+1)}}
        key={demand}
      >
        {demand}
      </button>
    );
  }
  const [buttons, setButtons] = useState([{id: 0, buttons: buttonsArr}]);
  const subheader = useRef('Top 20 Languages');

  // Init
  useEffect(() => {
    if (cards.length < 1) {
      addCard();
    }
  }, []);
  
  function handleSubmit (event, id) {
    let allButtons = document.getElementsByClassName('is-link')
    for (let button of allButtons) {
      button.className = "card-footer-item button is-primary mx-3"
    }
    event.target.className = "card-footer-item button is-link mx-3";

    let demand = event.target.innerHTML;
    let demandEntry = selectedDemands.find(e => e.id==id);
    if (demandEntry && demand == demandEntry.demand) return;
    updateDemands(id, demand);

    let jobEntry = selectedJobs.find(e => e.id==id)
    if (!jobEntry) {
      console.log('[handleSubmit] Could not find job at id:', id);
      console.log('All jobs:', selectedJobs);
      return;
    }

    if (demand == 'Degrees' || demand == 'Education') {
      subheader.current.innerHTML = `${demand}`;
    } else {
      subheader.current.innerHTML = `Top 20 ${demand}`;
    }
    
    query(demand, jobEntry.job, id);
  }

  function query(demand, job, id) {
    let url = `http://localhost:3010/v0/data/${demand}/${job}`;
    // let url = `https://pathfinder0.herokuapp.com/v0/data/${demand}/${job}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        let json = response.json();
        console.log('response:', response);
        return json;
        // return response.json();
      })
      .then((json) => {
        // setData([
        //   {value: 'postgresql', count: 8},
        //   {value: 'javascript', count: 5},
        //   {value: 'css', count: 4}
        // ])
        updateData(id, json);
      })
      .catch((error) => {
        console.log('[handleSubmit] Error fetching data');
        console.log(error);
        // should throw some user interface
          alert('invalid input');
    });
  }

  function addCard() {
    setCards(prevCards => {
      return ([
        ...prevCards,
        newCard(currID+1)
      ])
    });
    let newDemands = selectedDemands;
    newDemands.push({id: currID+1, demand: initialDemand});
    setSelectedDemands(newDemands);

    let newJobs = selectedJobs;
    newJobs.push({id: currID+1, job: initialJob});
    setSelectedJobs(newJobs);

    query(initialDemand, initialJob, currID+1);

    // setButtons(prevButtons => {
    //   let demands = ['Languages', 'Skills', 'Degrees', 'Education', 'Industries'];
    //   let buttonsArr = [];
    //   for (let demand in demands) {
    //     buttonsArr.push(
    //       <button className="card-footer-item button is-primary mx-3"
    //         onClick={event => {handleSubmit(event, currID+1)}}
    //         key={demand}>{demand}</button>
    //     )
    //   }
    //   return ([
    //     ...prevButtons,
    //     {id: currID+1, buttons: buttonsArr
          // <button className="card-footer-item button is-primary mx-3"
          //   onClick={event => {handleSubmit(event, currID+1)}}
          //   key={"Languages"}>Languages</button>,
          // <button className="card-footer-item button is-primary mx-3" 
          //   onClick={event => {handleSubmit(event, currID+1)}}
          //   key={"Skills"}>Skills</button>,
          // <button className="card-footer-item button is-primary mx-3" 
          // onClick={event => {handleSubmit(event, currID+1)}}
          // key={"Degrees"}>Degrees</button>

      //   }
      // ])
    // })

    setCurrID(prevID => {
      return (prevID+1);
    });
  };
  
  function deleteCard(id) {
    setDisable(false);
    setCards(prevCards => {
      return (prevCards.filter(card => card.key != id))
    });
    setData(prevData => {
      return (prevData.filter(e => e.id != id));
    });
  }
  
  const handleJobChange = (event, id) => {
    let job = event.target.value;
    let newSelectedJobs = selectedJobs;
    let jobEntry = newSelectedJobs.find(e => e.id==id);
    if (jobEntry) jobEntry.job = job;
    else newSelectedJobs.push({id: id, job: job});
    setSelectedJobs(newSelectedJobs);

    let demandEntry = selectedDemands.find(e => e.id==id);
    if (!demandEntry) return;
    query(demandEntry.demand, job, id);
  }

  /**
   * Returns new card element
   * @param   {int} id  ID of card to create
   * @return  {JSX} The new card
   */
  function newCard (id) {
    return (
      <div className="card mx-6" key={id}>
        <header className="message is-info">
          <div className="card-header-title is-centered">
            <div className="select">
              <select onChange={event => handleJobChange(event, id)}>
                <option>Web Developer</option>
                <option>Database Administrator</option>
                <option>Data Engineer</option>
                <option>Data Scientist</option>
                <option>DevOps</option>
                <option>Firmware Engineer</option>
                <option>IT Architect</option>
                <option>Machine Learning Engineer</option>
                <option>Security Analyst</option>
                <option>Systems Architect</option>
              </select>
            </div>
          </div>
        </header>
        <div className="box">
          <div ref={subheader} className="subtitle">Top 20 Languages</div>
          <div id={`pie${id}`}></div>
        </div>
          <div className="card-content">
        </div>
        <footer className="card-footer">
          {buttons.find(e => e.id==id).buttons}
        </footer>
      </div>
    );
  };

  // Update chart on data update
  useEffect(() => {
    const updateEvt = new CustomEvent('chartUpdate', {detail: data});
    document.dispatchEvent(updateEvt);
  });

  // Draw new chart when a new data entry is added
  useEffectWhen(() => {
    if (currID >= 0) {
      setCards(prevCards => {return [...prevCards]});
      piechart(currID, data);
    }
  }, [data, data.length], [data.length]);

  function updateDemands(id, demand) {
    let newDemand = selectedDemands;
    let entry = newDemand.find(e => e.id == id);
    if (entry) entry.demand = demand;
    else newDemand.push({id: id, demand, demand});
    setSelectedDemands(newDemand);
  }

  // random JSDoc example
  /**
   * Update data state
   * @param {int}   id    ID to either update or add
   * @param {Array.<{value: String, count: String}} json  New incoming data
   */
  function updateData(id, json) {
    let newData = data;
    let entry;
    for (let e of newData) {
      if (e.id == id) {
        entry = e;
        break;
      }
    }
    if (entry) {
      entry.data = json;
    }
    else {
      newData.push({id: id, data: json});
    }
    setData(() => {
      return [...newData]
    });
  }

  return (
    <div>
      <section className="section">
        {/* <button id="submitButton" className="button is-primary mb-5 has-text-centered" onClick={addCard} disabled={checkDisable}>
          <span className="icon"><i className="fa fa-plus"></i></span>
          <span className="newCardButton">New Card</span>
        </button> */}
        <div id="initCardSet"className="cards-wrapper">
          {cards}
        </div>
        <br/><br/>
      </section>
      <br/><br/>
    </div>
  )
}

/**
 * @return {object} JSX
 */
