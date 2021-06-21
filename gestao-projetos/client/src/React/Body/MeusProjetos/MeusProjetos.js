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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import UrlParm from '../../../Functions/GetUrlParameters';
import Log from '../../../Functions/GeraLog';
import $ from "jquery";
let columns = [];
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
            anchorEl: null
        }

        PopUp.ExibeMensagem('info', "Filtre e selecione uma linha com o registro desejado!");

        columns = [
            { id: "NomeProjeto", label: 'Nome', minWidth: 100, align: 'center' },
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
                    Log.LogError("MeusProjetos", "GetAllProjects", res.message);
                    this.setState({ datasource: [] });
                }
            })
            .catch(err => {
                PopUp.ExibeMensagem('error', 'Falha na comunicação com a API ao listar os Clientes');
                Log.LogError("MeusProjetos", "GetAllProjects", err.message);
            });
    }


    GetProjectsByDate = (dataDe, dataAte) => {
        ApiService.ProjectsByDate(ATIVOS, dataDe, dataAte, tokenRef)
            .then(res => {
                this.setState({ openProjectDialog: false });
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
                    Log.LogError("MeusProjetos", "GetProjectsByDate", res.message);
                    this.setState({ datasource: [] });
                }
            })
            .catch(err => {
                PopUp.ExibeMensagem('error', 'Falha na comunicação com a API ao listar os Clientes');
                Log.LogError("MeusProjetos", "GetProjectsByDate", err.message);
            });
    }


    GetProjectsByFilter = (filtroSelecionado, textFilter) => {
        ApiService.ProjectsByFilter(ATIVOS, filtroSelecionado, textFilter, tokenRef)
            .then(res => {
                this.setState({ openProjectDialog: false });
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
                    Log.LogError("MeusProjetos", "GetProjectsByFilter", res.message);
                    this.setState({ datasource: [] });
                }
            })
            .catch(err => {
                PopUp.ExibeMensagem('error', 'Falha na comunicação com a API ao listar os Clientes');
                Log.LogError("MeusProjetos", "GettProjectsByFilter", err.message);
            });
    }


    FilterChangeProjects = (filtroSelecionado, dataDe, dataAte, textFilter) => {
        try {
            if (filtroSelecionado === "Todos")
                this.GetAllProjects();
            else if (filtroSelecionado === "Data")
                this.GetProjectsByDate(dataDe, dataAte)
            else
                this.GetProjectsByFilter(filtroSelecionado, textFilter);
        }
        catch (err) {
            Log.LogError("MeusProjetos", "FilterChangeClientes", err.message);
        }
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
        this.DestroySession();
    }


    OpenMenuBar = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }


    CloseMenuBar = (action) => {
        this.setState({ anchorEl: null });

        if (action === "LogOut")
            this.setState({ openLogOutDialog: true });
    }


    NovoProjeto = () => {
        window.location.href = "NovoProjeto?Ref=" + tokenRef;
    }


    DestroySession = () => {
        ApiService.RemoveUserProfile(tokenRef)
            .then(res => {
                if (res.status === STATUS_200)
                    window.location.href = "/";
                else {
                    PopUp.ExibeMensagem('error', res.message);
                    Log.LogError("MeusProjetos", "DestroySession", res.message);
                }
            })
            .catch(err => {
                PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
                Log.LogError("MeusProjetos", "DestroySession", err.message);
            });
    }


    render() {
        return (
            <div className="body-table-projetos">
                <div className="menu-superior">
                    <AddCircleTwoToneIcon className="icons-menu" color="primary" onClick={this.NovoProjeto} />
                    <Button className="buttons-menu" onClick={this.NovoProjeto}>Novo Projeto</Button>
                    <Button className="buttons-menu" style={{ marginLeft: '0.5%' }}>Projetos</Button>
                    <Button className="buttons-menu" style={{ marginLeft: '0.5%' }}>Filtros</Button>
                    <div className="box-perfil" aria-controls="simple-menu" aria-haspopup="true" onMouseOver={this.OpenMenuBar}>E</div>
                    <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={Boolean(this.state.anchorEl)} onClose={this.CloseMenuBar}>
                        <div className="user-info">Euax</div>
                        <MenuItem onClick={() => this.CloseMenuBar("Perfil")}>Perfil</MenuItem>
                        <MenuItem onClick={() => this.CloseMenuBar("TrocaSenha")}>Trocar Senha</MenuItem>
                        <MenuItem onClick={() => this.CloseMenuBar("LogOut")}>Sair</MenuItem>
                    </Menu>
                </div>
                <div className="table-projetos">
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
                    <Paper>
                        <TableContainer className="table-projetos-container">
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
                                                        {column.id === "Porcentagem" ? value : value === 1 ? ("Sim") : value === 0 ? ("Não") : value}
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