import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [num, setNum] = useState(100);
	window.setNum = setNum;
	return <div>{num === 3 ? <Child /> : <span>{num}</span>}</div>;
}

function Child() {
	return <span>liaozejie</span>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
