import React from 'react';
import './App.css';
import Chart from './components/Chart';
import *  as SAMPLE from './resources/SampleChartInput';


const App: React.FC = () => {
  return (
    <div className="App">
      <div className="GraphContainer">
        <Chart repo={SAMPLE.repo}></Chart>
      </div>
    </div>
  );
}

export default App;
