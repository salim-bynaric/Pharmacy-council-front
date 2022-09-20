import React,{useState,useEffect} from 'react';
import API from '../../../api';

const ClearSessionContinue = ({instId}) => 
{
    let [loading, setLoading] = useState(false);

    useEffect(() => 
    {
        clearSession(instId,setLoading);
        let myInterval = setInterval(() => 
        {
            clearSession(instId,setLoading);
        }, 120000);

        return () => 
        {
            clearInterval(myInterval);
        };
    },[instId]);

    return (
        <div>
            {
                loading ?
                    <div className="custom-loader"></div>
                : 
                <center><h4>This Page will fire Session Clear after every 2 Minutes</h4></center>
            }
        </div>
    );
};

async function clearSession(instId,setLoading)
{
    setLoading(true);
    await API.put('/sessions',{ 'type':'clearSessionScript', 'instId':instId })
        .then(function (res) 
        {
            setLoading(false);
        })
        .catch(function (error) 
        {
            setLoading(false);
        });
}

export default ClearSessionContinue;