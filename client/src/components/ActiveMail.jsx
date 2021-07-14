import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import http from '../api/http';
import { NotificationSuccess } from '../common/Notification';

function ActiveMail(props) {
    const { activation_token } = useParams()
    const history = useHistory()
    useEffect(() => {
        if (activation_token) {
            // console.log("activation_token", activation_token)
            const acctiveEmail = async () => {
                try {
                    const data = activation_token;
                    const res = await http.post("/activation", {
                        activation_token: data
                    })
                    if (res?.status === 200) {
                        history.push("/login")
                        NotificationSuccess("", res.data.msg)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            acctiveEmail()
        }
    }, [activation_token])
    return (
        <div>
        </div>
    );
}

export default ActiveMail;