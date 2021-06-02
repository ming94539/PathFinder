import React, {useState, useEffect, useRef} from 'react';
import piechart from './piechart';
import './style.css';

// https://stackoverflow.com/questions/55724642/react-useeffect-hook-when-only-one-of-the-effects-deps-changes-but-not-the-oth
/**
 * Trigger custom hook when WHENDEPS is changed
 * @callback effect The callback function that is executed when WHENDEPS is changed
 * @param deps      The dependencies
 * @param whenDeps  The dependencies that cause the callback function to execute on change
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

/**
 * Function component that handles user interactions
 */
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

  // Add new card on reload
  useEffect(() => {
    if (cards.length < 1) {
      addCard();
    }
  }, []);

   /**
   * Returns new card element
   * @param   {int}     id ID of card to create
   * @return  {Object}  The new card JSX
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

  /**
   * Creates new card and updates states
   */
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

    setCurrID(prevID => {
      return (prevID+1);
    });
  };
  
  /**
   * Delete card at ID
   * NOTE: Not currently being used due to removal of multi card functionality
   * @param {int} id  ID of card to delete
   */
  function deleteCard(id) {
    setDisable(false);
    setCards(prevCards => {
      return (prevCards.filter(card => card.key != id))
    });
    setData(prevData => {
      return (prevData.filter(e => e.id != id));
    });
  }

  /**
   * Requests for queried data using DEMAND and JOB
   * @param {String}  demand  The demand used to determine the query
   * @param {String}  job     The job used to determine the query
   * @param {int}     id      The ID of the card whose data will be updated by query result
   */
  function query(demand, job, id) {
    let url = `http://localhost:3010/v0/data/${demand}/${job}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        updateData(id, json);
      })
      .catch((error) => {
        console.error('[handleSubmit] Error fetching data');
        console.error(error);
        alert('invalid input');
    });
  }

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

  /**
   * Update selectedDemands state
   * Replaces demand at ID if it exists, else creates new entry
   * @param {int}     id      The ID of the card interacted with
   * @param {String}  demand  The name of the demand selected
   */
  function updateDemands(id, demand) {
    let newDemand = selectedDemands;
    let entry = newDemand.find(e => e.id == id);
    if (entry) entry.demand = demand;
    else newDemand.push({id: id, demand: demand});
    setSelectedDemands(newDemand);
  }

  /**
   * Update data state
   * Replaces data at ID if it exists, else creates new entry
   * @param {int}   id    ID to either update or add
   * @param {Array.<{value: String, count: String}} json  New incoming data
   */
  function updateData(id, json) {
    let newData = data;
    let entry = newData.find(e => e.id==id);
    if (entry) entry.data = json;
    else newData.push({id: id, data: json})
    setData(() => {
      return [...newData];
    });
  }

  /**
   * Event handler for selecting a new job
   * @param {MouseEvent}  event The mouse event
   * @param {int}         id    The ID of the card that was interacted with
   */
  function handleJobChange(event, id) {
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
   * @param {MouseEvent}  event The mouse event
   * @param {int}         id    The ID of the card interacted with
   */
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
      console.error('[handleSubmit] Could not find job at id:', id);
      return;
    }

    if (demand == 'Degrees' || demand == 'Education') {
      subheader.current.innerHTML = `${demand}`;
    } else {
      subheader.current.innerHTML = `Top 20 ${demand}`;
    }
    
    query(demand, jobEntry.job, id);
  }

  return (
    <div>
      <section className="section">
        <div className="cards-wrapper">
          {cards}
        </div>
      </section>
    </div>
  )
}