import React, {useState, useEffect, useRef} from 'react';
import SharedContext from './SharedContext';
import piechart from './piechart';
import './style.css';

// https://stackoverflow.com/questions/55724642/react-useeffect-hook-when-only-one-of-the-effects-deps-changes-but-not-the-oth
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

  // Init
  useEffect(() => {
    addCard();
  }, []);
  
  function handleSubmit (event, id) {
    console.log('[handleSubmit] data at submit:', data);
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
    query(demand, jobEntry.job, id);
  }

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

  const addCard = () => {
    setCards(prevCards => {
      return ([
        ...prevCards,
        newCard(currID+1)
      ])
    });
<<<<<<< HEAD
=======

>>>>>>> d50477243a988451f56695cc9aac47f3070469aa
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
    if (!demandEntry) {return;}
    query(demandEntry.demand, job, id);
  }

  function newCard (id) {
    return (
      <div className="card mx-6" key={id}>
        <header className="message is-info">
          <div className="card-header-title is-centered">
            <button className="delete" onClick={() => deleteCard(id)}></button>
            <div className="select">
              <select onChange={event => handleJobChange(event, id)}>
                <option>Web Developer</option>
                <option>Database Administrator</option>
                <option>Data Engineer</option>
                <option>Data Scientist</option>
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
          <div id={`pie${id}`}></div>
        </div>
          <div className="card-content">
        </div>
        {/* TODO: Change selected button color */}
        <footer className="card-footer">
          <button className="card-footer-item button is-primary mx-3" onClick={event => {handleSubmit(event, id)}}>Languages</button>
          <button className="card-footer-item button is-primary mx-3" onClick={event => {handleSubmit(event, id)}}>Skills</button>
          <button className="card-footer-item button is-primary mx-3" onClick={event => {handleSubmit(event, id)}}>Degrees</button>
        </footer>
      </div>
    );
  };

  // When data is updated
  useEffect(() => {
    console.log('[useEffect] Data updated to:', data);
    const updateEvt = new CustomEvent('chartUpdate', {detail: data});
    document.dispatchEvent(updateEvt);
  });

  // When a new data entry added
  useEffectWhen(() => {
    if (currID >= 0) {
      console.log("useEffectWhen with id:", currID);
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
   * Update data
   * @param {int}     id    ID to either update or add
   * @param {Object}  json  New incoming data
   */
  function updateData(id, json) {
    console.log('data before update:', data);
    let newData = data;
    console.log('newData:', newData);
    let entry;
    for (let e of newData) {
      if (e.id == id) {
        entry = e;
        break;
      }
    }
    if (entry) {
      // console.log("[updateData] newData before entry:", newData);
      entry.data = json;
      // console.log("[updateData] newData after entry:", newData);
    }
    else {
      console.log('[updateData] Pushing new data at id:', id);
      newData.push({id: id, data: json});
    }
    // console.log('[updateData] Updating data to:', newData);
    // setData(newData);
    setData(() => {
      return [...newData]
    });
  }

  return (
    <div>
      <SharedContext.Provider value={{
        selectedJobs, setSelectedJobs,
        selectedDemands, setSelectedDemands,
        data, setData,
        // checkDisable, setDisable,
        currID, setCurrID
      }}>
        <section className="section">
          <button id="submitButton" className="button is-primary mb-5 has-text-centered" onClick={addCard} disabled={checkDisable}>
            <span className="icon"><i className="fa fa-plus"></i></span>
            <span className="newCardButton">New Card</span>
          </button>
          <div id="initCardSet"className="cards-wrapper">
            {cards}
          </div>
          <br/><br/>
        </section>
        <br/><br/>
      </SharedContext.Provider>
    </div>
  )
}

/**
 * @return {object} JSX
 */
