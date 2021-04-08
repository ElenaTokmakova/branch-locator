import React from 'react';
import './hours-table.scss';
import { formatTime } from "../shared/functions";

const HoursTable = ({ days }) => {
    return (
        <table className="hoursTable">
        <tbody>
            {
                (days && days.length > 0) &&
                days.map(day => {
                    return (
                        <tr key={day.DayOfWeekName} className="hrow">
                            <td className="hcell">{day.DayOfWeekName}</td>
                            <td className="hcell timing">{formatTime(day.FromTime_Format)} - {formatTime(day.ToTime_Format)}</td>
                        </tr>
                    )
                })
            }
        </tbody>
    </table>
    );
}

export default HoursTable;






