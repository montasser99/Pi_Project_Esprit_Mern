import { useState, useEffect } from 'react';
 import './Chatbot.css'; 
 import espritNetwork from "../assets/logo-network.png";

 const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
     const [name, setName] = useState('');
  
    useEffect(() => {
       const userInfoString = localStorage.getItem("userInfo");
       if (userInfoString) {
         try {
           const userInfo = JSON.parse(userInfoString);
           if (userInfo && userInfo.name) {
             setName(userInfo.name);
             console.log('hhhhhmadhahka',userInfo.name)
           }
         } catch (error) {
           console.error("Error parsing user information:", error);
        }
       }
     }, []);
   const toggleChat = () => {
     setIsOpen(!isOpen);
   };

   return (
     <div>
       {/* Chat Circle */}       <div className="chatbot-circle" onClick={toggleChat}>
         <img src={espritNetwork} alt="Esprit Network" style={{ width: 40, height: 40 }} className="img-fluid animated" />
         <span className="conversation-indicator"></span>
       </div>

       {/* Chat Window */}
       {isOpen && (
         <div className="chatbot-window">
          
           <div id="tlkio" data-channel="espritnetwork" style={{ width: '100%', height: 'calc(100% - 40px)' }}>
             {/* Modify the iframe source to include the user's name as a query parameter */}
            <iframe src={`//embed.tlk.io/espritnetwork?nick=${encodeURIComponent(name)}`} width="100%" height="100%" frameBorder={0} />
          </div>
         </div>
       )}
     </div>
   );
 };

 export default Chatbot;
