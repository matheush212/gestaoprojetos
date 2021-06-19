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
import DialogTitle from '@material-ui/core/DialogTitle';
import FiltrosPadrao from '../FiltrosPadrao/FiltrosPadrao';
import UrlParm from '../../../Functions/GetUrlParameters';
import Log from '../../../Functions/GeraLog';
import $ from "jquery";
let columns = [];
let message = "";
let idProjeto = "";
let tokenRef = UrlParm.queryString("Ref");
const ATIVOS = 1;


class MeusProjetos extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            datasource: [],
            openDialog: false
        }

        PopUp.ExibeMensagem('info', "Filtre e selecione uma linha com o registro desejado!");

        columns = [
            { id: "Id", label: 'Id', minWidth: 60, align: 'center' },
            { id: "Nome", label: 'Nome', minWidth: 100, align: 'center' },
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
                idProjeto = $(this).find('td:eq(0)').html();
                message = "O que você deseja fazer?:";
                _this.setState({ openDialog: true });
            });

            this.GetAllProjects();
        }
        catch (err) {
            Log.LogError("MeusProjetos", "componentDidMount", err.message);
        }
    }


    GetAllProjects = () => {
        try {
            ApiService.AllProjects(ATIVOS, tokenRef)
                .then(res => {
                    this.setState({ openDialog: false });
                    this.setState({ datasource: [] });
                    if (res.status === 200) {
                        PopUp.ExibeMensagem('success', res.message);
                        this.setState({ datasource: [...this.state.datasource, ...res.data] });
                    }
                    else if (res.status === 400) {
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
        catch (err) {
            console.log(err.message);
        }
    }


    GetProjectsByDate = (dataDe, dataAte) => {
        try {
            ApiService.ProjectsByDate(ATIVOS, dataDe, dataAte, tokenRef)
                .then(res => {
                    this.setState({ openDialog: false });
                    this.setState({ datasource: [] });
                    if (res.status === 200) {
                        PopUp.ExibeMensagem('success', res.message);
                        this.setState({ datasource: [...this.state.datasource, ...res.data] });
                    }
                    else if (res.status === 400) {
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
        catch (err) {
            console.log(err.message);
        }
    }


    GetProjectsByFilter = (filtroSelecionado, textFilter) => {
        try {
            ApiService.ProjectsByFilter(ATIVOS, filtroSelecionado, textFilter, tokenRef)
                .then(res => {
                    this.setState({ openDialog: false });
                    this.setState({ datasource: [] });
                    if (res.status === 200) {
                        PopUp.ExibeMensagem('success', res.message);
                        this.setState({ datasource: [...this.state.datasource, ...res.data] });
                    }
                    else if (res.status === 400) {
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
        catch (err) {
            console.log(err.message);
        }
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


    DialogClose = () => {
        this.setState({ openDialog: false });
    }


    VizualizaProjeto = () => {
        this.setState({ openDialog: false });
    }


    EditaProjeto = () => {
        this.setState({ openDialog: false });
    }


    render() {
        return (
            <div className="body-table-projetos">
                <div className="table-projetos">
                    <Dialog open={this.state.openDialog} onClose={this.DialogClose} aria-labelledby="draggable-dialog-title">
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Confirmação!</DialogTitle>
                        <DialogContent> <DialogContentText>{message}</DialogContentText> </DialogContent>
                        <DialogActions>
                            <Button className="dialog-padrao" onClick={this.VizualizaProjeto}>Visualizar</Button>
                            <Button className="dialog-padrao" onClick={this.EditaProjeto}>Editar</Button>
                            <Button className="dialog-padrao" onClick={this.DialogClose}>Fechar</Button>
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
                                                    <TableCell key={column.id} align={column.align}>
                                                        {value}
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
                <div id="div-after-end"></div>
            </div>
        )
    };
}
export default MeusProjetos;