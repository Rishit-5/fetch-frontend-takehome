import {useToggleState} from 'react-stately';
import {useToggleButton} from 'react-aria';
import {useRef} from 'react';

export function ToggleButton(props) {
    let ref = useRef();
    let state = useToggleState(props);
    let {buttonProps, isPressed} = useToggleButton(props, state, ref);
    // from react-aria documentation
    return (
        <button
            {...buttonProps}
            style={{
                background: isPressed
                    ? state.isSelected ? '#f8a619' : 'gray'
                    : state.isSelected
                        ? '#f8a619'
                        : 'lightgray',
                color: state.isSelected ? 'white' : 'black',
                padding: 10,
                fontSize: 16,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                border: 'none',
                margin: '.25em',
                borderRadius: '20px',
                cursor: 'pointer'
            }}
            ref={ref}
        >
            {props.children}
        </button>
    );
}
