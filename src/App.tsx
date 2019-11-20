import React from 'react';
import './App.css';
import Chart from './components/Chart';
import myData from './resources/data.json';
import {Repo} from './types/ChartTypes';

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="GraphContainer">
                <Chart repo={myData as Repo}/>
            </div>
        </div>
    );
}

export default App;
