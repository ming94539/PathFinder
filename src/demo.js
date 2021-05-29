import React, {useState, useEffect} from 'react';
import SharedContext from './SharedContext';
import PieChart from './piechart';
import './style.css';

export default function Demo() {
  const [selectedDemand, setSelectedDemand] = useState('');
  const [selectedJob, setSelectedJob] = useState('Web Developer');
  const [data, setData] = useState([]);
  const [chartDrawn, setChartDrawn] = useState(false);
  const [checkDisable, setDisable] = useState(false);
  const [drawnStates, setDrawnStates] = useState([false, false]);
  const [currID, setCurrID] = useState(0);
  // const drawnStates2 = [false, false];
  
  const handleSubmit = (event, id) => {
    console.log("curr id is:", id);
    let demand = event.target.innerHTML;
    if (demand == selectedDemand) return;
    setSelectedDemand(demand);

    // let url = constructURL();
    let url = `http://localhost:3010/v0/data/${demand}/${selectedJob}`;
    // setData(prevData => {
    //   return ([
    //     ...prevData,
    //     {id: currID, url: url}
    //   ]);
    // });

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        // chartDrawn = true;
        // setData([
        //   {value: 'postgresql', count: 8},
        //   {value: 'javascript', count: 5},
        //   {value: 'css', count: 4}
        // ])
        // setData(json);
        
        setChartDrawn(true);

        let newData = data;
        console.log('newData:', newData);

        console.log('id:', id);
        let check = newData.find((o, i) => {
          console.log('finding', o);
          if (o.id == id) {
              o.data = json;
              console.log('found')
              return true;
          }
        })
        console.log('check:', check);
        if (!check) {
            newData.push({id: id, data: json});
            console.log('append')
        }

        setData(newData);

        // let check = data.find((o, idx) => {
        //   console.log('chart:', chart, 'id:', id);
        //   if (o.id == id) {
        //     setData(prevData => {
        //       return prevData.filter(e => e.id != id);
        //     });
        //     setData(prevData => {
        //       return ([
        //         ...prevData,
        //         {id: id, data: json}
        //       ])
        //     })
        //     // let temp = data;
        //     // temp[idx].data = json;
        //     // setData(temp);
        //     console.log('updating data');
        //     return true;
        //   }
        // });
        // if (!check) {
        //   console.log('appending data');
        //   setData(prevData => {
        //     return ([
        //       ...prevData,
        //       {id: id, data: json}
        //     ]);
        //   });
        // }

      })
      .catch((error) => {
        // should throw some user interface
          // alert('invalid input');
      });
  }

  const addCard = () => {
    let card_idx = cards.length;
    // console.log('adding card with id:', currID+1);
    setChartDrawn(false);
    setCards(prevCards => {
      return ([
        ...prevCards,
        newCard(currID+1)
      ])
    });
    // console.log('before:', currID);
    setCurrID(prevID => {
      return (prevID+1);
    });
    // console.log('after:', currID);
    if (card_idx == 1) {
      setDisable(true);
    }
  }

  const handleJobChange = event => {
    setSelectedJob(event.target.value);
    console.log(event.target.value)
  }
  
  function removeDisabled(key) {
    console.log('deleting with key:', key);
    setDisable(false);
    // Fixes bug where removing left card would sometimes remove both left and right cards
    setCards(prevCards => {
      return (prevCards.filter(card => card.key != key))
    });

    // Decrement id of cards to the right of deleted card
    for (let i=key; i < cards.length; ++i) {
      document.getElementById(`pie${i}`).id = `pie${i-1}`;
    }
  }

  const newCard = (id) => {
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
          {/* <p>content here</p> */}
        </div>
        <footer className="card-footer">
          <button className="card-footer-item button is-primary mx-3" onClick={event => {handleSubmit(event, id)}}>Languages</button>
          <button className="card-footer-item button is-primary mx-3" onClick={event => {handleSubmit(event, id)}}>Skills</button>
        </footer>
      </div>
    )
  }

  const [cards, setCards] = useState([newCard(0)]);

  useEffect(() => {
    // console.log("logged");
    // console.log('dispatching with data:', data);
    
    const updateEvt = new CustomEvent('chartUpdate', {detail: data});
    document.dispatchEvent(updateEvt);
  })

  return (
    <div>
      <SharedContext.Provider value={{
        selectedDemand, setSelectedDemand,
        selectedJob, setSelectedJob,
        data, setData,
        checkDisable, setDisable,
        currID, setCurrID
        // chartDrawn, setChartDrawn,
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
