
import React from 'react';

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

export default function Daypicker(props) {
  return <DayPicker onDayClick={props.onDayClick} selectedDays={props.selectedDay} />
}