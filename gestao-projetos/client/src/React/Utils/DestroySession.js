import PopUp from './PopUp';
import Log from '../../Functions/GeraLog';

const DestroySession = {
    Destroy: (tokenRef) => {
        fetch('http://' + window.location.hostname + ':5000/api/sgp/remove/profile', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ "token": tokenRef })
        }).then(res => {
            if (res.status === 200)
                window.location.href = "/";
            else {
                PopUp.ExibeMensagem('error', "Não foi possível encerrar a sessão!");
                Log.LogError("Functions", "DestroySession", res.message);
            }
        }).catch(err => {
            PopUp.ExibeMensagem('error', "Não foi possível comunicar com a API");
            Log.LogError("Functions", "DestroySession", err.message);
        });
    }
}
export default DestroySession