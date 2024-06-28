import React from 'react';

const Loading = ({
    heading,
    info,
    close
}) => {
    return (
        <div className="Loading">
            <div className="Loading__overlay" onClick={(e) => close()}>{/* Dark background overlay */}</div>
            <div className="Loading__dialog">
                <div className="Loading__dialog-controls" onClick={(e) => close()}></div>
                <div className="Loading__dialog-heading">{heading}</div>
                <div className="Loading__dialog-info">{info}</div>
            </div>
        </div>
    )
}