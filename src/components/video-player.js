import { useState, useEffect } from "react";
import { BigPlayButton, ControlBar, LoadingSpinner, Player, PlayToggle } from "video-react";
import "video-react/dist/video-react.css";
function VideoPlayer(props) {
    const [player, setPlayer] = useState(undefined);
    const [playerState, setPlayerState] = useState(undefined);
    const [startTime, setStartTime] = useState(props.startTime);
    // Below method is used for Syncing the Video Player
    useEffect(() => {
        if (playerState) {
            props.onChange(playerState)
        }
    }, [playerState])
    useEffect(() => {
        props.onPlayerChange(player)
        if (player) {
            player.subscribeToStateChange(setPlayerState)
        }
    }, [player])
    // End of the above code
    return (
        <Player
            ref={(player) => {
                if(!!player){
                    setPlayer(player)
                }
            }}
            startTime={startTime}
        >
            <source src={props.src} />
            <BigPlayButton position="center" />
            <LoadingSpinner />
            <ControlBar autoHide={false} disableDefaultControls={true}>
                <PlayToggle />
            </ControlBar>
        </Player>
    );
}

export default VideoPlayer;
