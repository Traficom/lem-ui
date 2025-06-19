import React, { useState } from 'react';

const CreateEmmeBank = ({
    createProject,
    handleCancel,
}) => {
    const [submodel, setSubmodel] = useState('');
    const [numberOfEmmeScenarios, setNumberOfEmmeScenarios] = useState(1);
    const [separateEmmeScenarios, setSeparateEmmeScenarios] = useState(false);
    return (
        <div className="CreateEmmeBank">

            <div className="CreateEmmeBank_overlay" onClick={(e) => handleCancel()}>{/* Dark background overlay */}</div>

            <div className="CreateEmmeBank_dialog">

                <div className="CreateEmmeBank_dialog-controls" onClick={(e) => handleCancel()}></div>

                <div className="CreateEmmeBank_dialog-heading">Luo Emme-pankki</div>

                {/* Sub model selection */}
                <label className="CreateEmmeBank_label"
                    htmlFor="submodel">Osamalli</label>
                <div className="Submodel_select">
                    <select id="submodel" value={submodel} onChange={e => setSubmodel(e.target.value)}>
                        <option key={"submodel_select"} value={""}>--- valitse ---</option>
                        {projectSubmodels && projectSubmodels.map((submodel) =>
                            <option key={submodel.id} value={submodel.id}>{submodel.name}</option>)
                        }
                    </select>
                </div>
                {/* Amount of scenerios */}
                <label className="CreateEmmeBank_label"
                    htmlFor="submodel">Skenaarioiden lukumäärä</label>
                <input id="project_name"
                    className="CreateEmmeBank_input"
                    type="number"
                    min={1}
                    value={numberOfEmmeScenarios || 1}
                    onChange={(e) => {
                        setNumberOfEmmeScenarios(e.target.value)
                    }}
                />

                {/* Save to separate emme scenarios */}
                <div className='CreateEmmeBank_checkbox_container'>
                    <input id="separate-emme-scenarios"
                        className='CreateEmmeBank_checkbox'
                        type="checkbox"
                        checked={separateEmmeScenarios}
                        onChange={(e) => {
                            setSeparateEmmeScenarios(!separateEmmeScenarios);
                        }}
                    />
                    <label className="CreateEmmeBank_checkbox_label"
                        htmlFor="separate-emme-scenarios">Tallenna ajanjaksot erillisiin Emme-skenaarioihin</label>
                </div>

                <div className="CreateEmmeBank_buttons">
                    <button
                        className="CreateEmmeBank_btn"
                        onClick={e => createProject(submodel, numberOfEmmeScenarios, separateEmmeScenarios)}
                    >
                        <span>Luo pankki</span>
                    </button>
                    <button
                        className="CreateEmmeBank_btn"
                        onClick={(e) => handleCancel()}
                    >
                        <span>Peruuta</span>
                    </button>
                </div>
                
            </div>
        </div>
    )

}
