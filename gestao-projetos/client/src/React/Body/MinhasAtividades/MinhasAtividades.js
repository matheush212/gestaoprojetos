import React from 'react';
import './MinhasAtividades.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ApiService from '../../Utils/ApiService';
import Button from '@material-ui/core/Button';
import PopUp from '../../Utils/PopUp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import HourglassFullTwoToneIcon from '@material-ui/icons/HourglassFullTwoTone';
import AssessmentTwoToneIcon from '@material-ui/icons/AssessmentTwoTone';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import AccountTreeTwoToneIcon from '@material-ui/icons/AccountTreeTwoTone';
import PrintIcon from '../../../React/Images/PrintIcon.png';
import PrinterImage from '../../../Functions/PrinterImage';
import UrlParm from '../../../Functions/GetUrlParameters';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Log from '../../../Functions/GeraLog';
import $ from "jquery";
let columns = [];
let message = "";
let idAtividade = "";
let tokenRef = UrlParm.queryString("Ref");
let idProjeto = UrlParm.queryString("IdProjeto");
const ATIVOS = 1;
const STATUS_200 = 200;
const STATUS_400 = 400;


class MinhasAtividades extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            datasource: [],
            openActivityDialog: false,
            anchorEl: null
        }

        PopUp.ExibeMensagem('info', "Filtre e selecione uma linha com o registro desejado!");

        columns = [
            { id: "NomeAtividade", label: 'Nome', minWidth: 80, align: 'center' },
            { id: "DataInicio", label: 'Dt. Inicial', minWidth: 80, align: 'center' },
            { id: "DataFinal", label: 'Dt. Final', minWidth: 80, align: 'center' },
            { id: "Porcentagem", label: '% Completo', minWidth: 50, align: 'center' },
            { id: "Atrasado", label: 'Atrasado?', minWidth: 60, align: 'center' },
            { id: "Finalizado", label: 'Finalizado?', minWidth: 60, align: 'center' },
            { id: "DataCadastro", label: 'Dt. Cadastro?', minWidth: 80, align: 'center' },
            { id: "Ativo", label: 'Ativo?', minWidth: 60, align: 'center' },
        ]
    }


    componentDidMount() {
        try {
            document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');

            let _this = this;
            $("#tbMinhasAtividades").on("click", "tbody tr", function (event) {
                $(this).addClass('selected-padrao').siblings().removeClass('selected-padrao');
                message = `Você deseja visualizar a atividade '${$(this).find('td:eq(0)').html()}'?`;
                _this.setState({ openActivityDialog: true });
            });

            this.GetAllActivities();
        }
        catch (err) {
            Log.LogError("MinhasAtividades", "componentDidMount", err.message);
        }
    }


    GetAllActivities = () => {
        ApiService.AllActivities(idProjeto, ATIVOS, tokenRef)
            .then(res => {
                this.setState({ openActivityDialog: false });
                this.setState({ datasource: [] });
                if (res.status === STATUS_200)
                    this.setState({ datasource: [...this.state.datasource, ...res.data] });
                else if (res.status === STATUS_400) {
                    PopUp.ExibeMensagem('info', res.message);
                    this.setState({ datasource: [] });
                }
                else {
                    PopUp.ExibeMensagem('error', "Não foi possível carregar as atividades");
                    Log.LogError("MinhasAtividades", "GetAllActivities", res.message);
                    this.setState({ datasource: [] });
                }
            })
            .catch(err => {
                PopUp.ExibeMensagem('error', 'Falha na comunicação com a API ao listar as atividades');
                Log.LogError("MinhasAtividades", "GetAllActivities", err.message);
            });
    }


    GetActivitiesByDate = (dataDe, dataAte) => {
        ApiService.ActivitiesByDate(idProjeto, ATIVOS, dataDe, dataAte, tokenRef)
            .then(res => {
                this.setState({ openActivityDialog: false });
                this.setState({ datasource: [] });
                if (res.status === STATUS_200) {
                    PopUp.ExibeMensagem('success', res.message);
                    this.setState({ datasource: [...this.state.datasource, ...res.data] });
                }
                else if (res.status === STATUS_400) {
                    PopUp.ExibeMensagem('info', res.message);
                    this.setState({ datasource: [] });
                }
                else {
                    PopUp.ExibeMensagem('error', "Não foi possível carregar as atividades");
                    Log.LogError("MinhasAtividades", "GetActivitiesByDate", res.message);
                    this.setState({ datasource: [] });
                }
            })
            .catch(err => {
                PopUp.ExibeMensagem('error', 'Falha na comunicação com a API ao listar as atividades');
                Log.LogError("MinhasAtividades", "GetActivitiesByDate", err.message);
            });
    }


    GetActivitiesByFilter = (filtroSelecionado, textFilter) => {
        ApiService.ActivitiesByFilter(idProjeto, ATIVOS, filtroSelecionado, textFilter, tokenRef)
            .then(res => {
                this.setState({ openActivityDialog: false });
                this.setState({ datasource: [] });
                if (res.status === STATUS_200) {
                    PopUp.ExibeMensagem('success', res.message);
                    this.setState({ datasource: [...this.state.datasource, ...res.data] });
                }
                else if (res.status === STATUS_400) {
                    PopUp.ExibeMensagem('info', res.message);
                    this.setState({ datasource: [] });
                }
                else {
                    PopUp.ExibeMensagem('error', "Não foi possível carregar os clientes");
                    Log.LogError("MinhasAtividades", "GetActivitiesByFilter", res.message);
                    this.setState({ datasource: [] });
                }
            })
            .catch(err => {
                PopUp.ExibeMensagem('error', 'Falha na comunicação com a API ao listar os Clientes');
                Log.LogError("MinhasAtividades", "GettActivitiesByFilter", err.message);
            });
    }


    FilterChangeActivities = (filtroSelecionado, dataDe, dataAte, textFilter) => {
        try {
            if (filtroSelecionado === "Todos")
                this.GetAllActivities();
            else if (filtroSelecionado === "Data")
                this.GetActivitiesByDate(dataDe, dataAte)
            else
                this.GetActivitiesByFilter(filtroSelecionado, textFilter);
        }
        catch (err) {
            Log.LogError("MinhasAtividades", "FilterChangeActivities", err.message);
        }
    }


    GetIdAtividade = (id) => {
        idAtividade = id;
    }


    CloseActivityDialog = () => {
        this.setState({ openActivityDialog: false });
    }


    OpenMenuBar = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }


    CloseMenuBar = (action) => {
        this.setState({ anchorEl: null });
    }


    VizualizeActivityDialog = () => {
        this.setState({ openActivityDialog: false });
        window.location.href = "VisualizaAtividade?Ref=" + tokenRef + "&IdAtividade=" + idAtividade + "&IdProjeto=" + idProjeto;
    }


    NovaAtividade = () => {
        window.location.href = "NovaAtividade?Ref=" + tokenRef + "&IdProjeto=" + idProjeto;
    }


    GoToMeusProjetos = () => {
        window.location.href = "MeusProjetos?Ref=" + tokenRef;
    }


    Voltar = () => {
        window.location.href = "VisualizaProjeto?Ref=" + tokenRef + "&IdProjeto=" + idProjeto;
    }


    render() {
        return (
            <div className="body-table-atividades">
                <div className="menu-superior">
                    <AddCircleTwoToneIcon className="icons-menu" color="primary" onClick={this.NovaAtividade} />
                    <Button className="buttons-menu" onClick={this.NovaAtividade}>Nova Atividade</Button>
                    <AccountTreeTwoToneIcon className="icons-menu" color="primary" onClick={this.GoToMeusProjetos} />
                    <Button className="buttons-menu" onClick={this.GoToMeusProjetos}>Meus Projetos</Button>
                    <HourglassFullTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" />
                    <Button className="buttons-menu" >Tempo Gasto Geral</Button>
                    <AssessmentTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" />
                    <Button className="buttons-menu">Gráficos</Button>
                    <SearchTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" />
                    <Button className="buttons-menu">Filtros</Button>
                    <div className="box-perfil" aria-controls="simple-menu" aria-haspopup="true" onMouseOver={this.OpenMenuBar}>E</div>
                    <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={Boolean(this.state.anchorEl)} onClose={this.CloseMenuBar}>
                        <div className="user-info">Euax</div>
                        <MenuItem onClick={() => this.CloseMenuBar("Perfil")}>Perfil</MenuItem>
                        <MenuItem onClick={() => this.CloseMenuBar("TrocaSenha")}>Trocar Senha</MenuItem>
                    </Menu>
                    <div className="printer-style-projetos"><img src={PrintIcon} width="37" alt="Printer" onClick={PrinterImage.Print}></img></div>
                </div>
                <div className="table-padrao">
                    <Dialog open={this.state.openActivityDialog} onClose={this.CloseActivityDialog} aria-labelledby="draggable-dialog-title">
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Confirmação!</DialogTitle>
                        <DialogContent> <DialogContentText>{message}</DialogContentText> </DialogContent>
                        <DialogActions>
                            <Button className="dialog-padrao" onClick={this.VizualizeActivityDialog}>Sim</Button>
                            <Button className="dialog-padrao" onClick={this.CloseActivityDialog}>Não</Button>
                        </DialogActions>
                    </Dialog>
                    <Paper>
                        <TableContainer className="table-padrao-container">
                            <Table id="tbMinhasAtividades">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>{column.label}</TableCell>))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.datasource.map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>{columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align} onClick={() => this.GetIdAtividade(row.Id)}>
                                                        {column.id === "NomeAtividade" && String(value).length >= 39 ? String(value) + "..." :
                                                            column.id === "Porcentagem" ? <div id="divActivityProgress"><div id="ActivityProgressLine" style={{ width: value + "%" }}>{value + "%"}</div></div> :
                                                                value === 1 ? ("Sim") :
                                                                    value === 0 ? ("Não") :
                                                                        value}
                                                    </TableCell>
                                                )
                                            })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
                <Button className="btn-voltar-atividades" onClick={this.Voltar}>Voltar</Button>
                <div id="div-after-end"></div>
            </div>
        )
    };
}
export default MinhasAtividades;