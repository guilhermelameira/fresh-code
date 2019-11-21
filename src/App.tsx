import React from 'react';
import './App.css';
import Chart from './components/Chart';
import myData from './resources/data.json';
import { Repo } from './types/ChartTypes';

const MIN_ZOOM = 80; 
class App extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {zoom: 100};

    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  private zoomIn() {
    this.setState({zoom: Math.max((this.state as any).zoom + 20, MIN_ZOOM)}); 
  }
  private zoomOut() {
    this.setState({zoom: Math.max((this.state as any).zoom - 20, MIN_ZOOM)}); 
  }

  render() {
    return (
      <div className="App">
        <div className="ZoomContainer">
          <button className="ZoomBtn" onClick={this.zoomIn}> Zoom in</button>
          <button className="ZoomBtn" onClick={this.zoomOut}> Zoom out</button>
        </div>
        <div className="GraphContainer" style={{ width: `${(this.state as any).zoom}%`, height: `${(this.state as any).zoom}%`, }}>
          <Chart repo={myData as Repo} />
        </div>
      </div>
    );
  }
}

export default App;
