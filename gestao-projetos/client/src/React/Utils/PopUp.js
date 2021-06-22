import M from 'materialize-css';

const PopUp = {
    ExibeMensagem: async (status, msg, tempo = 2000) => {
        try {
            if (status === "success") { M.toast({ html: msg, classes: 'green', displayLength: tempo }); }
            if (status === "info") { M.toast({ html: msg, classes: 'blue', displayLength: tempo }); }
            if (status === "error") { M.toast({ html: msg, classes: 'red', displayLength: tempo }); }
        }
        catch (err) {
            console.log(err.message);
        }
    }
}
export default PopUp;