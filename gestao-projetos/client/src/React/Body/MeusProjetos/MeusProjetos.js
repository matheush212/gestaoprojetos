import React from 'react';
import './MeusProjetos.css';
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
import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';
import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import DestroySession from '../../Utils/DestroySession';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import PrintIcon from '../../../React/Images/PrintIcon.png';
import PrinterImage from '../../../Functions/PrinterImage';
import UrlParm from '../../../Functions/GetUrlParameters';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AutenticacaoSession from '../../../Autenticacao/AutenticacaoSession';
import Log from '../../../Functions/GeraLog';
import $ from "jquery";
let columns = [];
let filters = [];
let message = "";
let idProjeto = "";
let tokenRef = UrlParm.queryString("Ref");
const ATIVOS = 1;
const STATUS_200 = 200;
const STATUS_400 = 400;


class MeusProjetos extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            datasource: [],
            openProjectDialog: false,
            openLogOutDialog: false,
            anchorEl: null,
            chkNome: false,
            chkDtIni: false,
            chkDtFin: false,
            chkPercent: false,
            chkAtrasados: false,
            chkFinalizados: false
        }

        PopUp.ExibeMensagem('info', "Filtre e selecione uma linha com o registro desejado!", 4000);

        columns = [
            { id: "NomeProjeto", label: 'Nome do Projeto', minWidth: 80, align: 'center' },
            { id: "DataInicio", label: 'Dt. Inicial', minWidth: 80, align: 'center' },
            { id: "DataFinal", label: 'Dt. Final', minWidth: 80, align: 'center' },
            { id: "Porcentagem", label: '% Completo', minWidth: 50, align: 'center' },
            { id: "Atrasado", label: 'Vai Atrasar?', minWidth: 60, align: 'center' },
            { id: "Finalizado", label: 'Finalizado?', minWidth: 60, align: 'center' },
            { id: "DataCadastro", label: 'Dt. Cadastro?', minWidth: 80, align: 'center' },
            { id: "Ativo", label: 'Ativo?', minWidth: 60, align: 'center' },
        ]
    }


    componentDidMount() {
        try {
            document.getElementById("div-after-end").style.setProperty('display', 'flex', 'important');

            let _this = this;
            $("#tbMeusProjetos").on("click", "tbody tr", function (event) {
                $(this).addClass('selected-padrao').siblings().removeClass('selected-padrao');
                message = `Você deseja visualizar o projeto '${$(this).find('td:eq(0)').html()}'?`;
                _this.setState({ openProjectDialog: true });
            });

            this.GetAllProjects();
        }
        catch (err) {
            Log.LogError("MeusProjetos", "componentDidMount", err.message);
        }
    }


    GetAllProjects = () => {
        ApiService.AllProjects(ATIVOS, tokenRef)
            .then(res => {
                this.setState({ openProjectDialog: false });
                this.setState({ datasource: [] });
                if (res.status === STATUS_200)
                    this.setState({ datasource: [...this.state.datasource, ...res.data] });
                else if (res.status === STATUS_400) {
                    PopUp.ExibeMensagem('info', res.message);
                    this.setState({ datasource: [] });
                }
                else {
                    PopUp.ExibeMensagem('error', "Não foi possível carregar os projetos");
                    Log.LogError("MeusProjetos", "GetAllProjects", res.message);
                    this.setState({ datasource: [] });
                }
            })
            .catch(err => {
                PopUp.ExibeMensagem('error', 'Falha na comunicação com a API ao listar os projetos');
                Log.LogError("MeusProjetos", "GetAllProjects", err.message);
            });
    }

    GetIdProjeto = (id) => {
        idProjeto = id;
    }


    CloseProjectDialog = () => {
        this.setState({ openProjectDialog: false });
    }


    VizualizeProjectDialog = () => {
        this.setState({ openProjectDialog: false });
        window.location.href = "VisualizaProjeto?Ref=" + tokenRef + "&IdProjeto=" + idProjeto;
    }


    LogOut = () => {
        this.setState({ openLogOutDialog: true });
    }


    CloseLogOutDialog = () => {
        this.setState({ openLogOutDialog: false });
    }


    ConfirmLogOutDialog = () => {
        this.setState({ openLogOutDialog: false });
        DestroySession.Destroy(tokenRef);
    }


    OpenMenuBar = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }


    CloseMenuBar = (action) => {
        this.setState({ anchorEl: null });

        if (action === "LogOut")
            this.setState({ openLogOutDialog: true });
        else if (action === "Perfil")
            window.location.href = "AlteraPerfil?Ref=" + tokenRef;
        else if (action === "TrocaSenha")
            window.location.href = "AlteraSenha?Ref=" + tokenRef;
    }


    CloseDialogFiltersProjeto = () => {
        this.setState({ openBoxFiltersProjeto: false });
    }


    ConfirmDialogFiltersProjeto = () => {
        this.setState({ openBoxFiltersProjeto: false });
        this.setState({ openProjectDialog: false });
        this.setState({ datasource: [] });

        this.FiltarProjetos();
    }


    FiltarProjetos = () => {
        this.GetFilters();

        if (AutenticacaoSession.Authorize()) {
            fetch('http://' + window.location.hostname + ':5000/api/sgp/filtros/projeto', {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ "filters": filters, "token": tokenRef })
            }).then((response) => response.json()).then((res) => {
                if (res.status === STATUS_200)
                    this.setState({ datasource: [...this.state.datasource, ...res.data] });
                else if (res.status === STATUS_400)
                    PopUp.ExibeMensagem('info', res.message);
                else {
                    PopUp.ExibeMensagem('error', "Não foi possível encontrar os projetos!");
                    Log.LogError("MeusProjetos", "FiltarProjetos", res.message);
                    this.GetAllProjects();
                }
            }).catch(err => {
                PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
                Log.LogError("MeusProjetos", "FiltarProjetos", err.message);
            });
        }
        else
            PopUp.ExibeMensagem('error', "Autorização Negada!");
    }


    GetFilters = () => {
        filters = [];

        if (this.state.chkNome) filters.push({ "key": "Nome", "operator": "LIKE", "value": document.getElementById("FiltroNomeProjeto").value + "%" });
        if (this.state.chkDtIni) filters.push({ "key": "DtInicio", "operator": ">=", "value": document.getElementById("FiltroDtInicioProjeto").value });
        if (this.state.chkDtFin) filters.push({ "key": "DtFinal", "operator": "<=", "value": document.getElementById("FiltroDtFinalProjeto").value });
        if (this.state.chkPercent) filters.push({ "key": "Porcentagem", "operator": "=", "value": document.getElementById("FiltroPorcentagemProjeto").value });
        if (this.state.chkAtrasados) filters.push({ "key": "Atrasado", "operator": "=", "value": 1 });
        if (this.state.chkFinalizados) filters.push({ "key": "Finalizado", "operator": "=", "value": 1 });
    }


    NovoProjeto = () => {
        window.location.href = "NovoProjeto?Ref=" + tokenRef;
    }


    GoToInformacoes = () => {
        window.location.href = "Informacoes?Ref=" + tokenRef;
    }


    render() {
        return (
            <div className="body-table-projetos">
                <div className="menu-superior">
                    <AddCircleTwoToneIcon className="icons-menu" color="primary" onClick={this.NovoProjeto} />
                    <Button className="buttons-menu" onClick={this.NovoProjeto}>Novo Projeto</Button>
                    <InfoTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" onClick={this.GoToInformacoes}/>
                    <Button className="buttons-menu" onClick={this.GoToInformacoes}>Informações Gerais</Button>
                    <SearchTwoToneIcon className="icons-menu" style={{ marginLeft: '1em' }} color="primary" onClick={() => this.setState({ openBoxFiltersProjeto: true })} />
                    <Button className="buttons-menu" onClick={() => this.setState({ openBoxFiltersProjeto: true })}>Filtros</Button>
                    <div className="box-perfil" aria-controls="simple-menu" aria-haspopup="true" onMouseOver={this.OpenMenuBar}>E</div>
                    <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={Boolean(this.state.anchorEl)} onClose={this.CloseMenuBar}>
                        <div className="user-info">Euax</div>
                        <MenuItem onClick={() => this.CloseMenuBar("Perfil")}>Perfil</MenuItem>
                        <MenuItem onClick={() => this.CloseMenuBar("TrocaSenha")}>Trocar Senha</MenuItem>
                        <MenuItem onClick={() => this.CloseMenuBar("LogOut")}>Sair</MenuItem>
                    </Menu>
                    <div className="printer-style-projetos"><img src={PrintIcon} width="37" alt="Printer" onClick={PrinterImage.Print}></img></div>
                </div>
                <div className="table-padrao">
                    <Dialog open={this.state.openProjectDialog} onClose={this.CloseProjectDialog} aria-labelledby="draggable-dialog-title">
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Confirmação!</DialogTitle>
                        <DialogContent> <DialogContentText>{message}</DialogContentText> </DialogContent>
                        <DialogActions>
                            <Button className="dialog-padrao" onClick={this.VizualizeProjectDialog}>Sim</Button>
                            <Button className="dialog-padrao" onClick={this.CloseProjectDialog}>Não</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.openLogOutDialog} onClose={this.CloseLogOutDialog} aria-labelledby="draggable-dialog-title">
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Confirmação!</DialogTitle>
                        <DialogContent> <DialogContentText>Deseja deslogar do sistema?</DialogContentText> </DialogContent>
                        <DialogActions>
                            <Button className="dialog-padrao" onClick={this.ConfirmLogOutDialog}>Sim</Button>
                            <Button className="dialog-padrao" onClick={this.CloseLogOutDialog}>Não</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.openBoxFiltersProjeto} onClose={this.CloseDialogFiltersProjeto} aria-labelledby="draggable-dialog-title">
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Filtros!</DialogTitle>
                        <DialogContent><DialogContentText>Escolha os filtros que você deseja!</DialogContentText></DialogContent>
                        <div className="filter-fields">
                            <FormControlLabel className="form-control-label" control={<Checkbox checked={this.state.chkNome} onChange={(event) => this.setState({ chkNome: event.target.checked })} />} label="Nome" />
                            {this.state.chkNome === true ? (<TextField id="FiltroNomeProjeto" className="textfield-filters" />) : (null)}
                        </div>
                        <div className="filter-fields">
                            <FormControlLabel className="form-control-label" control={<Checkbox checked={this.state.chkDtIni} onChange={(event) => this.setState({ chkDtIni: event.target.checked })} />} label="Dt. Início" />
                            {this.state.chkDtIni === true ? (<TextField id="FiltroDtInicioProjeto" type="date" className="textfield-filters" />) : (null)}
                        </div>
                        <div className="filter-fields">
                            <FormControlLabel className="form-control-label" control={<Checkbox checked={this.state.chkDtFin} onChange={(event) => this.setState({ chkDtFin: event.target.checked })} />} label="Dt. Final" />
                            {this.state.chkDtFin === true ? (<TextField id="FiltroDtFinalProjeto" type="date" className="textfield-filters" />) : (null)}
                        </div>
                        <div className="filter-fields">
                            <FormControlLabel className="form-control-label" control={<Checkbox checked={this.state.chkPercent} onChange={(event) => this.setState({ chkPercent: event.target.checked })} />} label="Porcentagem" />
                            {this.state.chkPercent === true ? (<TextField id="FiltroPorcentagemProjeto" className="textfield-filters" />) : (null)}
                        </div>
                        <div className="filter-fields">
                            <FormControlLabel control={<Checkbox checked={this.state.chkAtrasados} onChange={(event) => this.setState({ chkAtrasados: event.target.checked })} />} label="Atrasados" />
                        </div>
                        <div className="filter-fields">
                            <FormControlLabel control={<Checkbox checked={this.state.chkFinalizados} onChange={(event) => this.setState({ chkFinalizados: event.target.checked })} />} label="Finalizados" />
                        </div>
                        <DialogActions>
                            <Button className="dialog-padrao" onClick={this.ConfirmDialogFiltersProjeto} color="primary">Filtrar</Button>
                            <Button className="dialog-padrao" onClick={this.CloseDialogFiltersProjeto} color="primary">Fechar</Button>
                        </DialogActions>
                    </Dialog>

                    <Paper>
                        <TableContainer className="table-padrao-container">
                            <Table id="tbMeusProjetos">
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
                                                    <TableCell key={column.id} align={column.align} onClick={() => this.GetIdProjeto(row.Id)}>
                                                        {column.id === "NomeProjeto" && String(value).length >= 39 ? String(value) + "..." :
                                                            column.id === "Porcentagem" ? <div id="divProjectProgress"><div id="ProjectProgressLine" style={{ width: value + "%" }}>{value + "%"}</div></div> :
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
                <Button className="btn-sair" onClick={this.LogOut}>Sair</Button>
                <div id="div-after-end"></div>
            </div>
        )
    };
}
export default MeusProjetos;