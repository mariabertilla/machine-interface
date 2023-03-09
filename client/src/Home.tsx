import { useState, ChangeEvent, FormEvent } from "react";
import "./Home.css";

const Home = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [XAxis, setXAxis] = useState("");
  const [YAxis, setYAxis] = useState("");
  const [ZAxis, setZAxis] = useState("");
  const [cameraOption, setCameraOption] = useState("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<string>('');
  const [sessionIdentity, setSessionIdentity] = useState<string>('');

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };
  
   const handleCameraChange = (event: ChangeEvent<HTMLInputElement>) => {
      setCameraOption(event.target.value);
    };

  const handleXAxisChange = (event: ChangeEvent<HTMLInputElement>) => {
    setXAxis(event.target.value);
  };

  const handleYAxisChange = (event: ChangeEvent<HTMLInputElement>) => {
    setYAxis(event.target.value);
  };

  const handleZAxisChange = (event: ChangeEvent<HTMLInputElement>) => {
    setZAxis(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handlePost();

  };

  const handleCancel = () => {
    console.log(sessionIdentity);
    handleDelete(sessionIdentity);
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      option: selectedOption,
      xAxis: XAxis,
      yAxis: YAxis,
      XAxis: ZAxis,
    }),
  };

  const handlePost = async () => {
    const response = await fetch("http://localhost:4000/position", requestOptions)
      .then((response) => response.json())
      .then((data: any) => {
        setSessionIdentity(data.sessionId);
        setFormSubmitted(true);
        handleGet(data.sessionId);
      });
  };

  const handleGet = async (sessionId1 : string) => {
    let myTimeout : ReturnType<typeof setTimeout>;
    const getStatus = async () => {
      const response = await fetch(`http://localhost:4000/position/${sessionId1}`);
      const data = await response.json();
      fetch(`http://localhost:4000/position/${sessionId1}`)
        .then(response => response.json())
        .then(data =>setSessionData(data.status)); 
      if (data.status !== 'Executed' && data.status !== 'Failed') {
        myTimeout = setTimeout(getStatus, 5000);
      }
      else{
        clearTimeout(myTimeout);
        setFormSubmitted(false);
      }
    };
  
    getStatus();
  };

  const handleDelete = async (sessionId1 : string) => {
    fetch(`http://localhost:4000/position/${sessionId1}`,{ method: 'DELETE' })
      .then(response => response.text())
      .then(data =>setSessionData(data));
  };


  const ProcessDisplay = () => {
    return (
      <div>
        {selectedOption === 'Set Position' &&
          <h2>
            {selectedOption} process has been selected with co-ordinates x axis ={" "}
            {XAxis}, y-axis = {YAxis} and z-axis = {ZAxis}
          </h2>
        }
        {selectedOption === 'Camera' &&
          <h2>
            {selectedOption} is set to be turned {cameraOption}
          </h2>
        }
      </div>
    );
  };

  const PositionParams = () => {
    return(
        <div>
          <label htmlFor="X Axis">X Axis</label>
          <input
            type="text"
            id="XAxis"
            value={XAxis}
            onChange={handleXAxisChange}
            required
          />
          <br />
          <label htmlFor="Y Axis">Y Axis</label>
          <input
            type="text"
            id="YAxis"
            value={YAxis}
            onChange={handleYAxisChange}
            required
          />
          <br />
          <label htmlFor="Z Axis">Z Axis</label>
          <input
            type="text"
            id="ZAxis"
            value={ZAxis}
            onChange={handleZAxisChange}
            required
          />
          <br />
        </div>
)
  }

  const CameraParams = () => {
    return(
      <div>
          <label htmlFor="State">ON/OFF</label>
          <input type="text" id="Camera" required value={cameraOption} onChange={handleCameraChange}/>
        </div>
    )
  }

  return (
    <>
      <div>
        <form name="main" onSubmit={handleSubmit}>
          <label>
            Select an option:
            <select
              value={selectedOption}
              onChange={handleOptionChange}
              required
            >
              <option value="">---Choose option---</option>
              <option value="Set Position">Set Position</option>
              <option value="Camera">Camera</option>
            </select>
          </label>
          {selectedOption === 'Set Position' && <PositionParams />}
          {selectedOption === 'Camera' && <CameraParams />}
          <button type="submit" disabled={formSubmitted}>Submit</button>
          <br />
        </form>
        <form name ="status">
          {formSubmitted && <ProcessDisplay />}
          {sessionData !== null && (<h2>Status : {sessionData}</h2>)}
          {(sessionData === 'Ready' || sessionData === 'Transmitted') ? 
          <button type="button" onClick={handleCancel}>Cancel</button> :
          <button type="button" disabled={true}>Cancel</button> }
        </form>
        
      </div>
    </>
  );
};

export default Home;
