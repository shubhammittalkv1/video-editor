import VidosoHeader from "./vidoso-header/vidoso-header";
import VidosoFooter from "./vidoso-footer/vidoso-footer";
function VidosoLayout( { children }) {
    return (
        <>
            <VidosoHeader></VidosoHeader>
            <div className="vidoso-container">
                {children}
            </div>
            <VidosoFooter></VidosoFooter>
        </>
    );
  }
  
  export default VidosoLayout;
  
