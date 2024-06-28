import React, { useState } from 'react';

const CreateEmmeProject = ({
    createProject,
    handleCancel,
}) => {
    const [submodel, setSubmodel] = useState('');
    const [numberOfEmmeScenarios, setNumberOfEmmeScenarios] = useState('0');
    const [separateEmmeScenarios, setSeparateEmmeScenarios] = useState(false);
    return (
        <div className="CreateEmmeProject">

            <div className="CreateEmmeProject_overlay" onClick={(e) => handleCancel()}>{/* Dark background overlay */}</div>

            <div className="CreateEmmeProject_dialog">

                <div className="CreateEmmeProject_dialog-controls" onClick={(e) => handleCancel()}></div>

                <div className="CreateEmmeProject_dialog-heading">Luo Emme-projekti</div>

                {/* Sub model selection */}
                <label className="CreateEmmeProject_label"
                    htmlFor="submodel">Osamalli</label>
                <div className="Submodel_select">
                    <select id="submodel" value={submodel} onChange={e => setSubmodel(e.target.value)}>
                        <option key={"submodel_select"} value={""}>--- valitse ---</option>
                        {submodels && submodels.map((submodel) =>
                            <option key={submodel.id} value={submodel.id}>{submodel.name}</option>)
                        }
                    </select>
                </div>
                {/* Amount of scenerios */}
                <label className="CreateEmmeProject_label"
                    htmlFor="submodel">Skenaarioiden lukumäärä</label>
                <input id="project_name"
                    className="CreateEmmeProject_input"
                    type="number"
                    min="0"
                    value={numberOfEmmeScenarios || ""}
                    onChange={(e) => {
                        setNumberOfEmmeScenarios(e.target.value)
                    }}
                />

                {/* Save to separate emme scenarios */}
                <div className='CreateEmmeProject_checkbox_container'>
                    <input id="separate-emme-scenarios"
                        className='CreateEmmeProject_checkbox'
                        type="checkbox"
                        checked={separateEmmeScenarios}
                        onChange={(e) => {
                            setSeparateEmmeScenarios(!separateEmmeScenarios);
                        }}
                    />
                    <label className="CreateEmmeProject_checkbox_label"
                        htmlFor="separate-emme-scenarios">Tallenna ajanjaksot erillisiin Emme-skenaarioihin</label>
                </div>

                <div className="CreateEmmeProject_buttons">
                    <button
                        className="CreateEmmeProject_btn"
                        onClick={e => createProject(submodel, numberOfEmmeScenarios, separateEmmeScenarios)}
                    >
                        <span>Luo projekti</span>
                    </button>
                    <button
                        className="CreateEmmeProject_btn"
                        onClick={(e) => handleCancel()}
                    >
                        <span>Peruuta</span>
                    </button>
                </div>
                
            </div>
        </div>
    )

}