import Logo from "../../../assets/images/vidoso-ai-logo.svg"
function VidosoHeader() {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
            <a className="navbar-brand" href="#">
                <img src={Logo} alt="vidoso-logo"  height="40" />
            </a>
            </div>
        </nav>
    );
  }
  
  export default VidosoHeader;
  
