import React from 'react';

const LemError = ({
    info,
    close
}) => {
    return (
        <div className="LemError">
            <div className="LemError__dialog">
                <div className="LemError__dialog-controls" onClick={(e) => close()}></div>
                <div className="LemError__dialog-heading">Virhe</div>
                <div className="LemError__dialog-info">{info}</div>
                <div className='LemError_ok_btn_div'>
                    <button
                        className="LemError_ok_btn"
                        onClick={(e) => close()}
                    >
                        <span>OK</span>
                    </button>
                </div>
            </div>
        </div>
    )
}