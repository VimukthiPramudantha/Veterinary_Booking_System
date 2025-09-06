import React, { useState, useEffect } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';

const CalendarPicker = ({ selectedDate, onDateSelect, minDate, maxDate, workingHours }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);

  // Update current month when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      const selectedMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), 1);
      setCurrentMonth(selectedMonth);
    }
  }, [selectedDate]);

  const today = new Date();
  const minSelectableDate = minDate || new Date(today.getTime() + 24 * 60 * 60 * 1000); // Tomorrow by default

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar grid
  const calendarDays = [];
  
  // Previous month's trailing days
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevMonthDate = new Date(firstDayOfMonth);
    prevMonthDate.setDate(prevMonthDate.getDate() - (startingDayOfWeek - i));
    calendarDays.push({
      date: prevMonthDate,
      isCurrentMonth: false,
      isToday: false,
      isSelectable: false
    });
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isToday = date.toDateString() === today.toDateString();
    const isSelectable = date >= minSelectableDate && (!maxDate || date <= maxDate);
    
    calendarDays.push({
      date,
      isCurrentMonth: true,
      isToday,
      isSelectable
    });
  }

  // Next month's leading days to fill the grid
  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
    calendarDays.push({
      date: nextMonthDate,
      isCurrentMonth: false,
      isToday: false,
      isSelectable: false
    });
  }

  const handleMonthChange = (direction) => {
    setIsAnimating(true);
    setTimeout(() => {
      const newMonth = new Date(currentMonth);
      if (direction === 'prev') {
        newMonth.setMonth(currentMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(currentMonth.getMonth() + 1);
      }
      setCurrentMonth(newMonth);
      setIsAnimating(false);
    }, 150);
  };

  const handleDateClick = (dayInfo) => {
    if (dayInfo.isSelectable && dayInfo.isCurrentMonth) {
      const dateString = dayInfo.date.toISOString().split('T')[0];
      onDateSelect(dateString);
      // Keep the calendar on the month of the selected date
      setCurrentMonth(new Date(dayInfo.date.getFullYear(), dayInfo.date.getMonth(), 1));
    }
  };

  const isSelected = (dayInfo) => {
    if (!selectedDate || !dayInfo.isCurrentMonth) return false;
    const dateString = dayInfo.date.toISOString().split('T')[0];
    return dateString === selectedDate;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleMonthChange('prev')}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 group"
          >
            <ChevronLeftIcon className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="flex items-center space-x-3">
            <CalendarDaysIcon className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
          </div>
          
          <button
            onClick={() => handleMonthChange('next')}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 group"
          >
            <ChevronRightIcon className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center py-2">
              <span className="text-sm font-semibold text-gray-500">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className={`grid grid-cols-7 gap-1 transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          {calendarDays.map((dayInfo, index) => {
            const isSelectedDay = isSelected(dayInfo);
            return (
              <button
                key={index}
                onClick={() => handleDateClick(dayInfo)}
                disabled={!dayInfo.isSelectable || !dayInfo.isCurrentMonth}
                className={`
                  relative h-12 w-full rounded-lg text-sm font-medium transition-all duration-200 
                  ${!dayInfo.isCurrentMonth 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : dayInfo.isSelectable
                    ? isSelectedDay
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-110 z-10'
                      : dayInfo.isToday
                      ? 'bg-primary-50 text-primary-700 border-2 border-primary-200 hover:bg-primary-100 hover:border-primary-300'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 hover:scale-105'
                    : 'text-gray-400 cursor-not-allowed'
                  }
                  ${isSelectedDay ? 'ring-4 ring-primary-200' : ''}
                `}
              >
                <span className={`relative z-10 ${isSelectedDay ? 'drop-shadow-sm' : ''}`}>
                  {dayInfo.date.getDate()}
                </span>
                
                {/* Today indicator */}
                {dayInfo.isToday && !isSelectedDay && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                  </div>
                )}
                
                {/* Selected day glow effect */}
                {isSelectedDay && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg opacity-20 animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Working Hours Display */}
        {workingHours && workingHours.startTime && workingHours.endTime && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">Doctor's Working Hours</p>
              <div className="flex items-center justify-center space-x-2 text-indigo-700">
                <span className="text-lg font-semibold">
                  {workingHours.startTime} - {workingHours.endTime}
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {workingHours.slotDuration || 30} minute slots
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;