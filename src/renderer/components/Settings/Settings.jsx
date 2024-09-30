import React, { useState, useEffect, useRef } from 'react';
import path from "path";
import { searchEMMEPython } from './search_emme_pythonpath';
import versions from '../versions';

const Settings = ({
  settings,
  settingsList,
  setEMMEProjectPath,
  setEMMEPythonPath,
  setHelmetScriptsPath,
  dlHelmetScriptsVersion,
  isDownloadingHelmetScripts,
  setProjectPath,
  setBasedataPath,
  setResultsPath,
  setProjectName,
  cancel,
  promptModelSystemDownload,
  saveSetting,
  selectBaseSettings,
}) => {
  const [selectedBaseSettings, setSelectedBaseSettings] = useState('');

  const handleSelectBaseSettings = (settingsId) => {
    setSelectedBaseSettings(settingsId);
    if (settingsId !== "") {
      selectBaseSettings(settingsId);
    }
  }

  const handleCancel = () => {
    setSelectedBaseSettings("")
    cancel();
  }

  const handleSave = () => {
    setSelectedBaseSettings("")
    saveSetting();
  }

  return (
    <div className="Settings">

      <div className="Settings__overlay" onClick={(e) => handleCancel()}>{/* Dark background overlay */}</div>

      <div className="Settings__dialog">

        <div className="Settings__dialog-controls" onClick={(e) => handleCancel()}></div>

        <div className="Settings__dialog-heading">Projektin asetukset</div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label semi_bold">Projektin nimi</span>
          <div className="Settings_select">
            <input id="project_name"
              className="Settings__name_input"
              value={settings.project_name}
              type='text'
              disabled={false}
              autoFocus={true}
              onChange={(e) => {
                setProjectName(e.target.value);
              }}
            /></div>
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label semi_bold">Valitse toinen projekti pohjaksi</span>
          <div className="Settings_select">
            <select value={selectedBaseSettings} onChange={e => handleSelectBaseSettings(e.target.value)}>
              <option key={"setting_select"} value={""}>--- valitse ---</option>
              {settingsList && settingsList.map((setting) =>
                <option key={setting.id} value={setting.id}>{setting.project_name}</option>)
              }
            </select>
          </div>
        </div>
        {/* File path to EMME project reference-file (generally same in all scenarios of a given VLEM project) */}
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label semi_bold">Emme-projekti</span>
          <label className="Settings__pseudo-file-select bg_plus" htmlFor="hidden-input-emme-project-path" title={settings.emme_project_path}>
            {settings.emme_project_path ? path.basename(settings.emme_project_path) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
            id="hidden-input-emme-project-path"
            type="text"
            onClick={() => {
              dialog.showOpenDialog({
                defaultPath: settings.emme_project_path ? settings.emme_project_path : settings.project_path,
                properties: ['openDirectory']
              }).then((e) => {
                if (!e.canceled) {
                  setEMMEProjectPath(e.filePaths[0]);
                }
              })
            }}
          />
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label semi_bold">Emme Python v3.7</span>
          <label className="Settings__pseudo-file-select" htmlFor="hidden-input-emme-python-path" title={settings.emme_python_path}>
            {settings.emme_python_path ? path.basename(settings.emme_python_path) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
            id="hidden-input-emme-python-path"
            type="text"
            onClick={() => {
              dialog.showOpenDialog({
                defaultPath: settings.emme_python_path ? settings.emme_python_path : path.resolve('/'),
                filters: [
                  { name: 'Executable', extensions: ['exe'] },
                  { name: 'All Files', extensions: ['*'] }
                ],
                properties: ['openFile']
              }).then((e) => {
                if (!e.canceled) {
                  setEMMEPythonPath(e.filePaths[0]);
                }
              })
            }}
          />
          <button className="Settings__input-btn"
            onClick={(e) => {
              const [found, pythonPath] = searchEMMEPython();
              if (found) {
                if (confirm(`Python ${versions.emme_python} löytyi sijainnista:\n\n${pythonPath}\n\nHaluatko käyttää tätä sijaintia?`)) {
                  setEMMEPythonPath(pythonPath);
                }
              } else {
                alert(`Emme ${versions.emme_system} ja Python ${versions.emme_python} eivät löytyneet oletetusta sijainnista.\n\nSyötä Pythonin polku manuaalisesti.`);
              }
            }}
          >
            Hae Python automaattisesti
          </button>
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label semi_bold">vlem model system</span>
          {isDownloadingHelmetScripts ?
            <span className="Settings__pseudo-file-select bg_plus">
              Downloading model-system {dlHelmetScriptsVersion === 'master' ? 'latest' : dlHelmetScriptsVersion}. . .
            </span>
            :
            <label className="Settings__pseudo-file-select bg_plus" htmlFor="hidden-input-helmet-scripts-path" title={settings.helmet_scripts_path}>
              {settings.helmet_scripts_path ? path.basename(settings.helmet_scripts_path) : "Valitse.."}
            </label>
          }
          <input className="Settings__hidden-input"
            id="hidden-input-helmet-scripts-path"
            type="text"
            onClick={() => {
              dialog.showOpenDialog({
                defaultPath: settings.helmet_scripts_path ? settings.helmet_scripts_path : settings.project_path,
                properties: ['openDirectory']
              }).then((e) => {
                if (!e.canceled) {
                  setHelmetScriptsPath(e.filePaths[0]);
                }
              })
            }}
          />
          <button className="Settings__input-btn"
            onClick={(e) => { promptModelSystemDownload() }}
          >
            Lataa eri versio internetist&auml;
          </button>
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label semi_bold">Projektin kantapolku (oletuksena kotihakemisto)</span>
          <label className="Settings__pseudo-file-select bg_plus" htmlFor="hidden-input-project-path" title={settings.projectPath}>
            {settings.project_path ? path.basename(settings.project_path) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
            id="hidden-input-project-path"
            type="text"
            onClick={() => {
              dialog.showOpenDialog({
                defaultPath: settings.project_path ? settings.project_path : homedir,
                properties: ['openDirectory']
              }).then((e) => {
                if (!e.canceled) {
                  setProjectPath(e.filePaths[0]);
                }
              })
            }}
          />
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label semi_bold">L&auml;ht&ouml;datan sis&auml;lt&auml;v&auml; kansio</span>
          <label className="Settings__pseudo-file-select bg_plus" htmlFor="hidden-input-basedata-path" title={settings.basedata_path}>
            {settings.basedata_path ? path.basename(settings.basedata_path) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
            id="hidden-input-basedata-path"
            type="text"
            onClick={() => {
              dialog.showOpenDialog({
                defaultPath: settings.basedata_path ? settings.basedata_path : settings.project_path,
                properties: ['openDirectory']
              }).then((e) => {
                if (!e.canceled) {
                  setBasedataPath(e.filePaths[0]);
                }
              })
            }}
          />
        </div>
        <div className="Settings__dialog-input-group">
          <span className="Settings__pseudo-label semi_bold">Tulosten tallennuspolku</span>
          <label className="Settings__pseudo-file-select bg_plus" htmlFor="hidden-input-results-path" title={settings.resultdata_path}>
            {settings.resultdata_path ? path.basename(settings.resultdata_path) : "Valitse.."}
          </label>
          <input className="Settings__hidden-input"
            id="hidden-input-results-path"
            type="text"
            onClick={() => {
              dialog.showOpenDialog({
                defaultPath: settings.resultdata_path ? settings.resultdata_path : settings.project_path,
                properties: ['openDirectory']
              }).then((e) => {
                if (!e.canceled) {
                  setResultsPath(e.filePaths[0]);
                }
              })
            }}
          />
        </div>
        <div className="Settings__scenarios-footer">
          <button
            className="Settings_btn"
            disabled={!settings.project_name || settings.project_name == ""}
            onClick={e => handleSave()}
          >
            <span>Tallenna</span>
          </button>
          <button
            className="Settings_btn"
            onClick={(e) => handleCancel()}
          >
            <span>Peruuta</span>
          </button>
        </div>
      </div>

    </div>
  )
};
