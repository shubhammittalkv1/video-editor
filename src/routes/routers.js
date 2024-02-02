import { Routes, Route } from 'react-router-dom';
import VideoEditor from "./video-editor/video-editor";
function Routers() {
  return (
    <Routes>
      <Route path="/" element={<VideoEditor />} />
    </Routes>
  );
}                                                           
export default Routers;