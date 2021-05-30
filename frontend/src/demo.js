import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import SharedContext from './SharedContext';
import PieChart from './piechart';
import './style.css';

export default function Demo() {
  const [selectedDemands, setSelectedDemands] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [data, setData] = useState([]);
  const [checkDisable, setDisable] = useState(false);
  const [currID, setCurrID] = useState(-1);
  const [cards, setCards] = useState([]);
  const initialDemand = 'Languages';
  const initialJob = 'Web Developer';
  
  const handleSubmit = (event, id) => {
    // console.log("curr id is:", id);
    let demand = event.target.innerHTML;
    let demandEntry = selectedDemands.find(e => e.id==id);
    if (demandEntry && demand == demandEntry.demand) return;
    // console.log('[handleSubmit] Updating with new demand:', demand);
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
    // let selectedJobEntry = selectedJobs.find(e => e.id==id);
    // if (!selectedJobEntry) {
    //   console.log('Could not find selected job at id:', id);
    //   return;
    // }
    // let selectedJob = selectedJobEntry.job;
    // console.log('[Query] Selected job:', selectedJob);

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
    setSelectedDemands(prevDemands => {
      return ([
        ...prevDemands,
        {id: currID+1, demand: initialDemand}
      ]);
    });
    let newJobs = selectedJobs;
    newJobs.push({id: currID+1, job: initialJob});
    setSelectedJobs(newJobs)
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
          {/* <PieChart id={id} data={data}/> */}
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

  useEffect(() => {
    // console.log("logged");
    // console.log('dispatching with data:', data);
    const updateEvt = new CustomEvent('chartUpdate', {detail: data});
    document.dispatchEvent(updateEvt);
  }, [data]);

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
    setData(newData);
  }

  return (
    <div>
      <SharedContext.Provider value={{
        // selectedJob, setSelectedJob,
        // data, setData,
        // checkDisable, setDisable,
        // currID, setCurrID
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
