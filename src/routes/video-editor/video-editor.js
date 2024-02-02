import { useEffect, useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Upload } from "antd";
import { toast } from 'react-toastify';
import Transcripts from "../../components/transcripts";
import VidosoLayout from "../../layouts/vidoso-layout/vidoso-layout";
import VideoPlayer from "../../components/video-player";
import SliderRange from "../../components/slider-range";
import transcriptData from "../../core/dictionary/transcripts-details";
import ScissorsIcon from "../../assets/images/scissors.svg";
import RestoreIcon from "../../assets/images/restore.svg";
import UploadIcon from "../../assets/images/upload-image.svg"
import { valueToVideoTimeDuration, convertToHHMMSS, convertTimeIntoSeconds } from "../../core/utils";
const totalVideoDuration = 100;
const ffmpeg = createFFmpeg({ log: true });
function VideoEditor() {
  const [isUploadContainerVisible, setIsUploadContainerVisible] = useState(true);
  const [mainTranscriptData, setMainTranscriptData] = useState(transcriptData);
  const [displayTranscriptData, setDisplayTranscriptData] = useState(transcriptData);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);
  const [isVideoTrimed, setIsVideoTrimed] = useState(false);
  const [isTranscriptedDeleted, setIsTranscriptedDeleted] = useState(false);
  const [displayVideoFile, setDisplayVideoFile] = useState();
  const [displayVideoFileObject, setDisplayVideoFileObject] = useState();
  const [displayVideoState, setDisplayVideoState] = useState();
  const [startTime, setStartTime] = useState(0);
  // Below are the state Variables used for the Slider Ranges
  const [minMaxSliderValue, setMinMaxSliderValue] = useState([0.00, totalVideoDuration]);
  const [currentSliderValues, setCurrentSliderValues] = useState([0.00, totalVideoDuration]);
  const [isCutVideoButtonVisible, setIsCutVideoButtonVisible] = useState(false);
  // End of the above code
  useEffect(() => {
    // Below code is used for loading the ffmpeg at the component mount
    ffmpeg.load().then(() => {
      setIsFfmpegLoaded(true);
    })
    // End of the above code
  },[])
  // Below code is used when the Slider Range Value changed
  useEffect(() => {
    const min = currentSliderValues[0];
    // when the slider values are updated, updating the video time
    if (min !== undefined && displayVideoState && displayVideoFile) {
      displayVideoFile.seek(valueToVideoTimeDuration(displayVideoState.duration, min))
    }
  }, [currentSliderValues])
  // End of the above code
  // Below code is when  Display Video Player State Changed
  useEffect(() => {
    if (displayVideoFile && displayVideoState) {
        // allowing users to watch only the portion of the video selected by the slider
        const [min, max] = currentSliderValues;
        const minTime = valueToVideoTimeDuration(displayVideoState.duration, min)
        if (displayVideoState.currentTime < minTime) {
          displayVideoFile.seek(minTime)
        }
    }
}, [displayVideoState])
  // End of the above code
  // Below code is used when display Video Variable got changed
  useEffect(() => {
    // when the current videoFile is removed, restoring the default state
    if (!displayVideoFile) {
        setDisplayVideoState(undefined)
        setMinMaxSliderValue([0.00, totalVideoDuration])
        setCurrentSliderValues([0.00, totalVideoDuration])
        setDisplayVideoState(undefined)
    }
}, [displayVideoFile])
  // End of the above code
  // Below code is used for uploading the video
  const uploadVideo = (data) => {
    if(!!data){
        setDisplayVideoFile(data);
        // setMainVideoFile(data);
        setDisplayVideoFileObject(URL.createObjectURL(data));
        setIsLoaderActive(true);
        setIsUploadContainerVisible(false);
        setTimeout(()=>{
          setIsLoaderActive(false);
        },500)
      }
  }
  // End of the above code
  // Below code is used when slider value changed
  const changeSliderCurrentValues = (data) => {
    if( data[0] === minMaxSliderValue[0] && data[1] === minMaxSliderValue[1]){
      setIsCutVideoButtonVisible(false); 
    } else {
      setIsCutVideoButtonVisible(true);
    }
    setCurrentSliderValues(data);
  }
  // End of the above code
  // Below code is used for cut the video
  const cutVideo = async() => {
    setIsLoaderActive(true);
    const inputFileName = "input.mp4"
    const outputFileName = "output1.mp4"
    // writing the video file to memory
    ffmpeg.FS("writeFile", inputFileName, await fetchFile(displayVideoFileObject))
    const [min, max] = currentSliderValues;
    const minTime = convertToHHMMSS(valueToVideoTimeDuration(displayVideoState.duration, min))
    const maxTime = convertToHHMMSS(valueToVideoTimeDuration(displayVideoState.duration, max))
    // Filtering out the transcripts which are used in the selected segment of the video
    const tempTranscriptArr = mainTranscriptData.filter((element)=>{
      return element.time >minTime && element.time < maxTime;
    })
    // End of the above code
    await ffmpeg.run("-i", inputFileName, "-ss", `${(minTime)}`, "-to", `${(maxTime)}`, "-acodec",'copy', '-vcodec', 'copy', outputFileName);
    // reading the resulting file
    const data = ffmpeg.FS("readFile", outputFileName)
    const newVideo = URL.createObjectURL(new Blob([data.buffer], { type: "mp4" }));
    // Below is the code used when new trimmed video is ready
    setDisplayVideoFile(new Blob([data.buffer], { type: "mp4" }));
    setDisplayTranscriptData(tempTranscriptArr);
    setDisplayVideoFileObject(newVideo);
    setIsVideoTrimed(true);
    setIsLoaderActive(false);
    setIsTranscriptedDeleted(true);
    toast.success('Video is Saved from '+ minTime + " to " + maxTime);
    // End of the above code
  }
  // End of the above code
  // Below code is used for delete Transcript Section From Video
  const deleteTranscriptFromVideo = async(startingPoint, endingPoint, index) => {
    setIsLoaderActive(true);
    let tempInitialTranscriptArr = [...mainTranscriptData];
    tempInitialTranscriptArr.splice(index, 1);
    const [min, max] = currentSliderValues;
    const startPoint = convertTimeIntoSeconds(startingPoint);
    // const startPoint = 3; // For Demo Purpose
    const endPoint = endingPoint === "##:##" ? convertTimeIntoSeconds(convertToHHMMSS(valueToVideoTimeDuration(displayVideoState.duration, max))) : convertTimeIntoSeconds(endingPoint);
    // const endPoint = 282; // For Demo Purpose
    const inputFileName = "input.mp4";
    const resultFile = "output3.mp4";
    const differenceTime = endPoint - startPoint;
    toast.warn("This process may take some time as it involves the removal of a "+ differenceTime + "-second segment from the entire video.");
    ffmpeg.FS("writeFile", inputFileName, await fetchFile(displayVideoFileObject))
    await ffmpeg.run('-i', inputFileName,
      '-vf', "select='not(between(t,"+startPoint+","+endPoint+"))',setpts=N/FRAME_RATE/TB",
      '-af', "aselect='not(between(t,"+startPoint+","+endPoint+"))',asetpts=N/SR/TB",
      resultFile)
    const finalData = ffmpeg.FS("readFile", resultFile);
    const newVideo = URL.createObjectURL(new Blob([finalData.buffer], { type: "mp4" }));
    setDisplayVideoFile(new Blob([finalData.buffer], { type: "mp4" }));
    setDisplayVideoFileObject(newVideo);
    setDisplayTranscriptData(tempInitialTranscriptArr);
    setIsTranscriptedDeleted(true);
    setIsLoaderActive(false);
    toast.success("Transcript removed successfully!");
  }
  // End of the above code
  // Below is the code used for reset all the things
  const resetAll = ()=> {
     setIsUploadContainerVisible(true);
     setMainTranscriptData(transcriptData);
     setDisplayTranscriptData(transcriptData);
     setIsLoaderActive(false);
     setIsVideoTrimed(false);
     setIsTranscriptedDeleted(false);
     setDisplayVideoFile(undefined);
     setDisplayVideoFileObject(undefined);
     setDisplayVideoState(undefined);
     setStartTime(0);
     setMinMaxSliderValue([0.00, totalVideoDuration]);
     setCurrentSliderValues([0.00, totalVideoDuration]);
     setIsCutVideoButtonVisible(false);
  }
  // End of the above code
  return (    
    <VidosoLayout>
        {
          isFfmpegLoaded !== true || isLoaderActive === true ? <div className="loader-container">
            <div className="spinner"></div>
          </div> : 
          <div className="container-fluid">
            {isUploadContainerVisible === true ? 
            // Below is the code for Uploading the video section
            <div className="upload-video-container">
              <div className="row m-0 text-center">
                  <p className="upload-vide-content">Download <a className="vidoso-link" href="https://www.youtube.com/watch?v=NFHDHcs4BvQ" target="_blank">this video</a>, or use the sample video (sample-video.mp4) in the assets &gt; videos folder with transcript for demo.</p>
                  <div className="upload-button-container">
                    <Upload
                      beforeUpload={() => {
                          return false
                      }}
                      accept="video/*"
                      onChange={(info) => {
                          if (info.fileList && info.fileList.length > 0) {
                            uploadVideo(info.fileList[0].originFileObj)
                          }
                      }}
                      showUploadList={false}
                      >
                      <button className="btn-primary-videoso"><img src={UploadIcon} className="vidoso-icon-button" alt="vidoso-icons" height={16} width={16} />Upload Video</button>
                    </Upload>
                  </div>
              </div>
            </div>
            // End of the above code
            : 
            // Below code is for the after uploading functionality
            <div className="row m-0">
                <div className="col-8">
                  {/* Below code is used for Video Player */}
                  <div className="row m-0">
                    <div className="col-12 p-0 video-container">
                        {!!displayVideoFileObject ? 
                        <VideoPlayer 
                          src={displayVideoFileObject} 
                          startTime={startTime}
                          onPlayerChange={(videoPlayer) => {
                            setDisplayVideoFile(videoPlayer)
                          }}
                          onChange={(videoPlayerState) => {
                            setDisplayVideoState(videoPlayerState)
                          }}>
                        </VideoPlayer> 
                        : <></>}
                    </div>
                  </div>
                  {/* End of the above code */}
                  {/* Below code is for the Slider Range Component */}
                  {isVideoTrimed !== true && isTranscriptedDeleted !== true ? <div className="row m-0">
                      <div className="col-12 p-0 slider-range-conatiner">
                          <SliderRange minMaxSliderValue={minMaxSliderValue} currentSliderValues={currentSliderValues} changeCurrentValues={(data)=> changeSliderCurrentValues(data)} displayVideoState={displayVideoState}> </SliderRange>
                        </div>
                    </div> : <></>}
                  {/* End of the above code */}
                  {/* Below code is used setting of the Video Editor */}
                  <div className="row setting-container">
                      <div className="col-12 p-0">
                          {isCutVideoButtonVisible === true && isVideoTrimed !== true ? <button type="button" className="btn-primary-videoso" onClick={()=> cutVideo()}><img alt="vidoso-icons" src={ScissorsIcon} className="vidoso-icon-button" height={16} width={16} />Save Video</button> : <></>}
                          {isVideoTrimed === true || isTranscriptedDeleted === true ? <button type="button" className="btn-primary-videoso" onClick={()=> resetAll()}><img alt="vidoso-icons" src={RestoreIcon} className="vidoso-icon-button" height={16} width={16} />Reset</button> : <></>}
                      </div>
                  </div>
                  {/* End of the above code */}
                  </div>
                  {/* Below is the code for the Transcripts Section */}
                  <div className="col-4">
                    <Transcripts data={displayTranscriptData} deleteTranscriptFromVideo={(start, end, index) => deleteTranscriptFromVideo(start, end, index)} isTranscriptedDeleted={isTranscriptedDeleted}></Transcripts>
                  </div>
                  {/* End of the above code */}
              </div>
            // End of the above code
            }
          </div>
        }
    </VidosoLayout>
  );
}

export default VideoEditor;
