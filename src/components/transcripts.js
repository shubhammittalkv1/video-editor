import {useState} from "react";
import Trash from "../assets/images/trash.svg"
const transcriptTabOptionsEnum = {
    transcript: "transcripts",
    summary: "summary"
}
function Transcripts(props) {
    const [currentTab, setCurrentTab] = useState(transcriptTabOptionsEnum.transcript);
    const [transcriptData, setTranscriptData] = useState(props.data);
    // Below is the code used when user click on the Delete Transcript Icon
    const deleteTranscript = (data, indexValue) => {
        const startingPoint = data.time;
        const endPoint = indexValue === transcriptData.length-1 ? "##:##": transcriptData[indexValue+1].time;
        props.deleteTranscriptFromVideo(startingPoint, endPoint, indexValue);
    }
    // End of the above code
    return (
        <div>
            <div className="card transcript-container">
                <div className="card-header transcript-header">
                    <label onClick={()=> setCurrentTab(transcriptTabOptionsEnum.transcript)} className={currentTab === transcriptTabOptionsEnum.transcript ? "transcript-page-tabs active" : "transcript-page-tabs"}>Transcripts</label>
                    <label onClick={()=> setCurrentTab(transcriptTabOptionsEnum.summary)} className={currentTab === transcriptTabOptionsEnum.summary ? "transcript-page-tabs active" : "transcript-page-tabs"}>Summary</label>
                </div>
                <div className="card-body transcript-body">
                    {currentTab === transcriptTabOptionsEnum.transcript ? <div className="row m-0">
                        {/* Below is the Single Block */}
                        {!!transcriptData && transcriptData.length !== 0 ? transcriptData.map((data, index) => (<div className="transcript-user-container p-0" key={index}>
                            <div className="row m-0 col-12 p-0">
                                <div className="col-1 p-0"><span className="transcript-user-initial">{data.initials}</span></div>
                                <span className="transcript-user-name col-9 pl-1">{data.author} <span className="transcript-time">{data.time}</span></span>
                                {props.isTranscriptedDeleted !== true? <div className="col-2 transcript-delete"><img className="transcript-trash" src={Trash} alt="Vidoso Trash Icon" onClick={()=>deleteTranscript(data, index)} /></div> : <></>}
                            </div>
                            <div className="row m-0 col-12 transcript-text-container">
                                <div className="col-1 p-0"></div>
                                <p className="col-11 pl-1 transcript-text pr-0">{data.content}</p>
                            </div>
                        </div>)): <></>}
                        {/* End of the above Block */}
                    </div> : <p className="transcript-summary-section">Summary is not created yet</p>}
                </div>
            </div>
        </div>
    );
}

export default Transcripts;
