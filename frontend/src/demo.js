import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import SharedContext from './SharedContext';
import PieChart from './piechart';
import './style.css';

// jest.config.js
// Sync object
// /** @type {import('@jest/types').Config.InitialOptions} */
// const config = {
//   verbose: true,
// };

// module.exports = config;
// https://stackoverflow.com/questions/55724642/react-useeffect-hook-when-only-one-of-the-effects-deps-changes-but-not-the-oth
const useEffectWhen = (effect, deps, whenDeps) => {
  // console.log('[useEffectWhen] (effect, deps, whenDeps):',
    // effect +'; ' + deps +'; ' + whenDeps);
  const whenRef = useRef(whenDeps || []);
  // console.log('whenRef:', whenRef);
  const initial = whenRef.current === whenDeps;
  // console.log('Initial:', initial);
  const whenDepsChanged = 
    initial || !whenRef.current.every((w, i) => w === whenDeps[i]);
  // console.log('whenDepsChanged:', whenDepsChanged);
  whenRef.current = whenDeps;
  const nullDeps = deps.map(() => null);

  return useEffect(
    whenDepsChanged ? effect : () => {},
    whenDepsChanged ? deps : nullDeps
  );
};

// const useEffectWhen = (effect, deps, whenDeps) => {
  
// }

export default function Demo() {
  const initialDemand = 'Languages';
  const initialJob = 'Web Developer';
  const initialData = [
        {value: 'postgresql', count: 8},
        {value: 'javascript', count: 5},
        {value: 'css', count: 4}
      ]
  // const [selectedDemands, setSelectedDemands] = useState([{id: 0, demand: initialDemand}]);
  // const [selectedJobs, setSelectedJobs] = useState([{id: 0, job: initialJob}]);
  const [selectedDemands, setSelectedDemands] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [data, setData] = useState([{id: 0, data: initialData}]);
  const [checkDisable, setDisable] = useState(false);
  const [currID, setCurrID] = useState(-1);
  const [cards, setCards] = useState([]);
  
  const handleSubmit = (event, id) => {
    console.log('Demands:', selectedDemands);
    // console.log("curr id is:", id);
    let demand = event.target.innerHTML;
    let demandEntry = selectedDemands.find(e => e.id==id);
    if (demandEntry && demand == demandEntry.demand) return;
    console.log('[handleSubmit] Updating with new demand:', demand);
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
    // let url = constructURL();
    let url = `http://localhost:3010/v0/data/${demand}/${job}`;
    // let url = `v0/data/${demand}/${job}`;
    // console.log('fetching url:', url);
    // console.log('[query] Querying with demand:', demand);
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

        // let card = cards.find(card => card.key==id);
        // if (!card) {
        //   console.log('Card does not exist at id:', id, cards);
        //   return;
        // }
        // console.log('card:', card);
        // ReactDOM.render(<PieChart id={id} data={json} />, card);
        // <PieChart id={id} data={json}/>;
      })
      .catch((error) => {
        console.log('[handleSubmit] Error fetching data');
        console.log(error);
        // should throw some user interface
          // alert('invalid input');
    });
  }

  const addCard = () => {
    // console.log('adding card with id:', currID+1);
    setCards(prevCards => {
      return ([
        ...prevCards,
        newCard(currID+1)
      ])
    });
    // setSelectedDemands(prevDemands => {
    //   return ([
    //     ...prevDemands,
    //     {id: currID+1, demand: initialDemand}
    //   ]);
    // });
    let newDemands = selectedDemands;
    newDemands.push({id: currID+1, demand: initialDemand});
    setSelectedDemands(newDemands);

    let newJobs = selectedJobs;
    newJobs.push({id: currID+1, job: initialJob});
    setSelectedJobs(newJobs);
    query(initialDemand, initialJob, currID+1);
  
    if (cards.length >= 1) {
      setDisable(true);
    }
    setCurrID(prevID => {
      return (prevID+1);
    });
  }

  
  // useEffect(() => {
  //   console.log('[useEffect | selectedDemands] Querying using initialDemand:', initialDemand);
  //   query(initialDemand, currID);
  // }, [selectedDemands]);
  
  function deleteCard(id) {
    // console.log('deleting with id:', id);
    setDisable(false);
    // Fixes bug where removing left card would sometimes remove both left and right cards
    setCards(prevCards => {
      return (prevCards.filter(card => card.key != id))
    });
    setData(prevData => {
      return (prevData.filter(e => e.id != id));
    });
    
    // Decrement id of cards to the right of deleted card
    // for (let i=id; i < cards.length; ++i) {
    //   console.log('[deleteCard] Decrementing id of pie:', id);
    //   document.getElementById(`pie${i}`).id = `pie${i-1}`;
    // }
  }
  
  const handleJobChange = (event, id) => {
    let job = event.target.value;
    let newSelectedJobs = selectedJobs;
    let jobEntry = newSelectedJobs.find(e => e.id==id);
    if (jobEntry) jobEntry.job = job;
    else newSelectedJobs.push({id: id, job: job});
    setSelectedJobs(newSelectedJobs);
    // console.log(`[handleJobChange] Set job to ${job} at ID: ${id}`);
    // updateJobs(id, )
    // setSelectedJob(event.target.value);
    // console.log(event.target.value)
  }

  const newCard = (id) => {
    return (
      <div className="card mx-6" key={id}>
        <header className="message is-info">
          <div className="card-header-title is-centered">
            <button className="delete" onClick={() => deleteCard(id)}></button>
            <div className="select">
              <select onChange={event => handleJobChange(event, id)}>
                <option>Web Developer</option>
                <option>null</option>
              </select>
            </div>
          </div>
        </header>
        <div className="box">
          <div id={`pie${id}`}></div>
          <PieChart id={id} />
        </div>
          <div className="card-content">
          {/* <p>content here</p> */}
        </div>
        {/* TODO: Change selected button color */}
        <footer className="card-footer">
          <button className="card-footer-item button is-primary mx-3" onClick={event => {handleSubmit(event, id)}}>Languages</button>
          <button className="card-footer-item button is-primary mx-3" onClick={event => {handleSubmit(event, id)}}>Skills</button>
        </footer>
      </div>
    )
  }

  // Init
  useEffect(() => {
    addCard();
  }, []);

  // When data is added
  useEffect(
    () => console.log('useEffect', data),
    [data]
  );

  // When data is updated
  useEffectWhen(() => {
    console.log("useEffectWhen", data, data.length)
  }, [data, data.length], [data.length]);

  // useEffect((e) => {
  //   // console.log("logged");
  //   console.log('e:', e);
  //   // if new data, draw chart

  //   // else, update chart with event listener

  //   console.log('[useEffect] Data updated to:', data);
  //   const updateEvt = new CustomEvent('chartUpdate', {detail: data});
  //   document.dispatchEvent(updateEvt);
  // }, [data]);

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
    let newData = data;
    let entry = newData.find(e => e.id == id);
    if (entry) entry.data = json;
    else newData.push({id: id, data: json});
    console.log('Updating data to:', newData);
    setData(newData);
  }

  return (
    <div>
      <SharedContext.Provider value={{
        selectedJobs, setSelectedJobs,
        selectedDemands, setSelectedDemands,
        data, setData,
        // checkDisable, setDisable,
        currID, setCurrID
      }}
      >
        <section className="section">
          <button id="submitButton" className="button is-primary mb-5 has-text-centered" onClick={addCard} disabled={checkDisable}>
            <span className="icon"><i className="fa fa-plus"></i></span>
            <span>New Card</span>
          </button>
          <div className="cards-wrapper">
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
