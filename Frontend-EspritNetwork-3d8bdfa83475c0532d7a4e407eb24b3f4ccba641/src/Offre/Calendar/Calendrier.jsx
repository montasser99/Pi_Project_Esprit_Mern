import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/fr';
import axios from 'axios';
import '../calendar.css';

const MeetingScheduler = () => {
    useEffect(() => {
        moment.locale('fr', {
            week: {
                dow: 1, 
            },
        });
    }, []);

    const [events, setEvents] = useState([]);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const userInfoString = localStorage.getItem("userInfo");
                const userInfo = JSON.parse(userInfoString);
                const userId = userInfo._id;
                
                const response = await axios.get(`http://localhost:3000/offre/getresultTest/${userId}`);
                const data = response.data;
                
                const transformedEvents = data.map(item => {
                    if (item.invited_at) { 
                        return {
                            id: item.idOffre,
                            title: item.title,
                            start: new Date(item.invited_at),
                            end: new Date(item.invited_at),
                            allDay: false,
                        };
                    } else if (item.date) { 
                        return {
                            id: item.idOffre,
                            title: item.title,
                            start: new Date(item.date),
                            end: new Date(item.date),
                            allDay: false,
                        };
                    }
                });
                
                setEvents(transformedEvents);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchEvents();
    }, []);

    const localizer = momentLocalizer(moment);

    return (
        <section id="services" className="section py" data-aos="fade-up">
            <div className="container">
                <div className="row">
                    <h2>Consultez votre calendrier</h2>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 700 , width:2000}}
                        messages={{
                            allDay: 'Toute la journée',
                            previous: 'Précédent',
                            next: 'Suivant',
                            today: "Aujourd'hui",
                            month: 'Mois',
                            week: 'Semaine',
                            day: 'Jour',
                            agenda: 'Agenda',
                            date: 'Date',
                            time: 'Heure',
                            event: 'Événement',
                            noEventsInRange: 'Aucun événement dans cette plage',
                            showMore: total => `+ ${total} événement(s) supplémentaire(s)`
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default MeetingScheduler;
