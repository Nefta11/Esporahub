import { BrowserRouter } from 'react-router-dom';
import RouterStack from '@/stack/RouterStack';
import '@/styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <RouterStack />
      </div>
    </BrowserRouter>
  );
}

export default App;