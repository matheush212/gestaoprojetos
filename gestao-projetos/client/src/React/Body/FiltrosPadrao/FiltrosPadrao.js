import React from 'react';
import './FiltrosPadrao.css';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import PrintIcon from '../../../React/Images/PrintIcon.png';
import PrinterImage from '../../../Functions/PrinterImage';
import Log from '../../../Functions/GeraLog';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker, } from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({ button: { display: 'block', marginTop: theme.spacing(2), }, formControl: { margin: theme.spacing(1), minWidth: 150, }, }));
const ENTER = 13;
var filtroSelecionado = "";
var enmFiltroSelecionado = { Todos: "Todos", Data: "Data", Geral: "Geral" };


const FiltrosPadrao = props => {
    let displayFiltroDataValue;
    let displayFiltroGeral;

    const classes = useStyles();
    const [SelectedDateDe, SetSelectedDateDe] = React.useState(Date.now());
    const [SelectedDateAte, SetSelectedDateAte] = React.useState(Date.now());
    const [SelectedHourDe, SetSelectedHourDe] = React.useState(Date.now());
    const [SelectedHourAte, SetSelectedHourAte] = React.useState(Date.now());
    const HandleDateDeChange = (date) => { SetSelectedDateDe(date); };
    const HandleDateAteChange = (date) => { SetSelectedDateAte(date); };
    const HandleHourDeChange = (date) => { SetSelectedHourDe(date); };
    const HandleHourAteChange = (date) => { SetSelectedHourAte(date); };
    const EnterKeyPressEvent = (event) => { if (event.keyCode === ENTER) { FilterFieldChange(); } };
    const OnClickFiltrarBtnEvent = () => {
        if (document.getElementById("select-style-padrao").textContent.length !== 1)
            FilterFieldChange();
    };


    const SelectChange = (value) => {
        try {
            filtroSelecionado = value.target.value;
            if (filtroSelecionado === enmFiltroSelecionado.Todos) {
                displayFiltroGeral = "none";
                displayFiltroDataValue = "none";
                document.getElementById("filtros-data-hora-padrao").style.setProperty('display', `${displayFiltroDataValue}`, 'important');
                document.getElementById("GeralFilterPadrao").style.setProperty('display', `${displayFiltroGeral}`, 'important');
                props.SelectAll();
            }
            else if (filtroSelecionado.substr(0, 4) === enmFiltroSelecionado.Data) {
                displayFiltroGeral = "none";
                displayFiltroDataValue = "initial";
                document.getElementById("HoraDePadrao").disabled = true;
                document.getElementById("HoraAtePadrao").disabled = true;
            }
            else if (filtroSelecionado === "")
                return
            else {
                displayFiltroGeral = "initial";
                displayFiltroDataValue = "none";
            }


            document.getElementById("filtros-data-hora-padrao").style.setProperty('display', `${displayFiltroDataValue}`, 'important');
            document.getElementById("GeralFilterPadrao").style.setProperty('display', `${displayFiltroGeral}`, 'important');
        }
        catch (err) {
            Log.LogError("FiltrosPadrao", "SelectChange", err.message);
        }
    };


    const FilterFieldChange = () => {
        try {
            if (filtroSelecionado === enmFiltroSelecionado.Todos)
                props.FilterChange("Todos", "null", "null", "null");
            else if (filtroSelecionado.substr(0, 4) === enmFiltroSelecionado.Data) {
                let splDataDe = document.getElementById("DataDePadrao").value.split("/");
                let splDataAte = document.getElementById("DataAtePadrao").value.split("/");
                let dataDeFormatada = splDataDe[2] + "-" + splDataDe[1] + "-" + splDataDe[0];
                let dataAteFormatada = splDataAte[2] + "-" + splDataAte[1] + "-" + splDataAte[0];
                props.FilterChange(filtroSelecionado, dataDeFormatada, dataAteFormatada, "null");
            }
            else {
                if (document.getElementById("GeralFilterPadrao").value === "")
                    props.FilterChange(filtroSelecionado, "null", "null", "null");
                else
                    props.FilterChange(filtroSelecionado, "null", "null", document.getElementById("GeralFilterPadrao").value);
            }
        }
        catch (err) {
            Log.LogError("FiltrosPadrao", "FilterFieldChange", err.message);
        }
    }


    return (
        <form className="div-filtros-style-padrao" noValidate autoComplete="off">
            <Button className="button-filtrar-padrao" onClick={OnClickFiltrarBtnEvent}>Filtrar</Button>
            <div className="printer-button-style-padrao"><img src={PrintIcon} width="37" alt="Printer" onClick={PrinterImage.Print}></img></div>

            <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">Selecione o filtro</InputLabel>
                <Select id="select-style-padrao" onChange={SelectChange}>
                    {props.filtros.map((filtro, index) => (<MenuItem key={index} value={filtro.value}>{filtro.label}</MenuItem>))}
                </Select>
            </FormControl>
            <TextField type="text" id="GeralFilterPadrao" onKeyUp={EnterKeyPressEvent} className="fitlro-field-padrao" placeholder="Filtro" />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div id="filtros-data-hora-padrao">
                    <KeyboardDatePicker id="DataDePadrao" className="date-de-field-size-padrao" format="dd/MM/yyyy" value={SelectedDateDe} onChange={HandleDateDeChange} />
                    <KeyboardTimePicker id="HoraDePadrao" className="hour-field-size-padrao" value={SelectedHourDe} format="HH:mm" onChange={HandleHourDeChange} />
                    <KeyboardDatePicker id="DataAtePadrao" className="date-ate-field-size-padrao" format="dd/MM/yyyy" value={SelectedDateAte} onChange={HandleDateAteChange} />
                    <KeyboardTimePicker id="HoraAtePadrao" className="hour-field-size-padrao" value={SelectedHourAte} format="HH:mm" onChange={HandleHourAteChange} />
                </div>
            </MuiPickersUtilsProvider>
        </form>
    )
}
export default FiltrosPadrao; 