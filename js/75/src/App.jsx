import Address from "./address.jsx";
import Address2 from "./address2.jsx";
import './App.css';
import './address.css';

function App() {

  const address = {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345"
  }

  const { street, city, state, zip } = address;
  return (
    <>
      <h1>hello world!</h1>
      <Address street={street} city={city} state={state} zip={zip} />

      <Address2 address={{ street, city, state, zip }} />

    </>
  )
}

export default App
