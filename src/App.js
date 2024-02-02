import Routers from "./routes/routers";
import { ToastContainer } from 'react-toastify';
  import "react-toastify/dist/ReactToastify.css";

function App() {
  return (<>
    <Routers></Routers>
    <ToastContainer
    position="bottom-right"
    draggable={false}
    autoClose={false} />
    </>
  );
}

export default App;
