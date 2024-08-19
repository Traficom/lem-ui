import React, { useState } from 'react';

const SubScenario = ({
    subScenarioEdit,
    handleChange,
    handleSave,
    handleCancel,
}) => {
    const namePlaceHolder = subScenarioEdit.parentScenarioName + "_SUB";

    return (
        <div className="SubScenario">

            <div className="SubScenario_overlay" onClick={(e) => handleCancel()}>{/* Dark background overlay */}</div>

            <div className="SubScenario_dialog">

                <div className="SubScenario_dialog-controls" onClick={(e) => handleCancel()}></div>

                <div className="SubScenario_dialog-heading">Aliskenaarion asetukset</div>

                {/* Sub model name */}
                <label className="SubScenario_label"
                    htmlFor="sub_cenario__name">Aliskenaarion nimi</label>
                <input id="sub_scenario-name"
                    className="sub_cenario__name"
                    type="text"
                    placeholder={namePlaceHolder}
                    value={subScenarioEdit.name}
                    onChange={(e) => {
                        const newName = cutUnvantedCharacters(e.target.value);
                        handleChange({ ...subScenarioEdit, name: newName });
                    }}
                />
                
                {/* Emme scenario number */}
                <label className="SubScenario_label"
                    htmlFor="submodel">EMME-skenaarion numero</label>
                <input id="project_name"
                    className="SubScenario_input"
                    type="number"
                    min="1"
                    value={subScenarioEdit.emmeScenarioNumber || 1}
                    onChange={(e) => {
                        handleChange({ ...subScenarioEdit, emmeScenarioNumber: e.target.value });
                    }}
                />
                <label className="SubScenario_label"
                    htmlFor="submodel">Aliskenaarion kysyntämatriisit otetaan skenaariosta <b>{subScenarioEdit.parentScenarioName}</b></label>


                <div className="SubScenario_buttons">
                    <button
                        className="SubScenario_btn"
                        onClick={(e) => handleSave()}
                    >
                        <span>Luo aliskenaario</span>
                    </button>
                    <button
                        className="SubScenario_btn"
                        onClick={(e) => handleCancel()}
                    >
                        <span>Peruuta</span>
                    </button>
                </div>
                
            </div>
        </div>
    )

}