'use client';

import { useState, useMemo } from 'react';
import { GarageSale } from '@/types/garage-sales.types';

interface CalendarViewProps {
  sales: GarageSale[];
  onSaleClick?: (sale: GarageSale) => void;
}

/**
 * CalendarView Component
 * 
 * Displays garage sales in a monthly calendar format with:
 * - Month navigation (previous/next)
 * - Color-coded sale indicators
 * - Today highlighting
 * - Multiple sales per day support
 * - Detailed sale list below calendar
 * - Click to scroll to sale details
 * 
 * @example
 * ```tsx
 * <CalendarView
 *   sales={garageSales}
 *   onSaleClick={handleSaleClick}
 * />
 * ```
 */
export default function CalendarView({
  sales,
  onSaleClick,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Group sales by date
  const salesByDate = useMemo(() => {
    return sales.reduce((acc, sale) => {
      const date = sale.sale_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(sale);
      return acc;
    }, {} as Record<string, GarageSale[]>);
  }, [sales]);

  // Get calendar configuration for current month
  const calendarConfig = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return { year, month, days, daysInMonth };
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(calendarConfig.year, calendarConfig.month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(calendarConfig.year, calendarConfig.month + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const formatDateKey = (day: number): string => {
    const date = new Date(calendarConfig.year, calendarConfig.month, day);
    return date.toISOString().split('T')[0];
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      calendarConfig.month === today.getMonth() &&
      calendarConfig.year === today.getFullYear()
    );
  };

  const isPastDay = (day: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(calendarConfig.year, calendarConfig.month, day);
    return dayDate < today;
  };

  // Get sorted list of dates with sales
  const sortedSalesDates = useMemo(() => {
    return Object.entries(salesByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .filter(([date]) => {
        // Only show sales in the current month view
        const saleDate = new Date(date);
        return saleDate.getMonth() === calendarConfig.month &&
               saleDate.getFullYear() === calendarConfig.year;
      });
  }, [salesByDate, calendarConfig.month, calendarConfig.year]);

  const handleDayClick = (dateKey: string, daySales: GarageSale[]) => {
    if (daySales.length === 1 && onSaleClick) {
      onSaleClick(daySales[0]);
    } else {
      // Scroll to the date section
      const element = document.getElementById(`day-sales-${dateKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-dark-800 rounded-xl p-4 border border-gray-700">
        <button
          onClick={goToPreviousMonth}
          className="flex items-center gap-2 px-4 py-2 text-aurora-green hover:bg-dark-700 rounded-lg transition-all font-medium"
        >
          <span>←</span>
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-white">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={goToToday}
            className="ml-2 px-3 py-1 text-xs bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition-all font-medium"
          >
            Today
          </button>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="flex items-center gap-2 px-4 py-2 text-aurora-green hover:bg-dark-700 rounded-lg transition-all font-medium"
        >
          <span className="hidden sm:inline">Next</span>
          <span>→</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-dark-800 rounded-xl p-4 border border-gray-700">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day[0]}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarConfig.days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateKey = formatDateKey(day);
            const daySales = salesByDate[dateKey] || [];
            const hasMultipleSales = daySales.length > 1;
            const hasSales = daySales.length > 0;
            const today = isToday(day);
            const past = isPastDay(day);

            return (
              <button
                key={day}
                onClick={() => hasSales && handleDayClick(dateKey, daySales)}
                disabled={!hasSales}
                className={`
                  aspect-square relative rounded-lg border transition-all
                  ${today ? 'border-aurora-green bg-aurora-green/10 ring-2 ring-aurora-green/30' : ''}
                  ${hasSales && !today ? 'border-aurora-blue bg-aurora-blue/10 hover:bg-aurora-blue/20 cursor-pointer' : ''}
                  ${!hasSales && !today ? 'border-gray-700 bg-dark-700' : ''}
                  ${past && !today && !hasSales ? 'opacity-50' : ''}
                  ${hasSales ? 'hover:scale-105' : ''}
                `}
              >
                {/* Day Number */}
                <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5">
                  <span
                    className={`
                      text-xs sm:text-sm font-medium
                      ${today ? 'text-aurora-green font-bold' : ''}
                      ${hasSales && !today ? 'text-white' : ''}
                      ${!hasSales && !today ? 'text-gray-500' : ''}
                    `}
                  >
                    {day}
                  </span>
                </div>

                {/* Sale Indicators */}
                {hasSales && (
                  <div className="absolute bottom-1 left-1 right-1 sm:bottom-1.5 sm:left-1.5 sm:right-1.5">
                    {hasMultipleSales ? (
                      <div className="text-center">
                        <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-aurora-blue text-white text-xs font-bold rounded">
                          {daySales.length}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-base sm:text-lg">📦</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Today indicator */}
                {today && (
                  <div className="absolute top-0 right-0">
                    <div className="w-2 h-2 bg-aurora-green rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sales by Date Below Calendar */}
      {sortedSalesDates.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📅</span>
            <span>Sales This Month</span>
            <span className="text-sm font-normal text-gray-400">
              ({sortedSalesDates.reduce((sum, [, sales]) => sum + sales.length, 0)} total)
            </span>
          </h3>
          
          {sortedSalesDates.map(([date, dateSales]) => {
            const saleDate = new Date(date + 'T00:00:00');
            const dayOfWeek = saleDate.toLocaleDateString('en-US', { weekday: 'long' });
            const monthDay = saleDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            const today = new Date();
            const daysUntil = Math.ceil((saleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={date} id={`day-sales-${date}`} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-md font-semibold text-aurora-green">
                    {dayOfWeek}, {monthDay}
                  </h4>
                  {daysUntil === 0 && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                      TODAY
                    </span>
                  )}
                  {daysUntil === 1 && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                      TOMORROW
                    </span>
                  )}
                  <span className="text-sm text-gray-400">
                    ({dateSales.length} {dateSales.length === 1 ? 'sale' : 'sales'})
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dateSales.map(sale => (
                    <button
                      key={sale.id}
                      onClick={() => onSaleClick && onSaleClick(sale)}
                      className="bg-dark-700 rounded-lg p-3 border border-gray-700 hover:border-aurora-green/30 transition-all text-left w-full"
                    >
                      <h5 className="font-semibold text-white text-sm mb-1">{sale.title}</h5>
                      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                        <span>📍</span>
                        <span>{sale.address}</span>
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-aurora-blue flex items-center gap-1">
                          <span>🕐</span>
                          <span>{sale.start_time} - {sale.end_time}</span>
                        </span>
                        {sale.distance_km !== undefined && (
                          <span className="text-aurora-purple">
                            {sale.distance_km < 1
                              ? `${Math.round(sale.distance_km * 1000)}m`
                              : `${sale.distance_km.toFixed(1)}km`}
                          </span>
                        )}
                      </div>
                      {sale.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {sale.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-dark-800 text-gray-400 text-xs rounded capitalize"
                            >
                              {tag}
                            </span>
                          ))}
                          {sale.tags.length > 3 && (
                            <span className="text-gray-500 text-xs">
                              +{sale.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-white mb-2">No garage sales this month</h3>
          <p className="text-gray-400 mb-4">Check other months or add one yourself!</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={goToPreviousMonth}
              className="px-4 py-2 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-all border border-gray-700"
            >
              ← Previous Month
            </button>
            <button
              onClick={goToNextMonth}
              className="px-4 py-2 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-all border border-gray-700"
            >
              Next Month →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

