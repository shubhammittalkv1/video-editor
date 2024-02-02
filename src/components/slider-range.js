import { useState } from "react";
import { Range, getTrackBackground } from 'react-range';
const currentRangeStepGap = 0.01;
function SliderRange(props) {
    const [currentValues, setCurrentValues] = useState(props.currentSliderValues);
    const [minValue, setMinValue] = useState(props.minMaxSliderValue[0]);
    const [maxValue, setMaxValue] = useState(props.minMaxSliderValue[1]);
    // Below code is used when slider value got changed
    const changeValues = (data) => {
        setCurrentValues(data.values);
        props.changeCurrentValues(data.values);
    }
    // End of the above code
    // Below Method is used for formatting the values in the Label of Slider
    const displayBulletValue = (data) => {
        let num = data*(props?.displayVideoState?.duration/100);
        let minutes = (num / 60);
        let rminutes = Math.floor(minutes);
        let seconds = (minutes - rminutes) * 60;
        let rseconds = Math.round(seconds);
        if(rseconds < 9){
            rseconds = "0"+rseconds;
        }
        return rminutes+"."+rseconds;
    }
    // End of the above code
    return (
        <>
          <Range
            step={currentRangeStepGap}
            min={minValue}
            max={maxValue}
            values={currentValues}
            onChange={(values) => changeValues({ values })}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                    ...props.style,
                    height: '8px',
                    width: '100%',
                    background: getTrackBackground({
                        values: currentValues,
                        colors: ['#e3cffc', '#6c0ce2', '#e3cffc'],
                        min: minValue,
                        max: maxValue,
                        rtl: false
                    }),
                  alignSelf: 'center'
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ index, props, isDragged }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '24px',
                  width: '24px',
                  borderRadius: "50%",
                  backgroundColor: '#6c0ce2'
                }}
              >
              <div
              style={{
                position: 'absolute',
                top: '-30px',
                left: "-6px",
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                padding: '4px',
                borderRadius: '4px',
                backgroundColor: '#6c0ce2'
              }}
            >
              {displayBulletValue(currentValues[index])}
            </div>
            <div
              style={{
                position:"absolute",
                top: "-3px",
                left: "9px",
                height: '10px',
                width: '5px',
                backgroundColor: isDragged ? '#6c0ce2' : '#6c0ce2'
              }}
            />
          </div>
        )}
      />
    </>
  );
}

export default SliderRange;
