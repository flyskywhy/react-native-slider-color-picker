import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
} from 'react-native';
import Immutable from 'immutable';
import Slider from 'react-native-smooth-slider';
import {ImagePropTypes} from 'deprecated-react-native-prop-types';

export const minColorTemperature = 2000;
export const maxColorTemperature = 12000;

export class SliderCoolWarmPicker extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);

        const state = {
            oldColorTemperature: props.oldColorTemperature,

            colorTemperature: 2000,
        };
        if (props.oldColorTemperature) {
            state.colorTemperature = props.oldColorTemperature;
        }
        if (props.defaultColorTemperature) {
            state.colorTemperature = props.defaultColorTemperature;
        }
        this.state = state;
    }

    shouldComponentUpdate(nextProps, nextState = {}) {
        return !Immutable.is(Immutable.fromJS(this.props), Immutable.fromJS(nextProps))
        || !Immutable.is(Immutable.fromJS(this.state), Immutable.fromJS(nextState));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.oldColorTemperature !== prevState.oldColorTemperature) {
            return {
                oldColorTemperature: nextProps.oldColorTemperature,

                colorTemperature: nextProps.oldColorTemperature,
            };
        }

        return null;
    }

    static propTypes = {
        colorTemperature: PropTypes.number,
        defaultColorTemperature: PropTypes.number,
        oldColorTemperature: PropTypes.number,
        onColorTemperatureChange: PropTypes.func,
        minimumValue: PropTypes.number,
        maximumValue: PropTypes.number,
        step: PropTypes.number,
        moveVelocityThreshold: PropTypes.number,    // Prevent onValueChange if slide too faster
        trackImage: ImagePropTypes.source,

        /**
         * The useNativeDriver parameter in Animated used by react-native-gesture-handler when the user change the value.
         * Default value is false, because some Android phone [PanGestureHandler causes Animated Value to jump when using native driver](https://github.com/software-mansion/react-native-gesture-handler/issues/984)
         */
        useNativeDriver: PropTypes.bool,
    };

    static defaultProps = {
        minimumValue: minColorTemperature,
        maximumValue: maxColorTemperature,
        step: 100,
        moveVelocityThreshold: 2000,
        trackImage: require('./coolWarm.png'),
        useNativeDriver: false,
    };

    getColorTemperature() {
        return typeof this.props.colorTemperature === 'number' ?
            this.props.colorTemperature :
            this.state.colorTemperature;
    }

    setOldColorTemperature = oldColorTemperature => {
        this.setState({
            colorTemperature: oldColorTemperature,
        });
    }

    _onColorTemperatureChange(x, resType) {
        let colorTemperature = x;
        this.setState({
            colorTemperature,
        });

        if (this.props.onColorTemperatureChange) {
            this.props.onColorTemperatureChange(colorTemperature, resType);
        }
    }

    render() {
        const {
            colorTemperature,
        } = this.state;
        const {
            style,
            trackStyle,
            trackImage,
            thumbStyle,
            minimumValue,
            maximumValue,
            step,
            moveVelocityThreshold,
            useNativeDriver,
        } = this.props;

        let thumbColor = '#fff4e5';

        return (
            <View style={styles.container}>
                <Slider
                    style={style}
                    trackStyle={[{backgroundColor: 'transparent'}, trackStyle]}
                    trackImage={trackImage}
                    thumbStyle={[{backgroundColor: thumbColor}, thumbStyle]}
                    minimumValue={minimumValue}
                    maximumValue={maximumValue}
                    value={colorTemperature}
                    step={step}
                    moveVelocityThreshold={moveVelocityThreshold}
                    useNativeDriver={useNativeDriver}
                    onValueChange={value => this._onColorTemperatureChange(value)}
                    onSlidingComplete={value => this._onColorTemperatureChange(value, 'end')}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});
