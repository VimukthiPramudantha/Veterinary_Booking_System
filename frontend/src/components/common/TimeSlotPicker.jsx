import React, { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const TimeSlotPicker = ({ 
  slots, 
  selectedTime, 
  onTimeSelect, 
  loading, 
  workingHours, 
  selectedDate 
}) => {
  const [animatingSlots, setAnimatingSlots] = useState(new Set());

  useEffect(() => {
    // Stagger animation of slots appearing
    if (slots && slots.length > 0) {
      slots.forEach((_, index) => {
        setTimeout(() => {
          setAnimatingSlots(prev => new Set([...prev, index]));
        }, index * 50);
      });
    }
    
    return () => setAnimatingSlots(new Set());
  }, [slots]);

  const handleSlotClick = (slot) => {
    if (!slot.isBooked) {
      onTimeSelect(slot.time);
    }
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeOfDay = (timeString) => {
    const [time, period] = timeString.split(' ');
    const [hour] = time.split(':').map(Number);
    const hour24 = period === 'PM' && hour !== 12 ? hour + 12 : (period === 'AM' && hour === 12 ? 0 : hour);
    
    if (hour24 >= 5 && hour24 < 12) return 'morning';
    if (hour24 >= 12 && hour24 < 17) return 'afternoon';
    return 'evening';
  };

  const groupSlotsByTimeOfDay = () => {
    if (!slots) return {};
    
    const groups = {
      morning: [],
      afternoon: [],
      evening: []
    };
    
    slots.forEach((slot, index) => {
      const timeOfDay = getTimeOfDay(slot.time);
      groups[timeOfDay].push({ ...slot, originalIndex: index });
    });
    
    return groups;
  };

  const timeGroups = groupSlotsByTimeOfDay();

  const getGroupIcon = (group) => {
    switch (group) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌇';
      default: return '🕐';
    }
  };

  const getGroupGradient = (group) => {
    switch (group) {
      case 'morning': return 'from-amber-400 to-orange-500';
      case 'afternoon': return 'from-blue-400 to-indigo-600';
      case 'evening': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner size="large" />
          <p className="text-gray-600 animate-pulse">Loading available time slots...</p>
        </div>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <ClockIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Available Slots</h3>
          <p className="text-gray-600">
            {selectedDate 
              ? 'No time slots available for this date. Please select another date.'
              : 'Please select a date to view available time slots.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4">
        <div className="flex items-center space-x-3">
          <ClockIcon className="h-6 w-6 text-white" />
          <div>
            <h2 className="text-xl font-semibold text-white">Available Time Slots</h2>
            {selectedDate && (
              <p className="text-indigo-200 text-sm">{formatSelectedDate()}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {Object.entries(timeGroups).map(([timeOfDay, groupSlots]) => {
          if (groupSlots.length === 0) return null;
          
          return (
            <div key={timeOfDay} className="mb-8 last:mb-0">
              {/* Time of day header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`bg-gradient-to-r ${getGroupGradient(timeOfDay)} rounded-full p-2 shadow-lg`}>
                  <span className="text-white font-semibold text-sm px-2">
                    {getGroupIcon(timeOfDay)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {timeOfDay}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
              </div>

              {/* Time slots grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {groupSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  const isAnimated = animatingSlots.has(slot.originalIndex);
                  
                  return (
                    <button
                      key={slot.time}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.isBooked}
                      className={`
                        relative group p-4 rounded-xl text-sm font-semibold transition-all duration-300 transform
                        ${isAnimated ? 'animate-fadeInUp' : 'opacity-0'}
                        ${slot.isBooked
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                          : isSelected
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl scale-105 border-2 border-primary-500'
                          : 'bg-gradient-to-r from-gray-50 to-white text-gray-700 hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 hover:scale-105 hover:shadow-lg border-2 border-gray-200 hover:border-primary-300'
                        }
                      `}
                    >
                      {/* Background glow for selected */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl opacity-20 animate-pulse"></div>
                      )}
                      
                      <div className="relative z-10 flex items-center justify-center space-x-2">
                        {isSelected && (
                          <CheckCircleIcon className="h-4 w-4 animate-bounce" />
                        )}
                        <span className={isSelected ? 'drop-shadow-sm' : ''}>
                          {slot.time}
                        </span>
                      </div>
                      
                      {/* Booked overlay */}
                      {slot.isBooked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                            Booked
                          </span>
                        </div>
                      )}
                      
                      {/* Hover effect */}
                      {!slot.isBooked && !isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-gray-600">Booked</span>
              </div>
              {selectedTime && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  <span className="text-primary-700 font-semibold">Selected</span>
                </div>
              )}
            </div>
            <div className="text-gray-600">
              {slots.filter(s => !s.isBooked).length} of {slots.length} slots available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;