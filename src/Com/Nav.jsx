import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
const TimezoneConverter = () => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const today = new Date();
  const year = today.getFullYear();
  const month = monthNames[today.getMonth()];
  const day = today.getDate();
  const [currentDate, setCurrentDate] = useState(new Date(`${month} ${day} ${year}`));
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());
  function generateTimeSlots(timezone) {
    const timeSlots = [];
    for (let hour = 8; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = new Date(currentDate);
        timeSlot.setUTCHours(hour, minute);
        const options = {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          timeZone: timezone,
        };
        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(timeSlot);
        timeSlots.push(formattedTime);
      }
    }
    return timeSlots;
  }



    const saveDataToJSON = async (timeSlot) => {
        const data = {
          id: 101,
          name: 'test',
          date: currentDate.toISOString().split('T')[0], 
          time: timeSlot.split(' ')[0],
        };
      
        try {
          const response = await axios.post('http://localhost:3001/data', data);
          console.log('Save data:', response.data);
        } catch (error) {
          console.error('Error saving data:', error);
        }
      };
      

  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatTime = (date, timezone) => {
    const options = {
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: timezone,
    };
    return date.toLocaleString('en-US', options);
  };

  const handleDateChange = (daysToAdd) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + daysToAdd);

    const newYear = newDate.getFullYear();
    const newMonth = monthNames[newDate.getMonth()];
    const newDay = newDate.getDate();

    setCurrentDate(new Date(`${newMonth} ${newDay} ${newYear}`));
  };



  useEffect(() => {
    const utcTime = currentDate.toUTCString();
    const targetTime = currentDate.toLocaleString('en-US', { timeZone: selectedTimezone });
    console.log(`UTC Time: ${utcTime}`);
    console.log(`Target Timezone Time: ${targetTime}`);
  }, [currentDate, selectedTimezone]);

  const getWeekDates = () => {
    const weekDates = [];
    const currentDay = currentDate.getDay();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDay);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      weekDates.push(day);
    }

    return weekDates;
  };
  const handleTimezoneChange = (e) => {
    const newTimezone = e.target.value;
    setSelectedTimezone(newTimezone);
    setTimeSlots(generateTimeSlots(newTimezone));
  };
  
  return (
    <>
      <nav className='nav__div'>
        <span className='nav__spanleft'>
          <FontAwesomeIcon className='lefticon' icon={faCaretLeft} />
          <button className='nav__Previousbutton' onClick={() => handleDateChange(-7)}>
            Previous Week
          </button>
        </span>
        <span>{currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>

        <span>
          <button className='nav__nextbutton' onClick={() => handleDateChange(7)}>
            Next Week
          </button>
          <FontAwesomeIcon className='righticon' icon={faCaretRight} />
        </span>
      </nav>
      <div className='timezonediv'>
        <label>
          Timezone
          <div className='timezonediv__option'>
            <select className='timezonediv__option' value={selectedTimezone} onChange={handleTimezoneChange}>
              <option value="UTC">UTC</option>
              <option value="Europe/Berlin">Europe/Berlin (UTC+2)</option>
            </select>
          </div>
        </label>
      </div>
      <div>
  <aside className='weekdiv'>
    {getWeekDates().map((day, index) => (
      <div key={index} className={`day-box ${index === currentDate.getDay() ? 'current-day' : ''}`}>
        <div>{daysOfWeek[index]}</div>
        <div>{day.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</div>
        {day.getTime() >= currentDate.getTime() ? (
          <div className='notepad'>
            {timeSlots.map((timeSlot, slotIndex) => (
              <div key={slotIndex}>
                <input type="checkbox" id={`checkbox-${slotIndex}`} onChange={() => saveDataToJSON(timeSlot)} />
                <label htmlFor={`checkbox-${slotIndex}`}>
                  {timeSlot}
                </label>
              </div>
            ))}
          </div>
        ) :     <div className='notepad'>
           Past
          </div>}
      </div>
    ))}
  </aside>
</div>
    </>
  );
};

export default TimezoneConverter;
