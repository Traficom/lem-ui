import React, { useState } from 'react';

const SubScenario = ({
    subScenarioEdit,
    handleChange,
    handleSave,
    handleCancel,
    scenarioNames,
}) => {

    function checkName(newName){
      return !newName || newName == 0 || 
      scenarioNames.find((existingName) => existingName.name == newName && existingName.id != subScenarioEdit.id)
    }
    const [nameIsInValid, setNameIsInValid] = useState(checkName(subScenarioEdit.name)); // all scenario and subScenario names 
    const namePlaceHolder = subScenarioEdit.parentScenarioName + "_SUB";

    function handleNameChange(val){
        const newName = cutUnvantedCharacters(val);
        setNameIsInValid(checkName(newName));
        handleChange({ ...subScenarioEdit, name: newName });
    }

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
                        handleNameChange(e.target.value);
                    }}
                />
                {nameIsInValid ? <span className="Scenario__name-error">Tarkista aliskenaarion nimi. Nimi ei voi olla tyhjä tai sama kuin jo olemassa oleva skenaarionimi.</span> : ""}
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
                        disabled={nameIsInValid}
                        readOnly={nameIsInValid}
                        onClick={(e) => {!nameIsInValid && handleSave()}}
                    >
                        <span>Tallenna</span>
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