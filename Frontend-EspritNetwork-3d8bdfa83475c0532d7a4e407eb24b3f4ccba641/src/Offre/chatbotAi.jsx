import './chatBot.css';
import React, { useEffect, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { BsFillMicFill } from 'react-icons/bs';

function ChatbotAi() {
    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setBotTyping] = useState(false);
    const { transcript, resetTranscript } = useSpeechRecognition();
    useEffect(() => {
        const objDiv = document.getElementById('messageArea');
        objDiv.scrollTop = objDiv.scrollHeight;
    }, [chat]);

    useEffect(() => {
        sendWelcomeMessage();
    }, []);

    useEffect(() => {
        if (transcript) {
            setInputMessage(prevTranscript => prevTranscript + ' ' + transcript);
            resetTranscript();
        }
    }, [transcript, resetTranscript]);

    const sendWelcomeMessage = () => {
        const welcomeMessage = {
            sender: "bot",
            msg: "Bonjour, je suis EspritNetworkBot. Comment puis-je vous aider ?"
        };
        setChat([welcomeMessage]);
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const name = "montasser";
        const request_temp = { sender: "user", sender_id: name, msg: inputMessage.trim() }; // Trim excess whitespace

        if (inputMessage !== "") {
            setChat(chat => [...chat, request_temp]);
            setBotTyping(true);
            setInputMessage('');
            rasaAPI(name, inputMessage);
        } else {
            window.alert("Veuillez entrer un message valide");
        }
    }

    const rasaAPI = async function handleClick(name, msg) {
        await fetch('http://localhost:5005/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'charset': 'UTF-8',
            },
            credentials: "same-origin",
            body: JSON.stringify({ "sender": name, "message": msg }),
        })
            .then(response => response.json())
            .then((response) => {
                if (response && response.length > 0) {
                    const messages = response.map(item => ({
                        sender: "bot",
                        recipient_id: item.recipient_id,
                        msg: item.text
                    }));
                    setChat(chat => [...chat, ...messages]);
                }
                setBotTyping(false)
            })
    }

    const handleQuestionClick = (question) => {
        const name = "montasser";

        setChat(chat => [...chat, { sender: "user", sender_id: name, msg: question }]);
        setBotTyping(true);
        rasaAPI(name, question);
        setBotTyping(false)
    }

    const stylecard = {
        maxWidth: '35rem',
        border: '1px solid black',
        paddingLeft: '0px',
        paddingRight: '0px',
        borderRadius: '30px',
        boxShadow: '0 16px 20px 0 rgba(0,0,0,0.4)'
    };

    const styleHeader = {
        height: '4.5rem',
        borderRadius: '30px 30px 0px 0px',
        backgroundColor: 'black',
    };

    const styleFooter = {
        borderTop: '1px solid black',
        borderRadius: '0px 0px 30px 30px',
        backgroundColor: 'black',
    };

    const styleBody = {
        paddingTop: '10px',
        height: '25rem',
        overflowY: 'a',
        overflowX: 'hidden',
    };

    return (
        <div style={{ marginTop: "100px"}}>
            <div className="container"  >
                <div className="row justify-content-center" >
                    <div className="card" style={stylecard}>
                        <div className="cardHeader text-white" style={styleHeader}>
                            <h3 style={{ marginTop: "20px", marginLeft: "100px" }}>Assistant Esprit Network</h3>
                        </div>
                        <div className="cardBody" id="messageArea" style={styleBody}>
                            <div className="row msgarea">
                                {chat.map((user, key) => (
                                    <div key={key}>
                                        {user.sender === 'bot' ?
                                            (
                                                <>
                                                    <div className='msgalignstart'>
                                                        <BiBot className="botIcon" /><h6 className="botmsg">{user.msg}</h6>
                                                    </div>
                                                </>
                                            )
                                            : ( 
                                                <div className='msgalignend'>
                                                    <h6 className="usermsg">{user.msg}</h6><BiUser className="userIcon" />
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}
                                {botTyping ? <h6>Bot saisie....</h6> : null}
                            </div>
                        </div>
                        <div className="col-12 mx-4 my-2">
                            <button className="btn btn-outline-dark mx-2" onClick={() => handleQuestionClick("Comment créer une offre ?")}>Comment créer une offre ?</button>
                            <button className="btn btn-outline-dark mx-2 my-1" onClick={() => handleQuestionClick("Comment lister mes offres ?")}>Comment lister mes offres ?</button>
                            <button className="btn btn-outline-dark mx-2 my-1" onClick={() => handleQuestionClick("Comment lister mes archive ?")}>Comment lister mes archives des offres ?</button>
                        </div>
                        <div className="cardFooter text-white" style={styleFooter}>
                            <div className="row">
                                <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
                                    <div className="col-10" style={{ paddingRight: '0px' }}>
                                        <input onChange={e => setInputMessage(e.target.value)} value={inputMessage} placeholder='Posez votre question ici' type="text" className="msginp" />
                                        <div className="voice-icon" onClick={SpeechRecognition.startListening}>
                                            <BsFillMicFill style={{ color: 'black', marginBottom: "55px", marginLeft: "850px", position: "absolute" }} />
                                        </div>
                                    </div>
                                    <div className="col-2 cola">
                                        <button type="submit" className="circleBtn"><IoMdSend className="sendBtn" /></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatbotAi;
