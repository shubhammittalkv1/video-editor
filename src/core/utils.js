export function valueToVideoTimeDuration(duration, sliderValue) {
    return Math.round(duration * sliderValue / 100)
}
export function convertToHHMMSS(val){
    const secNum = parseInt(val, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    let time;
    // only mm:ss
    if (hours === '00') {
      time = minutes + ':' + seconds;
    } else {
      time = hours + ':' + minutes + ':' + seconds;
    }
    return time;
};
export function convertDurationIntoTime(duration, data) {
    if(duration !== undefined && duration !== null){
    let num = data*(duration/100);
    let minutes = (num / 60);
    let rminutes = Math.floor(minutes);
    let seconds = (minutes - rminutes) * 60;
    let rseconds = Math.round(seconds);
    if(rseconds <= 9){
        rseconds = "0"+rseconds;
    }
    return rminutes+"."+rseconds;
    }
}
export function convertTimeIntoSeconds(data) {
    const [minutes, seconds] = data.split(':');
    const totalSeconds = (+minutes) * 60 + (+seconds);
    return totalSeconds;
}