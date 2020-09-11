import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    StyleSheet,
    View,
} from 'react-native';
import Immutable from 'immutable';
import tinycolor from 'tinycolor2';
import Slider from 'react-native-smooth-slider';

export class SliderSaturationPicker extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);

        const state = {
            oldColor: props.oldColor,

            color: {
                h: 0,
                s: 1,
                v: 1,
            },
        };
        if (props.oldColor) {
            state.color = tinycolor(props.oldColor).toHsv();
        }
        if (props.defaultColor) {
            state.color = tinycolor(props.defaultColor).toHsv();
        }
        this.state = state;
    }

    shouldComponentUpdate(nextProps, nextState = {}) {
        return !Immutable.is(Immutable.fromJS(this.props), Immutable.fromJS(nextProps))
        || !Immutable.is(Immutable.fromJS(this.state), Immutable.fromJS(nextState));
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.oldColor !== prevState.oldColor) {
            return {
                oldColor: nextProps.oldColor,

                color: tinycolor(nextProps.oldColor).toHsv(),
            };
        }

        return null;
    }

    static propTypes = {
        color: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                h: PropTypes.number,
                s: PropTypes.number,
                v: PropTypes.number
            }),
        ]),
        defaultColor: PropTypes.string,
        oldColor: PropTypes.string,
        onColorChange: PropTypes.func,
        minimumValue: PropTypes.number,
        maximumValue: PropTypes.number,
        step: PropTypes.number,
        moveVelocityThreshold: PropTypes.number,    // Prevent onValueChange if slide too faster
        trackImage: Image.propTypes.source,

        /**
         * The useNativeDriver parameter in Animated used by react-native-gesture-handler when the user change the value.
         * Default value is false, because some Android phone [PanGestureHandler causes Animated Value to jump when using native driver](https://github.com/software-mansion/react-native-gesture-handler/issues/984)
         */
        useNativeDriver: PropTypes.bool,
    };

    static defaultProps = {
        minimumValue: 0.01, // 0 will cause h to 0 too, so 0.01 by default
        maximumValue: 1,
        step: 0.01,
        moveVelocityThreshold: 2000,
        trackImage: require('./saturation_mask.png'),
        useNativeDriver: false,
    };

    getColor() {
        const passedColor = typeof this.props.color === 'string' ?
            this.props.color :
            tinycolor(this.props.color).toHexString();
        return passedColor || tinycolor(this.state.color).toHexString();
    }

    setOldColor = oldColor => {
        this.setState({
            color: tinycolor(oldColor).toHsv(),
        });
    }

    _onColorChange(x, resType) {
        let color = {
            ...this.state.color,
            s: x,
        };
        this.setState({
            color,
        });

        if (this.props.onColorChange) {
            this.props.onColorChange(color, resType);
        }
    }

    render() {
        const {
            color,
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

        let thumbColor = tinycolor({
            ...color,
            v: 1,
        }).toHexString();

        return (
            <View style={styles.container}>
                <Slider
                    style={style || styles.style}
                    trackStyle={[{backgroundColor: 'transparent'}, trackStyle]}
                    trackImage={trackImage}
                    thumbStyle={[{backgroundColor: thumbColor}, thumbStyle]}
                    minimumValue={minimumValue}
                    maximumValue={maximumValue}
                    value={color.s}
                    step={step}
                    moveVelocityThreshold={moveVelocityThreshold}
                    useNativeDriver={useNativeDriver}
                    onValueChange={value => this._onColorChange(value)}
                    onSlidingComplete={value => this._onColorChange(value, 'end')}/>
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
    style: {
        height: 12,
        borderRadius: 6,
        backgroundColor: 'red',
    },
});
